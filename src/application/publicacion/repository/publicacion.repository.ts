import { EntityRepository, Repository } from 'typeorm';
import { GetJsonData, GetOrderBy } from 'src/common/lib/json.module';

import { FiltrosPublicacionDto } from 'src/application/publicacion/dto/filtros-publicacion.dto';
import { Publicacion } from '../entities/publicacion.entity';

@EntityRepository(Publicacion)
export class PublicacionRepository extends Repository<Publicacion> {
  // eslint-disable-next-line max-lines-per-function
  async listar(paginacionQueryDto: FiltrosPublicacionDto, idEmpresa: string) {
    const { limite, saltar, filtro, order } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const { orden, ordenPor } = order
      ? GetOrderBy(order)
      : { orden: null, ordenPor: null };

    const query = this.createQueryBuilder('p')
      .innerJoinAndSelect('p.catalogoTramite', 'ct')
      .innerJoinAndSelect('ct.parametricaCategoria', 'c')
      .select([
        'p.id',
        'p.fechaPublicacion',
        'p.codigo',
        'p.titulo',
        'p.resumen',
        'p.estado',
        'ct.nombre',
        'c.nombre',
      ])
      .where('p.idEmpresa = :idEmpresa', { idEmpresa })
      .offset(saltar)
      .limit(limite);

    if (parametros?.fechasPublicacion) {
      const fechas = parametros.fechasPublicacion.split('~');
      query.andWhere(
        'p.fechaPublicacion BETWEEN :fechaInicial AND :fechaFinal',
        {
          fechaInicial: fechas[0],
          fechaFinal: `${fechas[1]} 23:59:59`,
        },
      );
    }
    if (parametros?.idParametricaCategoria) {
      query.andWhere('ct.idParametricaCategoria = :id', {
        id: parametros.idParametricaCategoria,
      });
    }
    if (parametros?.titulo) {
      query.andWhere('p.titulo ilike :titulo', {
        titulo: `%${parametros.titulo}%`,
      });
    }
    if (parametros?.resumen) {
      query.andWhere('p.resumen ilike :resumen', {
        resumen: `%${parametros.resumen}%`,
      });
    }

    if (order) query.orderBy(orden, ordenPor);
    else query.orderBy('p.fechaPublicacion', 'DESC');

    return query.getManyAndCount();
  }

  obtenerPorId(id: number) {
    return this.createQueryBuilder('p')
      .select([
        'p.id',
        'p.codigo',
        'p.titulo',
        'p.fechaPublicacion',
        'p.razonSocial',
        'p.matricula',
        'p.resumen',
        'p.nombreArchivo',
      ])
      .where('p.id = :id', { id })
      .getOne();
  }
}
