import { FiltrosPublicacionDto } from 'src/application/publicacion/dto/filtros-publicacion.dto';
import { Status } from 'src/common/constants';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { GetJsonData, GetOrderBy } from 'src/common/lib/json.module';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Campo } from '../entities/parametricas/campo.entity';
import { ParametricaCategoria } from '../entities/parametricas/parametrica-categoria.entity';

import { Parametrica } from '../entities/parametricas/parametrica.entity';

@EntityRepository(Parametrica)
export class ParametricaRepository extends Repository<Parametrica> {
  listarParametricaTramites(tipo: string, buscar: string) {
    const q = this.createQueryBuilder('pt')
      .innerJoin('pt.parametricaCategoria', 'ptc')
      .select([
        'pt.id as "idParametrica"',
        'pt.nombre as "nombreParametrica"',
        'pt.codigo as "codigoParametrica"',
        'pt.api as "rutaParametrica"',
        'pt.rutaFront as "rutaFront"',
        'pt.preRutaFront as "preRutaFront"',
        'ptc.id as "idParametricaCategoria"',
        'ptc.nombre as "nombreParametricaCategoria"',
        'ptc.orden as "ordenParametricaCategoria"',
      ])
      .where('pt.tipo = :tipo', { tipo })
      .orderBy('pt.id');
    if (buscar) {
      q.andWhere('pt.nombre ilike :nombre', {
        nombre: `%${buscar}%`,
      });
    }
    return q.getRawMany();
  }

