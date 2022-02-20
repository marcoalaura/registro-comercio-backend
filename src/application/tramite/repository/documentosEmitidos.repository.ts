import { EntityRepository, Repository } from 'typeorm';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { GetJsonData, GetOrderBy } from 'src/common/lib/json.module';

import { TramiteDocumentoEmitido } from '../entities/tramite/tramite-documento-emitido.entity';

import { Status } from '../../../common/constants';

@EntityRepository(TramiteDocumentoEmitido)
export class DocumentosEmitidosRepository extends Repository<TramiteDocumentoEmitido> {
  listarPorUsuarioEmpresa(
    paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    idEmpresa: string,
  ) {
    const { limite, saltar, filtro, order } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const { orden, ordenPor } = order
      ? GetOrderBy(order)
      : { orden: null, ordenPor: null };

    const query = this.createQueryBuilder('de')
      .leftJoinAndSelect('de.tramite', 't')
      .leftJoinAndSelect('t.parametrica', 'p')
      .select([
        't.id',
        't.codigo',
        'p.nombre',
        'p.codigo',
        'de.id',
        'de.fechaCreacion',
        'de.usoQr',
      ])
      .where('t.idUsuarioPropietario = :usuarioAuditoria', { usuarioAuditoria })
      .andWhere('t.idEmpresa = :idEmpresa', { idEmpresa })
      .andWhere('de.estado =:activo', { activo: Status.ACTIVE })
      .offset(saltar)
      .limit(limite);

    if (order) query.orderBy(orden, ordenPor);
    else query.orderBy('t.fechaSolicitud', 'DESC');

    if (parametros?.codigo) {
      query.andWhere('p.codigo ilike :codigo', {
        codigo: `%${parametros.codigo}%`,
      });
    }

    if (parametros?.nombre) {
      query.andWhere('p.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }
    if (parametros?.fechaCreacion) {
      const fechas = parametros.fechaCreacion.split('~');
      query.andWhere('de.fechaCreacion BETWEEN :fechaInicial AND :fechaFinal', {
        fechaInicial: fechas[0],
        fechaFinal: `'${fechas[1]} 24:00:00'`,
      });
    }

    return query.getManyAndCount();
  }
}
