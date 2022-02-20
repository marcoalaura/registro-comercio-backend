import { Status } from 'src/common/constants';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { GetJsonData } from 'src/common/lib/json.module';
import { EntityRepository, ILike, Repository } from 'typeorm';
import { Clasificador } from '../entities/clasificadores.entity';

@EntityRepository(Clasificador)
export class ClasificadorRepository extends Repository<Clasificador> {
  async listar(query: PaginacionQueryDto) {
    const { limite, saltar, filtro } = query;
    const parametros = filtro ? GetJsonData(filtro) : null;
    const queryBuilder = this.createQueryBuilder('c')
      .select(['c.id', 'c.tipo', 'c.codigo', 'c.descripcion'])
      .offset(saltar)
      .limit(limite);
    if (parametros.codigoNombre) {
      queryBuilder.where([
        { codigo: ILike(`%${parametros.codigoNombre}%`) },
        { descripcion: ILike(`%${parametros.codigoNombre}%`) },
      ]);
    }
    if (parametros.id) {
      queryBuilder.where([{ id: parametros.id }]);
    }
    if (parametros.codigo) {
      queryBuilder.where([{ codigo: parametros.codigo }]);
    }
    queryBuilder.andWhere('c.estado = :estado', { estado: Status.ACTIVE });
    queryBuilder.andWhere('c.tipo = :tipo', { tipo: parametros.tipo });
    return queryBuilder.getManyAndCount();
  }

  async obtenerDescripcion(tipo: string, codigo: string) {
    const queryBuilder = this.createQueryBuilder('c')
      .select(['c.descripcion'])
      .where('c.codigo = :codigo and c.tipo = :tipo', { codigo, tipo });
    return queryBuilder.getOne();
  }
}
