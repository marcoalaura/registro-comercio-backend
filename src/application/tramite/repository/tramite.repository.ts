import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { GetJsonData, GetOrderBy } from 'src/common/lib/json.module';
import * as dayjs from 'dayjs';
import { Tramite } from '../entities/tramite/tramite.entity';
import {
  ObservacionEstado,
  Status,
  TipoTramite,
} from '../../../common/constants';
import {
  TRAMITE_ACTUALIZACION_MATRICULA,
  TramiteEstado,
} from '../../../common/constants';
import { FiltrosPublicacionDto } from 'src/application/publicacion/dto/filtros-publicacion.dto';

/* eslint max-lines: ["error", {"max": 1000, "skipComments": true}] */
@EntityRepository(Tramite)
export class TramiteRepository extends Repository<Tramite> {
  // eslint-disable-next-line max-lines-per-function
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

    const query = this.createQueryBuilder('t')
      .leftJoinAndSelect('t.parametrica', 'p')
      .select([
        't.id',
        't.fechaSolicitud',
        't.fechaConclusion',
        't.estado',
        't.fechaCreacion',
        't.codigo',
        't.fechaObservacion',
        't.paso',
        'p.id',
        'p.nombre',
        'p.codigo',
        'p.rutaFront',
      ])
      .where(
        't.idUsuarioPropietario = :usuarioAuditoria AND (t.idEmpresa = :idEmpresa OR t.idEmpresa IS NULL)',
        { usuarioAuditoria, idEmpresa },
      )
      .offset(saltar)
      .limit(limite);

    if (order) query.orderBy(orden, ordenPor);
    else query.orderBy('t.fechaSolicitud', 'DESC');

    if (parametros?.estado) {
      if (parametros.estado === TramiteEstado.EN_CURSO)
        query.andWhere('t.estado NOT IN (:...estado)', {
          estado: [
            TramiteEstado.INSCRITO,
            TramiteEstado.ELIMINADO,
            TramiteEstado.SOLICITUD,
            TramiteEstado.OBSERVADO,
            TramiteEstado.ANULADO,
          ],
        });
      else if (parametros.estado === TramiteEstado.SOLICITUD)
        query.andWhere('t.estado IN (:...estado)', {
          estado: [
            TramiteEstado.SOLICITUD,
            TramiteEstado.APROBANDO,
            TramiteEstado.PRESENTADO,
          ],
        });
      else query.andWhere('t.estado = :estado', { estado: parametros.estado });
    }

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
    if (parametros?.fechasConclusiones) {
      const fechas = parametros.fechasConclusiones.split('~');
      query.andWhere(
        't.fechaConclusion BETWEEN :fechaInicial AND :fechaFinal',
        {
          fechaInicial: fechas[0],
          fechaFinal: `'${fechas[1]} 24:00:00'`,
        },
      );
    }

