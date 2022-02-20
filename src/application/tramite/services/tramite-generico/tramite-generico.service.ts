import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';

import { Parametrica } from '../../entities/parametricas/parametrica.entity';

import { TramiteBitacoraRepository } from '../../repository/tramite-bitacora.repository';
import { TramiteRepository } from '../../repository/tramite.repository';
import { ParametricaRepository } from '../../repository/parametrica.repository';
import { TramiteSeccionRepository } from '../../repository/tramite-seccion.repository';

import { TramiteInformacionService } from './tramite-informacion.service';

import { CAMPO_TIPO_ARCHIVO, TramiteEstado } from 'src/common/constants';
import { obtenerCampoDesdeAtributo } from '../../../../common/utils/tramite.utils';

@Injectable()
export class TramiteGenericoService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(TramiteRepository)
    private tramiteRepository: TramiteRepository,
    @InjectRepository(ParametricaRepository)
    private parametricaRepository: ParametricaRepository,
    @InjectRepository(TramiteSeccionRepository)
    private tramiteSeccionRepository: TramiteSeccionRepository,
    private tramiteInformacionService: TramiteInformacionService,
  ) {}

  /**
   * Metodo para crear un tramite generico
   * @param params Objeto  con los datos para crear el tramite ->
   *  idEmpresa identificador de la empresa que realiza el tramite
   *  idEstablecimiento identificador de la sucursal que realiza el tramite puede ser null
   *  idCatalogoTramite identificador del catalogo tramite a realizar
   *  usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto tramite
   */
  async crearTramite(params: any) {
    const {
      idEmpresa,
      idEstablecimiento,
      idCatalogoTramite,
      usuarioAuditoria,
    } = params;
    const catalogoTramite = await this.obtenerCatalogoTramite(
      idCatalogoTramite,
    );

    // validar tramite se sucursal

    const data = {
      version: catalogoTramite.version,
      codigo: nanoid(),
      idEmpresa,
      idEstablecimiento,
      idCatalogoTramite,
      usuarioAuditoria,
    };

    const nuevoTramite = await this.crearCabeceraTramite(data, catalogoTramite);

    return this.construirRespuestaCrearTramite(nuevoTramite);
  }

  async consultarTramiteCatalogoTramite(idTramite: number) {
    const tramite =
      await this.tramiteRepository.obtenerDatosCatalogoTramiteInactivo(
        idTramite,
      );

    if (!tramite) {
      throw new PreconditionFailedException('No se encontro el tramite');
    }

    const catalogoTramite = await this.obtenerCatalogoTramite(
      tramite.idParametrica,
    );

    const result = await this.construirRespuestaListarTramite(
      tramite,
      catalogoTramite,
    );
    return result;
  }

  /**
   * Metodo para obtener un catalogo tramite por id
   * @param idCatalogoTramite identificador del catalogo tramite
   * @returns Objeto (tramite->grupo->seccion->campo)
   */
  async obtenerCatalogoTramite(idCatalogoTramite: number) {
    const catalogoTramite =
      await this.parametricaRepository.obtenerCataloTramitePorId(
        idCatalogoTramite,
      );
    if (!catalogoTramite)
      throw new PreconditionFailedException('No se encontro el tramite');
    return catalogoTramite;
  }

  /**
   * Metodo para crear la cabecera de un tramite generico
   * @param data datos del tramite
   * @returns Objeto con el identificador, codigo, estado del tremite
   */
  async crearCabeceraTramite(data: any, catalogoTramite: any) {
    const tramiteSeccion = this.obtenerObjetoSecciones(
      catalogoTramite,
      data.usuarioAuditoria,
    );

    const op = async (transaction) => {
      const tramiteRepositoryTransaction =
        transaction.getCustomRepository(TramiteRepository);
      const tramiteBitacoraRepositoryTransaction =
        transaction.getCustomRepository(TramiteBitacoraRepository);
      const tramiteSeccionRepositoryTransaction =
        transaction.getCustomRepository(TramiteSeccionRepository);

      const nuevoTramite =
        await tramiteRepositoryTransaction.crearCabeceraTramite(data);

      await tramiteBitacoraRepositoryTransaction.crear({
        operacion: TramiteEstado.SOLICITUD,
        idTramite: nuevoTramite.raw[0].id,
        idUsuario: data.usuarioAuditoria,
        usuarioAuditoria: data.usuarioAuditoria,
      });

      if (tramiteSeccion.length > 0) {
        tramiteSeccion.forEach((e) => {
          e.idTramite = nuevoTramite.raw[0].id;
        });
        await tramiteSeccionRepositoryTransaction.crear(tramiteSeccion);
      }

      return {
        id: nuevoTramite.raw[0].id,
        codigo: nuevoTramite.raw[0].codigo,
        estado: nuevoTramite.raw[0].estado,
      };
    };

    const result: any = await this.tramiteRepository.runTransaction(op);
    return result;
  }

  /**
   * Metodo para obtener las secciones de un tramite de edicion por seccion
   * @param catalogoTramite objeto catalo tramite grupo->seccion->campo
   * @param usuarioAuditoria usuario que realiza la operacion
   * @returns arrar de objetos seccion para crearlos
   */
  obtenerObjetoSecciones(catalogoTramite: any, usuarioAuditoria: string) {
    const tramiteSeccion = [];
    if (catalogoTramite?.requiereRegistrarEditarSeccion) {
      catalogoTramite.grupos.forEach((grupo: any) => {
        if (!(grupo.aprobacion_documentos && grupo.pago)) {
          grupo.secciones.forEach((seccion: any) => {
            tramiteSeccion.push({
              idSeccionParametrica: seccion.id,
              editado: false,
              idTramite: null,
              usuarioCreacion: usuarioAuditoria,
            });
          });
        }
      });
    }
    return tramiteSeccion;
  }

  async obtenerDatosTramiteActuales(idTramite: number) {
    const tramite = await this.obtenerTramite(idTramite);

    if (
      !(
        tramite?.parametrica?.requiereRegistrarEditarSeccion &&
        tramite?.parametrica?.metodoObtenerInformacion
      )
    ) {
      throw new PreconditionFailedException(
        'El metodo no tiene habilitado recuperar informacion',
      );
    }

    if (
      typeof this.tramiteInformacionService[
        tramite.parametrica.metodoObtenerInformacion
      ] !== 'function'
    ) {
      throw new PreconditionFailedException(
        'No se tiene implementado la funcion para recuperar la informacion',
      );
    }

    const camposCatalogoTramite =
      await this.parametricaRepository.obtenerCampos(tramite.idParametrica);

    const datos = await this.tramiteInformacionService[
      tramite.parametrica.metodoObtenerInformacion
    ](tramite);

    console.log(' ++++++++++++++++++ ', datos);

    const result = [];
    camposCatalogoTramite.forEach((campo) => {
      if (!campo.documentoSoporte) {
        const data = {};
        data[campo.campo] = datos[campo.campo] || null;
        if (campo.tipo === 'mapa') {
          data[campo.campo] =
            datos.latitud && datos.longitud
              ? `${datos.latitud},${datos.longitud}`
              : null;
        }
        result.push(data);
      }
    });
    return result;
  }

  async obtenerTramite(idTramite: number) {
    const tramite = await this.tramiteRepository.findById(idTramite);
    if (!tramite)
      throw new PreconditionFailedException('No se encontro el tramite');
    return tramite;
  }

  /**
   * Metodo para construir la respuesta de crear tramite (grupo->seccion->campo)
   * @param tramite Objeto con los valores de un tramite
   * @param catalogoTramite Objeto catalogo tramite (grupo->seccion->campo)
   * @returns Objeto (tramite->grupo->seccion->campo)
   */
  construirRespuestaCrearTramite(tramite: any) {
    const result: any = {};
    result.idTramite = tramite.id;
    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  async construirRespuestaListarTramite(
    tramite: any,
    catalogoTramite: Parametrica,
  ) {
    const result: any = {};
    let tramiteSecciones = [];
    if (catalogoTramite.requiereRegistrarEditarSeccion) {
      tramiteSecciones = await this.tramiteSeccionRepository.listarPorTramite(
        tramite.id,
      );
    }

    result.id = tramite.id;
    result.codigo = tramite.codigo;
    result.nombreTramite = catalogoTramite.nombre;
    result.estado = tramite.estado;
    result.requiereRegistrarEditarSeccion =
      catalogoTramite.requiereRegistrarEditarSeccion;
    result.rutaFront = catalogoTramite.rutaFront;
    result.paso = tramite.paso;

    result.grupos = catalogoTramite.grupos;
    result.grupos.forEach((grupo: any) => {
      grupo.secciones.forEach((seccion: any) => {
        let editado = null;
        if (tramiteSecciones.length > 0) {
          const tramiteSeccion = tramiteSecciones.find(
            (e) => e.idSeccionParametrica === seccion.id,
          );
          editado = tramiteSeccion?.editado;
        }
        seccion.editado = editado;
        seccion.resumenVisible = catalogoTramite.requiereRegistrarEditarSeccion
          ? editado
          : true;
        seccion.campos.forEach((campo: any) => {
          campo.valor = null;
          if (!campo.documentoSoporte) {
            const campoTramite = tramite?.detalles.filter(
              (e) => e.campo === campo.campo,
            );
            if (campoTramite?.length > 0) {
              campo.valor = campoTramite[0].valor;
              campo.idCampo = campoTramite[0].id;
              campo.observaciones = campoTramite[0]?.observaciones.length;
            }
          } else {
            let campoPadre = campo.campo;
            let atributo = campo.campo;
            if (campo.tipo !== CAMPO_TIPO_ARCHIVO) {
              const objCampo = obtenerCampoDesdeAtributo(campo.campo);
              campoPadre = objCampo.campo;
              atributo = objCampo.atributo;
            }
            const campoDocSoporte = tramite?.documentos.filter(
              (e) => e.campo === campoPadre,
            );
            if (campoDocSoporte?.length > 0) {
              if (campo.tipo === CAMPO_TIPO_ARCHIVO) {
                campo.valor = campoDocSoporte[0].hash;
                campo.nombre = campoDocSoporte[0].nombre;
                campo.ruta = campoDocSoporte[0].ruta;
                campo.idCampo = campoDocSoporte[0].id;
                campo.observaciones = campoDocSoporte[0]?.observaciones.length;
              } else {
                campo.valor = campoDocSoporte[0][atributo];
              }
            }
          }
        });
      });
    });
    return result;
  }

  /**
   * Metodo para actualizar la cabecera de un tramite generico
   * @param data datos del tramite
   * @param idTramite identificador de tramite
   * @returns Objeto con el identificador, codigo, estado del tramite
   */
  async actualizarCabeceraTramite(data: any, idTramite: number) {
    const op = async (transaction) => {
      const tramiteRepositoryTransaction =
        transaction.getCustomRepository(TramiteRepository);
      // const tramiteBitacoraRepositoryTransaction =
      //   transaction.getCustomRepository(TramiteBitacoraRepository);

      const tramite =
        await tramiteRepositoryTransaction.actualizarCabeceraTramite(
          data,
          idTramite,
        );
      return tramite.raw[0];

      // await tramiteBitacoraRepositoryTransaction.crear({
      //   operacion: TramiteEstado.SOLICITUD,
      //   idTramite: nuevoTramite.raw[0].id,
      //   idUsuario: data.usuarioAuditoria,
      //   usuarioAuditoria: data.usuarioAuditoria,
      // });
    };

    const result: any = await this.tramiteRepository.runTransaction(op);
    return result;
  }
}