  // eslint-disable-next-line max-lines-per-function
  async obtenerCataloTramitePorId(idCatalogoTramite: number) {
    const result = await this.createQueryBuilder('ct')
      .leftJoin('ct.grupos', 'g')
      .leftJoin('g.secciones', 's')
      .leftJoin('s.campos', 'c')
      .select([
        'ct.id',
        'ct.nombre',
        'ct.codigo',
        'ct.tipo',
        'ct.version',
        'ct.requierePago',
        'ct.requierePresentacion',
        'ct.requiereRevision',
        'ct.requierePublicacion',
        'ct.emiteCertificado',
        'ct.requiereRegistrarEditarSeccion',
        'ct.duracion',
        'ct.api',
        'ct.rutaFront',
        'ct.preRutaFront',
        'ct.requiereMatriculaVigente',
        'g.id',
        'g.nombre',
        'g.descripcion',
        'g.orden',
        'g.flujo',
        'g.documentoSoporte',
        'g.aprobacionDocumentos',
        'g.pago',
        's.id',
        's.nombre',
        's.descripcion',
        's.orden',
        'c.id',
        'c.campo',
        'c.tipo',
        'c.label',
        'c.tooltip',
        'c.orden',
        'c.iop',
        'c.desabilitado',
        'c.valorDefecto',
        'c.validacion',
        'c.parametrica',
        'c.filtro',
        'c.maxMinFecha',
        'c.size',
        'c.tabla',
        'c.cantidadMax',
        'c.documentoSoporte',
        'c.codigoTipoDocumento',
        'c.criterioOpcional',
        'c.campoPadre',
        'c.campoHijo',
        'c.parametricaText',
      ])
      .where('ct.id = :idCatalogoTramite', { idCatalogoTramite })
      .orderBy('g.orden')
      .addOrderBy('s.orden')
      .addOrderBy('c.orden')
      .getOne();

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  async obtenerCatalogoTramitePorCodigo(codigoCatalogoTramite: string) {
    const result = await this.createQueryBuilder('ct')
      .leftJoin('ct.grupos', 'g')
      .leftJoin('g.secciones', 's')
      .leftJoin('s.campos', 'c')
      .select([
        'ct.id',
        'ct.nombre',
        'ct.codigo',
        'ct.tipo',
        'ct.version',
        'ct.requierePago',
        'ct.requierePresentacion',
        'ct.requiereRevision',
        'ct.requierePublicacion',
        'ct.emiteCertificado',
        'ct.duracion',
        'ct.api',
        'ct.rutaFront',
        'ct.preRutaFront',
        'ct.requiereMatriculaVigente',
        'g.id',
        'g.nombre',
        'g.descripcion',
        'g.orden',
        'g.flujo',
        'g.documentoSoporte',
        'g.aprobacionDocumentos',
        'g.pago',
        's.id',
        's.nombre',
        's.descripcion',
        's.orden',
        'c.id',
        'c.campo',
        'c.tipo',
        'c.label',
        'c.tooltip',
        'c.orden',
        'c.iop',
        'c.desabilitado',
        'c.valorDefecto',
        'c.validacion',
        'c.parametrica',
        'c.filtro',
        'c.maxMinFecha',
        'c.size',
        'c.tabla',
        'c.cantidadMax',
        'c.documentoSoporte',
        'c.codigoTipoDocumento',
        'c.criterioOpcional',
      ])
      .where('ct.codigo = :codigoCatalogoTramite', { codigoCatalogoTramite })
      .orderBy('g.orden')
      .addOrderBy('s.orden')
      .addOrderBy('c.orden')
      .getOne();

    return result;
  }

  obtenerCampos(idCatalogoTramite) {
    return getRepository(Campo)
      .createQueryBuilder('c')
      .leftJoin('c.seccion', 's')
      .leftJoin('s.grupo', 'g')
      .leftJoin('g.catalogoTramite', 'ct')
      .select([
        'c.id as "id"',
        'c.campo as "campo"',
        'c.tipo as "tipo"',
        'c.label as "label"',
        'c.tooltip as "tooltip"',
        'c.orden as "orden"',
        'c.iop as "iop"',
        'c.desabilitado as "desabilitado"',
        'c.valorDefecto as "valorDefecto"',
        'c.validacion as "validacion"',
        'c.parametrica as "parametrica"',
        'c.filtro as "filtro"',
        'c.maxMinFecha as "maxMinFecha"',
        'c.size as "size"',
        'c.tabla as "tabla"',
        'c.cantidadMax as "cantidadMax"',
        'c.documentoSoporte as "documentoSoporte"',
        'c.codigoTipoDocumento as "codigoTipoDocumento"',
        'c.criterioOpcional as "criterioOpcional"',
        'c.idSeccion as "idSeccion"',
        'ct.requiereRegistrarEditarSeccion as "requiereRegistrarEditarSeccion"',
      ])
      .where('ct.id = :idCatalogoTramite', { idCatalogoTramite })
      .getRawMany();
  }

  async listarParametricaPublicaciones(
    tipoCatalogo: string,
    tipoSocietario: string,
  ) {
    const q = this.createQueryBuilder('pt')
      .innerJoin('pt.parametricaCategoria', 'ptc')
      .select([
        'pt.id as "idParametrica"',
        'pt.nombre as "nombreParametrica"',
        'pt.codigo as "codigoParametrica"',
        'pt.api as "rutaParametrica"',
        'ptc.id as "idParametricaCategoria"',
        'ptc.nombre as "nombreParametricaCategoria"',
        'ptc.orden as "ordenParametricaCategoria"',
      ])
      .where('pt.tipoCatalogo = :tipoCatalogo', { tipoCatalogo })
      .andWhere(':tipoSocietario = ANY(pt.tipoSocietarioHabilitado)', {
        tipoSocietario,
      })
      .andWhere('pt.tipoTramiteHabilitado is NULL');
    return q.getRawMany();
  }

  async listarCatalogoArancel(
    paginacionQueryDto: FiltrosPublicacionDto,
    tipoCatalogo: string,
  ) {
    const { limite, saltar, order } = paginacionQueryDto;
    const { orden, ordenPor } = order
      ? GetOrderBy(order)
      : { orden: null, ordenPor: null };

    const query = this.createQueryBuilder('ct')
      .innerJoin('ct.parametricaCategoria', 'c')
      .innerJoin('ct.aranceles', 'a')
      .select(['ct.codigo', 'ct.nombre', 'c.nombre', 'a.monto'])
      .where('ct.tipoCatalogo = :tipoCatalogo', { tipoCatalogo })
      .andWhere('a.estado = :estado', { estado: Status.ACTIVE })
      .offset(saltar)
      .limit(limite);

    if (orden) query.orderBy(orden, ordenPor);
    else query.orderBy('ct.codigo', 'ASC');

    return query.getManyAndCount();
  }

  async obtenerCategorias(paginacionQueryDto: PaginacionQueryDto) {
    const { filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(ParametricaCategoria)
      .createQueryBuilder('c')
      .select(['c.id', 'c.nombre'])
      .where('c.estado = :estado', { estado: Status.ACTIVE })
      .orderBy('c.orden', 'ASC');

    if (parametros?.tipoCatalogo) {
      query.andWhere('c.tipoCatalogo = :tipo', {
        tipo: parametros.tipoCatalogo,
      });
    }
    return query.getMany();
  }

  async listarDocumentosEmitidos(id: number, tipo: string) {
    const query = this.createQueryBuilder('c')
      .innerJoinAndSelect('c.documentosEmitidos', 'de')
      .select([
        'de.id as id',
        'de.nombre as nombre',
        'de.plantilla as plantilla',
        'de.usoQr as "usoQr"',
      ])
      .where('c.id = :id and de.tipo = :tipo', { id, tipo });

    return query.getRawMany();
  }
}