    return query.getManyAndCount();
  }

  // eslint-disable-next-line max-lines-per-function
  listarBandeja(
    paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria,
    options: any = {},
  ) {
    const { limite, saltar, filtro, ordenFiltrar } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = this.createQueryBuilder('t')
      .leftJoinAndSelect('t.parametrica', 'p')
      .leftJoinAndSelect('t.empresa', 'e')
      .leftJoinAndSelect('t.usuarioPropietario', 'u')
      .leftJoinAndSelect('u.persona', 'pe')
      .select([
        't.id',
        't.codigo',
        'p.codigo',
        'p.tipo',
        'p.nombre',
        'e.razonSocial',
        't.fechaSolicitud',
        't.fechaReingreso',
        't.fechaObservacion',
        't.fechaConclusion',
        't.fechaInscrito',
        't.estado',
      ])
      .where('t.estado != :estado', { estado: TramiteEstado.SOLICITUD })
      .offset(saltar)
      .limit(limite);

    const orden = ordenFiltrar([
      'p.nombre',
      'e.razon_social',
      't.fecha_solicitud',
      't.fecha_reingreso',
      't.fecha_observacion',
      't.fecha_conclusion',
      't.fecha_inscrito',
    ]);
    if (Object.keys(orden).length) {
      query.orderBy(orden);
    } else {
      query.orderBy('t.fechaSolicitud', 'DESC');
    }
    query.addOrderBy('t.id', 'ASC');

    if (options.estados) {
      query.andWhere('t.estado IN (:...estados)', { estados: options.estados });
    }

    if (options.reqQuery.codigo) {
      query.andWhere('t.codigo ILIKE :codigo', {
        codigo: `%${options.reqQuery.codigo}%`,
      });
    }
    if (options.reqQuery.tramite) {
      query.andWhere('p.nombre ILIKE :tramite', {
        tramite: `%${options.reqQuery.tramite}%`,
      });
    }
    if (options.reqQuery.fechaIngreso) {
      try {
        const fechaIngreso = JSON.parse(options.reqQuery.fechaIngreso);
        query.andWhere(
          't.fecha_solicitud BETWEEN :desde AND :hasta',
          fechaIngreso,
        );
      } catch (error) {
        console.error(error.message);
      }
    }
    if (options.reqQuery.fechaInscrito) {
      try {
        const fechaInscrito = JSON.parse(options.reqQuery.fechaInscrito);
        query.andWhere(
          't.fecha_inscrito BETWEEN :desde AND :hasta',
          fechaInscrito,
        );
      } catch (error) {
        console.error(error.message);
      }
    }

    if (parametros?.codigo) {
      query.andWhere('p.codigo = :codigo', { codigo: parametros.codigo });
    }

    if (parametros?.nombre) {
      query.andWhere('p.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }

    if (parametros?.fechaSolicitudIni && parametros?.fechaSolicitudFin) {
      query.andWhere('t.fechaSolicitud >= :fechaSolicitudIni', {
        fechaSolicitudIni: parametros.fechaSolicitudIni,
      });
      query.andWhere('t.fechaSolicitud < :fechaSolicitudFin', {
        fechaSolicitudFin: `'${parametros.fechaSolicitudFin} 24:00:00'`,
      });
    }

    if (parametros?.fechaConclusionIni && parametros?.fechaConclusionFin) {
      query.andWhere('t.fechaConclusion >= :fechaConclusionIni', {
        fechaConclusionIni: parametros.fechaConclusionIni,
      });
      query.andWhere('t.fechaConclusion < :fechaConclusionFin', {
        fechaConclusionFin: `'${parametros.fechaConclusionFin} 24:00:00'`,
      });
    }

    if (
      parametros?.fechaActualizacionIni &&
      parametros?.fechaActualizacionFin
    ) {
      query.andWhere('t.fechaActualizacion >= :fechaActualizacionIni', {
        fechaActualizacionIni: parametros.fechaActualizacionIni,
      });
      query.andWhere('t.fechaActualizacion < :fechaActualizacionFin', {
        fechaActualizacionFin: `'${parametros.fechaActualizacionFin} 24:00:00'`,
      });
    }

    return query.getManyAndCount();
  }

  buscarPorId(id: number) {
    return getRepository(Tramite)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.empresa', 'e')
      .leftJoinAndSelect('t.usuarioPropietario', 'u')
      .leftJoinAndSelect('t.usuarioFuncionario', 'uf')
      .leftJoinAndSelect('u.persona', 'pe')
      .leftJoinAndSelect('t.parametrica', 'p')
      .leftJoinAndSelect('t.establecimiento', 'es')
      .leftJoinAndSelect('t.bitacoras', 'b')
      .leftJoinAndSelect('t.detalles', 'de')
      .leftJoinAndSelect('t.liquidaciones', 'l')
      .where('t.id = :id', { id })
      .getOne();
    // .leftJoinAndSelect('t.documentos', 'd')
  }

  datosPorId(id: number) {
    return this.createQueryBuilder('t')
      .leftJoinAndSelect('t.parametrica', 'p')
      .select(['t.id', 't.paso', 'p.id', 'p.rutaFront'])
      .where('t.id = :id', { id })
      .getOne();
  }

  buscarEstadoPorId(id: number) {
    return this.createQueryBuilder('t')
      .select(['t.id', 't.estado'])
      .where('t.id = :id', { id })
      .getOne();
  }

  obtenerDatosCatalogoTramite(id: number) {
    return this.createQueryBuilder('t')
      .leftJoinAndSelect('t.detalles', 'd')
      .leftJoinAndSelect('t.documentos', 'ds')
      .leftJoinAndSelect('d.observaciones', 'co')
      .leftJoinAndSelect('ds.observaciones', 'dso')
      .where('t.id = :id', { id })
      .andWhere(
        '(co.estado is null OR (co.estado is not null AND co.estado = :estado))',
        { estado: ObservacionEstado.ACTIVE },
      )
      .andWhere(
        '(dso.estado is null OR (dso.estado is not null AND dso.estado = :estado))',
        { estado: ObservacionEstado.ACTIVE },
      )
      .getOne();
  }
  // version para obtener valor de los campos con observaciones inactivas
  obtenerDatosCatalogoTramiteInactivo(id: number) {
    return this.createQueryBuilder('t')
      .leftJoinAndSelect('t.detalles', 'd')
      .leftJoinAndSelect('t.documentos', 'ds')
      .leftJoinAndSelect('d.observaciones', 'co', `co.estado = :estado`, {
        estado: ObservacionEstado.ACTIVE,
      })
      .leftJoinAndSelect('ds.observaciones', 'dso', `dso.estado = :estado`, {
        estado: ObservacionEstado.ACTIVE,
      })
      .where('t.id = :id', { id })
      .getOne();
  }

  obtenerCantidadTramitesPorEstado(idEmpresa: number, estado: string) {
    return this.createQueryBuilder('t')
      .select(['count(1) as "cantidad"'])
      .where('t.idEmpresa = :idEmpresa', { idEmpresa })
      .andWhere('t.estado = :estado', { estado })
      .getRawOne();
  }

  obtenerUltimaActualizacionMatricula(idEmpresa: number) {
    return this.createQueryBuilder('t')
      .select(['t.fechaConclusion'])
      .where('t.idEmpresa = :idEmpresa', { idEmpresa })
      .andWhere('t.idParametrica = :parametricaTramite', {
        parametricaTramite: TRAMITE_ACTUALIZACION_MATRICULA,
      })
      .andWhere('t.estado = :estado', {
        estado: TramiteEstado.CONCLUIDO,
      })
      .orderBy('t.fechaConclusion', 'DESC')
      .getOne();
  }

  crearCabeceraTramite(params: any) {
    return this.createQueryBuilder()
      .insert()
      .into(Tramite)
      .values({
        version: params.version,
        codigo: params.codigo,
        fechaSolicitud: new Date(),
        fechaConclusion: null,
        fechaObservacion: null,
        estado: TramiteEstado.SOLICITUD,
        idEmpresa: params.idEmpresa,
        idEstablecimiento: params.idEstablecimiento,
        idParametrica: params.idCatalogoTramite,
        idUsuarioPropietario: params.usuarioAuditoria,
        idUsuarioFuncionario: null,
        fechaCreacion: new Date(),
        usuarioCreacion: params.usuarioAuditoria,
      })
      .returning(['id', 'estado', 'codigo'])
      .execute();
  }

  seguimientoPorTramite(idTramite: number) {
    return this.createQueryBuilder('t')
      .leftJoinAndSelect('t.bitacoras', 'b')
      .leftJoinAndSelect('b.usuario', 'u')
      .leftJoinAndSelect('u.persona', 'p')
      .leftJoinAndSelect('t.empresa', 'e')
      .select([
        't.id',
        'b.id',
        'b.operacion',
        'b.fecha',
        'u.id',
        'p.nroDocumento',
        'p.nombres',
        'p.primerApellido',
        'p.segundoApellido',
        'e.razonSocial',
      ])
      .where('b.estado =:activo', { activo: Status.ACTIVE })
      .andWhere('t.id =:idTramite', { idTramite })
      .orderBy('b.fecha', 'DESC')
      .getMany();
  }

  runTransaction(op) {
    return this.manager.transaction(op);
  }

  direccionPorTramite(idTramite: number) {
    return this.createQueryBuilder('t')
      .innerJoinAndSelect('t.establecimiento', 'e')
      .innerJoinAndSelect('e.direcciones', 'd')
      .select([
        't.id',
        'e.id',
        'd.codTipoDireccion',
        'd.codDepartamento',
        'd.codProvincia',
        'd.codMunicipio',
        'd.codTipoSubdivisionGeografica',
        'd.nombreSubdivisionGeografica',
        'd.codTipoVia',
        'd.nombreVia',
        'd.numeroDomicilio',
        'd.manzana',
        'd.uv',
        'd.edificio',
        'd.piso',
        'd.codTipoAmbiente',
        'd.numeroNombreAmbiente',
        'd.direccionReferencial',
        'd.latitud',
        'd.longitud',
      ])
      .where('d.estado =:activo', { activo: Status.ACTIVE })
      .andWhere('t.id =:idTramite', { idTramite })
      .getMany();
  }

  // Obterner observaciones de un tramite
  listarPorTramiteFormato(idTramite: number) {
    return this.createQueryBuilder('t')
      .leftJoinAndSelect('t.detalles', 'de')
      .leftJoinAndSelect('de.observaciones', 'deobs', `deobs.estado = 'ACTIVO'`)
      .leftJoinAndSelect('t.documentos', 'do')
      .leftJoinAndSelect('do.observaciones', 'dobs', `dobs.estado = 'ACTIVO'`)
      .leftJoinAndSelect('t.observaciones', 'obs', `obs.estado = 'ACTIVO'`)
      .select([
        't.id',
        'de.id',
        'deobs.id',
        'deobs.estado',
        'deobs.valorObservado',
        'deobs.observacion',
        'de.campo',
        'do.id',
        'dobs.id',
        'dobs.estado',
        'dobs.valorObservado',
        'dobs.observacion',
        'do.campo',
        'obs.id',
        'obs.estado',
        'obs.valorObservado',
        'obs.observacion',
      ])
      .where('t.id = :idTramite', {
        idTramite,
      })
      .getMany();
  }

  /**
   * Methods - PUBLICACIONES
   */
  async listarPublicaciones(
    paginacionQueryDto: FiltrosPublicacionDto,
    idEmpresa: string,
    estado: string,
  ) {
    const { limite, saltar, filtro, order } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const { orden, ordenPor } = order
      ? GetOrderBy(order)
      : { orden: null, ordenPor: null };

    const query = this.createQueryBuilder('t')
      .innerJoinAndSelect('t.parametrica', 'p')
      .select(['t.id', 't.fechaSolicitud', 't.codigo', 'p.nombre', 'p.id'])
      .where('t.idEmpresa = :idEmpresa', { idEmpresa })
      .andWhere('t.tipoTramite = :tipo', { tipo: TipoTramite.PUBLICACION })
      .andWhere('t.estado = :estado', { estado })
      .offset(saltar)
      .limit(limite);

    if (parametros?.fechasSolicitud) {
      const fechas = parametros.fechasSolicitud.split('~');
      query.andWhere('t.fechaSolicitud BETWEEN :fechaInicial AND :fechaFinal', {
        fechaInicial: fechas[0],
        fechaFinal: `${fechas[1]} 23:59:59`,
      });
    }
    if (parametros?.idParametricaCategoria) {
      query.andWhere('p.idParametricaCategoria = :id', {
        id: parametros.idParametricaCategoria,
      });
    }

    if (order) query.orderBy(orden, ordenPor);
    else query.orderBy('t.fechaSolicitud', 'DESC');

    return query.getManyAndCount();
  }

  crearSolicitudPublicacion(params: any) {
    return this.createQueryBuilder()
      .insert()
      .into(Tramite)
      .values({
        nombre: params.nombre,
        codigo: params.codigo,
        version: params.version,
        fechaSolicitud: dayjs(), // al momento de crear
        fechaPublicacion: dayjs(params.fechaPublicacion), // Debe tener minimamente 8 dias antes de la publicacion?
        tipoTramite: TipoTramite.PUBLICACION,
        estado: TramiteEstado.SOLICITUD,
        idEmpresa: params.idEmpresa,
        idParametrica: params.idCatalogoPublicacion,
        fechaCreacion: dayjs(),
        usuarioCreacion: params.usuarioAuditoria,
        idUsuarioPropietario: params.usuarioAuditoria,
      })
      .returning(['id', 'titulo', 'estado', 'codigo', 'fecha_publicacion'])
      .execute();
  }

  obtenerPublicacionPorId(id: number) {
    return this.createQueryBuilder('t')
      .select([
        't.id AS "id"',
        't.codigo AS "codigo"',
        't.nombre AS "titulo"',
        't.fechaPublicacion AS "fechaPublicacion"',
        't.estado AS "estado"',
        't.idEmpresa AS "idEmpresa"',
      ])
      .where('t.id = :id', { id })
      .andWhere('t.tipoTramite = :tipo', { tipo: TipoTramite.PUBLICACION })
      .getRawOne();
  }

  actualizarEstadoPublicacion(params: any) {
    return this.createQueryBuilder()
      .update(Tramite)
      .set({
        estado: params.estado,
        usuarioActualizacion: params.usuarioAuditoria,
      })
      .where('id = :id', { id: params.id })
      .execute();
  }

  obtenerDatosCatalogoPublicacion(id: number) {
    return this.createQueryBuilder('t')
      .leftJoinAndSelect('t.detalles', 'd')
      .where('t.id = :id', { id })
      .getOne();
  }

  actualizarCabeceraTramite(params: any, id: number) {
    return this.createQueryBuilder()
      .update(Tramite)
      .set(params)
      .where('id = :id', { id })
      .returning('*')
      .execute();
  }

  findById(id: number) {
    return getRepository(Tramite)
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.parametrica', 'p')
      .where('t.id = :id', { id })
      .getOne();
  }
}
