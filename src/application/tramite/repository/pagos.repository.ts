import { EntityRepository, Repository } from 'typeorm';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { GetJsonData, GetOrderBy } from 'src/common/lib/json.module';

import { TramitePago } from '../entities/tramite/tramite-pago.entity';
import { Tramite } from '../entities/tramite/tramite.entity';

import { Status } from '../../../common/constants';
import { CrearPagoDTO } from '../dto/tramite-pago.dto';

@EntityRepository(TramitePago)
export class PagosRepository extends Repository<TramitePago> {
  //
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

    const query = this.createQueryBuilder('pa')
      .leftJoinAndSelect('pa.tramite', 't')
      .leftJoinAndSelect('t.parametrica', 'p')
      .select([
        't.id',
        't.codigo',
        'p.nombre',
        'p.codigo',
        'pa.fechaCreacion',
        'pa.id',
        'pa.numeroFactura',
      ])
      .where('t.idUsuarioPropietario = :usuarioAuditoria', { usuarioAuditoria })
      .andWhere('t.idEmpresa = :idEmpresa', { idEmpresa })
      .andWhere('pa.estado =:activo', { activo: Status.ACTIVE })
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
      query.andWhere('pa.fechaCreacion BETWEEN :fechaInicial AND :fechaFinal', {
        fechaInicial: fechas[0],
        fechaFinal: `'${fechas[1]} 24:00:00'`,
      });
    }

    return query.getManyAndCount();
  }

  async buscarPorIdTransaccionPpe(transaccion: string) {
    return this.createQueryBuilder('pago')
      .where(`pago.transaccion->>'idTransaccion' = :transaccion`, {
        transaccion,
      })
      .getOne();
  }

  async getIdTramite(id: number) {
    const query = this.createQueryBuilder('pago')
      .leftJoinAndSelect('pago.tramite', 'tramite')
      .select(['tramite.id', 'pago.id'])
      .where('pago.id = :id', { id })
      .getOne();

    return query;
  }

  async crearPago(data: CrearPagoDTO) {
    const tramite = new Tramite();
    tramite.id = data.idTramite;
    return this.save({ ...data, tramite });
  }

  async buscarPorIdTramite(id: string) {
    const tramite = new Tramite();
    tramite.id = parseInt(id, 10);
    const response = await this.findOne({
      where: { tramite },
      select: ['id', 'canalSolicitud', 'monto', 'estado'],
    });
    return response;
  }
}
