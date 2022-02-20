/* eslint-disable max-lines-per-function */
import {
  Inject,
  Injectable,
  PreconditionFailedException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TramiteRepository } from '../repository/tramite.repository';
import { ObservacionRepository } from '../repository/observacion.repository';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import * as dayjs from 'dayjs';
import { TramiteEstado, Status } from '../../../common/constants';
import { PdfService } from '../../../common/lib/pdf.service';
import { ConfigService } from '@nestjs/config';
import { PlantillaTramite } from '../plantillas/plantilla-tramite';
import { FileService } from '../../../common/lib/file.service';
import { TramiteGenericoService } from './tramite-generico/tramite-generico.service';
import { ReporteService } from '../../reporte/reporte.service';
import { TramiteBitacoraRepository } from '../repository/tramite-bitacora.repository';
import { TramiteDocumentoSoporteRepository } from '../repository/tramite-documento-soporte.repository';
import { ParametricaRepository } from '../repository/parametrica.repository';
import { AprobacionService } from 'src/core/aprobacion/aprobacion.service';
import { getFileBase64 } from 'src/common/lib/hash-sum.module';
import { Tramite } from '../entities/tramite/tramite.entity';
import { Bitacora } from '../entities/tramite/bitacora.entity';
import { TramiteDocumentoEmitido } from '../entities/tramite/tramite-documento-emitido.entity';
import { ExternalServiceException } from 'src/common/exceptions/external-service.exception';
@Injectable()
export class TramiteService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(TramiteRepository)
    private tramiteRepository: TramiteRepository,
    @InjectRepository(ObservacionRepository)
    private observacionRepository: ObservacionRepository,
    @InjectRepository(TramiteBitacoraRepository)
    private bitacoraRepositorio: TramiteBitacoraRepository,
    @InjectRepository(TramiteDocumentoSoporteRepository)
    private tramiteDocumentoSoporteRepository: TramiteDocumentoSoporteRepository,
    @InjectRepository(ParametricaRepository)
    private parametricaRepository: ParametricaRepository,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(TramiteGenericoService)
    private readonly tramiteGenericoService: TramiteGenericoService,
    @Inject(ReporteService)
    private readonly reporteService: ReporteService,
    @Inject(AprobacionService)
    private readonly aprobacionService: AprobacionService,

    private readonly fileService: FileService,
  ) {}

  async listarPorUsuarioEmpresa(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    idEmpresa: string,
  ) {
    const resultado = await this.tramiteRepository.listarPorUsuarioEmpresa(
      paginacionQueryDto,
      usuarioAuditoria,
      idEmpresa,
    );
    return resultado;
  }

  async listarBandejaGrupo(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    reqQuery: any,
  ) {
    const estados = [TramiteEstado.PAGADO, TramiteEstado.ASIGNADO];
    const resultado = await this.tramiteRepository.listarBandeja(
      paginacionQueryDto,
      usuarioAuditoria,
      {
        estados,
        reqQuery,
      },
    );
    return resultado;
  }

  async listarBandejaObservados(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    reqQuery: any,
  ) {
    const estados = [TramiteEstado.OBSERVADO];
    const resultado = await this.tramiteRepository.listarBandeja(
      paginacionQueryDto,
      usuarioAuditoria,
      {
        estados,
        reqQuery,
      },
    );
    return resultado;
  }

  async listarBandejaPendientes(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    reqQuery: any,
  ) {
    const estados = [TramiteEstado.ASIGNADO, TramiteEstado.REVISION];
    const resultado = await this.tramiteRepository.listarBandeja(
      paginacionQueryDto,
      usuarioAuditoria,
      {
        estados,
        reqQuery,
      },
    );
    return resultado;
  }

  async listarBandejaConcluidos(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    reqQuery: any,
  ) {
    const estados = [TramiteEstado.CONCLUIDO];
    const resultado = await this.tramiteRepository.listarBandeja(
      paginacionQueryDto,
      usuarioAuditoria,
      {
        estados,
        reqQuery,
      },
    );
    return resultado;
  }

  async listarBandejaInscritos(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    reqQuery: any,
  ) {
    const estados = [TramiteEstado.INSCRITO];
    const resultado = await this.tramiteRepository.listarBandeja(
      paginacionQueryDto,
      usuarioAuditoria,
      {
        estados,
        reqQuery,
      },
    );
    return resultado;
  }

  async buscarPorId(id: number) {
    const tramite = await this.tramiteRepository.buscarPorId(id);
    if (!tramite) {
      throw new EntityNotFoundException(); // `Tramite con id ${id} no encontrado`
    }
    return tramite;
  }

  async datosPorId(id: number) {
    console.log('lleog', id);
    const tramite = await this.tramiteRepository.datosPorId(id);
    if (!tramite) {
      throw new EntityNotFoundException(); // `Tramite con id ${id} no encontrado`
    }
    return tramite;
  }

  async obtenerCantidadTramitesPorEstado(idEmpresa: number, estado: string) {
    const result =
      await this.tramiteRepository.obtenerCantidadTramitesPorEstado(
        idEmpresa,
        estado,
      );
    return result;
  }

  async obtenerUltimaActualizacionMatricula(idEmpresa: number) {
    let result = '01/01/1970';
    const tramite =
      await this.tramiteRepository.obtenerUltimaActualizacionMatricula(
        idEmpresa,
      );
    if (tramite) {
      result = dayjs(tramite.fechaConclusion).format('DD/MM/YYYY');
    }
    return result;
  }
  // eslint-disable-next-line max-params
  async cambioEstado(
    id: number,
    usuarioAuditoria: any,
    estadoOrigen: string,
    estadoDestino: any,
    transaction: any = null,
  ) {
    const tramite = await this.tramiteRepository.buscarEstadoPorId(id);
    let repositorio = null;
    let repBitacora = null;
    if (transaction) {
      repositorio = transaction.getRepository(Tramite);
      repBitacora = transaction.getRepository(Bitacora);
    } else {
      repositorio = this.tramiteRepository;
      repBitacora = this.bitacoraRepositorio;
    }

    if (!tramite)
      throw new PreconditionFailedException(
        `No se ha encontrado el tramite con id ${id}.`,
      );
    let result = null;
    if (tramite.estado === estadoOrigen) {
      // TODO: Comprobar que solamente lo realiza el rol JURIDICO
      result = await repositorio.update(
        { id },
        {
          usuarioActualizacion: usuarioAuditoria,
          estado: estadoDestino,
        },
      );

      // Registramos en la bitacora
      await repBitacora.save({
        operacion: estadoDestino,
        idTramite: id,
        idUsuario: usuarioAuditoria,
        usuarioCreacion: usuarioAuditoria,
        estado: Status.ACTIVE,
      });
    } else if (tramite.estado === estadoDestino) {
      result = {
        id: tramite.id,
        estado: tramite.estado,
      };
    } else
      throw new PreconditionFailedException(
        `El tramite se encuentra en el estado ${tramite.estado} y no puede cambiarse a ${estadoDestino}.`,
      );
    return result;
  }

  async cambiarEstadoRevision(usuarioAuditoria: any, id: number) {
    return await this.cambioEstado(
      id,
      usuarioAuditoria,
      TramiteEstado.ASIGNADO,
      TramiteEstado.REVISION,
    );
  }

  async cantidadObservaciones(id: number) {
    // Validamos que cuente con observaciones activas
    const observacionesDetalle =
      await this.observacionRepository.cantidadObservacionesPorDetalle(id);
    const observacionesDocumento =
      await this.observacionRepository.cantidadObservacionesPorDocumento(id);
    const observacionesTramite =
      await this.observacionRepository.cantidadObservacionesPorTramite(id);
    const observaciones =
      parseInt(observacionesDetalle.cantidad) +
      parseInt(observacionesDocumento.cantidad) +
      parseInt(observacionesTramite.cantidad);
    return observaciones;
  }

  async cambiarEstadoObservado(usuarioAuditoria: any, id: number) {
    const observaciones = await this.cantidadObservaciones(id);

    if (observaciones === 0)
      throw new PreconditionFailedException(
        'No existen observaciones activas registradas.',
      );
    return await this.cambioEstado(
      id,
      usuarioAuditoria,
      TramiteEstado.REVISION,
      TramiteEstado.OBSERVADO,
    );
  }

  async cambiarEstadoConcluido(usuarioAuditoria: any, id: number) {
    // Validamos si no se cuenta con observaciones activas
    const observaciones = await this.cantidadObservaciones(id);

    if (observaciones > 0)
      throw new PreconditionFailedException(
        `Existen ${observaciones} observacion(es) que debe(n) RESOLVERSE.`,
      );
    await this.cambioEstado(
      id,
      usuarioAuditoria,
      TramiteEstado.REVISION,
      TramiteEstado.CONCLUIDO,
    );

    // Cambio automático al estado inscrito
    const result = await this.cambiarEstadoInscrito(usuarioAuditoria, id);

    return result;
  }

  async cambiarEstadoInscrito(usuarioAuditoria: any, id: number) {
    // TODO: Adicionar las operaciones que debe realizar antes del cambio de estado (Ej. codigo yuriña, act. BD registro de comercio, actualizar archivo digital Kardex,  Generar matricula reg. comercio)
    try {
      let resultado = null;
      const op = async (transaction) => {
        // Realizamos el registro del certificados generados
        const tramite = await this.tramiteRepository.buscarPorId(id);
        if (tramite && tramite.empresa) {
          // Verificamos si corresponde generar documento emitidos
          const tipo = tramite?.empresa?.codTipoPersona;
          const documentosDetalle =
            await this.parametricaRepository.listarDocumentosEmitidos(
              tramite?.parametrica?.id,
              tipo,
            );

          for (const documentoDetalle of documentosDetalle) {
            const certificado = await this.reporteService.generarMatricula(
              tramite,
              tipo,
              documentoDetalle,
            );
            // Insertamos el tramite-documento-detalle
            const repositorio = transaction.getRepository(
              TramiteDocumentoEmitido,
            );
            const datosDomentoEmitido = {
              nombre: certificado.nombreArchivo,
              ruta: certificado.rutaGuardadoPdf,
              estado: Status.ACTIVE,
              usoQr: documentoDetalle.usoQr,
              usuarioCreacion: usuarioAuditoria,
              tramite: tramite,
            };
            await repositorio.save(datosDomentoEmitido);
          }

          resultado = await this.cambioEstado(
            id,
            usuarioAuditoria,
            TramiteEstado.CONCLUIDO,
            TramiteEstado.INSCRITO,
            transaction,
          );
        } else {
          throw new PreconditionFailedException(
            `No se ha identificado el tramite ni la empresa`,
          );
        }
      };
      await this.tramiteRepository.runTransaction(op);
      return resultado;
    } catch (error) {
      throw new ExternalServiceException(
        'Error al cambiar el estado del tramite',
        error,
      );
    }
  }

  async cambiarEstado(usuarioAuditoria: any, id: number, estado: any) {
    const result = await this.tramiteRepository.update(
      { id },
      {
        usuarioActualizacion: usuarioAuditoria,
        estado,
      },
    );
    return result;
  }

  async seguimientoPorTramite(idTramite: number) {
    const result = await this.tramiteRepository.seguimientoPorTramite(
      idTramite,
    );
    return result;
  }

  async pdfPorTramite(id: number) {
    const data =
      await this.tramiteGenericoService.consultarTramiteCatalogoTramite(id);
    const directorio = this.configService.get('FORMULARIO_TRAMITE');
    const htmlpdf = await PdfService.generateBase64(
      PlantillaTramite.tramiteHTML(data),
    );
    const nombreFile = `tramite_${data.id}.pdf`;
    const path = this.fileService.guardar(htmlpdf, directorio, nombreFile);
    return {
      path: path,
      nombre: nombreFile,
    };
  }

  async obtenerDocumentoSoporte(idTramite: number, campo: string) {
    const result =
      await this.tramiteDocumentoSoporteRepository.buscarPorTramiteCampo(
        idTramite,
        campo,
      );
    console.log('[obtenerDocumentoSoporte] result: ', result);
    if (!result) {
      throw new PreconditionFailedException('No se encontro el documento');
    }
    const archivoBase64 = await getFileBase64(result.ruta);
    console.log(' ++++++++++++++++ ', archivoBase64);
    return archivoBase64;
  }

  async cambiarPasoTramite(id: number, paso: number, usuarioAuditoria: any) {
    const result = await this.tramiteRepository.update(
      { id },
      {
        usuarioActualizacion: usuarioAuditoria,
        paso,
      },
    );
    return result;
  }

  async aprobacionDocumento(id: number, usuarioAuditoria: any) {
    const { path } = await this.pdfPorTramite(id);

    const datos = {
      idUsuario: usuarioAuditoria,
      idTramite: id,
      pathFile: path,
    };
    const resp = await this.aprobacionService.enviarSolicitud(datos);
    await this.tramiteRepository.update(
      { id },
      {
        usuarioActualizacion: usuarioAuditoria,
        estado: TramiteEstado.APROBANDO,
        rutaPdf: path,
      },
    );
    return resp;
  }
}
