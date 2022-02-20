/* eslint-disable max-lines-per-function */
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, Repository } from 'typeorm';
import { CrearFacturaDto } from '../dto/factura.dto';
import { Factura } from '../entities/tramite/factura.entity';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { GetJsonData, GetOrderBy } from 'src/common/lib/json.module';
import { TramitePago } from '../entities/tramite/tramite-pago.entity';

@EntityRepository(Factura)
export class FacturaRepository extends Repository<Factura> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('factura')
      .select([
        'factura.id',
        'factura.numeroFactura',
        'factura.urlFactura',
        'factura.estado',
      ])
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
    return queryBuilder;
  }

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

    const query = this.createQueryBuilder('factura')
      .leftJoinAndSelect('factura.pago', 'pago')
      .leftJoinAndSelect('pago.tramite', 'tramite')
      .leftJoinAndSelect('tramite.parametrica', 'parametrica')
      .select([
        'tramite.id',
        'tramite.codigo',
        'parametrica.nombre',
        'parametrica.codigo',
        'pago.id',
        'factura.id',
        'factura.fechaEmision',
        'factura.numeroFactura',
        'factura.urlFactura',
        'factura.montoTotal',
        'factura.estado',
      ])
      .where('tramite.idEmpresa = :idEmpresa', { idEmpresa })
      // .andWhere('tramite.idUsuarioPropietario = :usuarioAuditoria', {
      //   usuarioAuditoria,
      // })
      .offset(saltar)
      .limit(limite);

    if (order) query.orderBy(orden, ordenPor);
    else query.orderBy('factura.fechaEmision', 'DESC');

    if (parametros?.codigoSeguimiento) {
      query.andWhere('factura.codigoSeguimiento ilike :codigo', {
        codigo: `%${parametros.codigoSeguimiento}%`,
      });
    }

    if (parametros?.fechaCreacion) {
      const fechas = parametros.fechaCreacion.split('~');
      query.andWhere(
        'factura.fechaCreacion BETWEEN :fechaInicial AND :fechaFinal',
        {
          fechaInicial: fechas[0],
          fechaFinal: `'${fechas[1]} 24:00:00'`,
        },
      );
    }

    if (parametros?.codigo) {
      query.andWhere('parametrica.codigo ilike :codigo', {
        codigo: `%${parametros.codigo}%`,
      });
    }

    if (parametros?.nombre) {
      query.andWhere('parametrica.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }

    if (parametros?.fechaEmision) {
      const fechas = parametros.fechaEmision.split('~');
      query.andWhere(
        'factura.fechaEmision BETWEEN :fechaInicial AND :fechaFinal',
        {
          fechaInicial: fechas[0],
          fechaFinal: `'${fechas[1]} 24:00:00'`,
        },
      );
    }

    return query.getManyAndCount();
  }

  async crear(
    facturaDto: CrearFacturaDto,
    idPago: number,
    usuarioAuditoria: string,
  ) {
    const pago = new TramitePago();
    pago.id = idPago;

    const {
      numeroFactura,
      estado,
      montoTotal,
      cuf,
      codigoSeguimiento,
      urlFactura,
      fechaEmision,
    } = facturaDto;

    const factura = new Factura();
    factura.pago = pago;
    factura.numeroFactura = numeroFactura;
    factura.estado = estado;
    factura.montoTotal = montoTotal;
    factura.codigoSeguimiento = codigoSeguimiento;
    factura.cuf = cuf;
    factura.urlFactura = urlFactura;
    factura.fechaEmision = fechaEmision;

    factura.usuarioCreacion = usuarioAuditoria;

    return this.save(factura);
    // return factura;
  }

  async buscarPorCodigoSeguimiento(codigoSeguimiento: string) {
    return this.createQueryBuilder('factura')
      .where('factura.codigoSeguimiento = :codigo', {
        codigo: codigoSeguimiento,
      })
      .getOne();
  }

  async getIdTramite(id: number) {
    const query = this.createQueryBuilder('factura')
      .leftJoinAndSelect('factura.pago', 'pago')
      .leftJoinAndSelect('pago.tramite', 'tramite')
      .select(['tramite.id', 'pago.id', 'factura.id'])
      .where('factura.id = :id', { id })
      .getOne();

    return query;
  }
}
