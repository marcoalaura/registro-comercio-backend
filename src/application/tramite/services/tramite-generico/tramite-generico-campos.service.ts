/* eslint-disable max-lines */
import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  getItemFromArrayObject,
  getKeysFromArrayObject,
  isSubArray,
} from 'src/common/lib/array.module';
import {
  CATALOGO_TRAMITE_CAMPO,
  DocumentoSoporteFields,
  DOCUMENTO_SOPORTE_FIELD_NAME,
} from 'src/common/constants';

import { TramiteRepository } from '../../repository/tramite.repository';
import { ParametricaRepository } from '../../repository/parametrica.repository';
import { TramiteDetalleRepository } from '../../repository/tramite-detalle.repository';
import { TramiteDocumentoSoporteRepository } from '../../repository/tramite-documento-soporte.repository';
import { TramiteSeccionRepository } from '../../repository/tramite-seccion.repository';

import { checksumFile } from '../../../../common/lib/hash-sum.module';
import { obtenerCampoDesdeAtributo } from '../../../../common/utils/tramite.utils';

import * as Joi from 'joi';
import { EditarTramiteSeccionDto } from '../../dto/tramite-seccion.dto';

@Injectable()
export class TramiteGenericoCamposService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(TramiteRepository)
    private tramiteRepository: TramiteRepository,
    @InjectRepository(ParametricaRepository)
    private parametricaRepository: ParametricaRepository,
    @InjectRepository(TramiteDetalleRepository)
    private tramiteDetalleRepository: TramiteDetalleRepository,
    @InjectRepository(TramiteDocumentoSoporteRepository)
    private tramiteDocumentoSoporteRepository: TramiteDocumentoSoporteRepository,
    @InjectRepository(TramiteSeccionRepository)
    private tramiteSeccionRepository: TramiteSeccionRepository,
  ) {}

  /**
   * Metodo para crear o actualizar los campos de un tramite
   * @param idTramite identificador del tramite
   * @param params campos
   * @returns
   */
  async procesarRegistroCampos(
    idTramite: number,
    params: any,
    seccion: Array<string>,
  ) {
    const { data, files, usuarioAuditoria } = params;

    const tramite = await this.obtenerTramite(idTramite);

    const camposCatalogoTramite =
      await this.parametricaRepository.obtenerCampos(tramite.idParametrica);

    const campos = await this.contruirObjetoCampos(
      idTramite,
      { data, camposCatalogoTramite },
      usuarioAuditoria,
    );

    const seccionTramite = await this.addSeccionObjetoCampos({
      idTramite,
      campos,
      camposCatalogoTramite,
      seccion,
      usuarioAuditoria,
    });

    const documentosSoporte = await this.construirObjetoDocumentosSoporte(
      idTramite,
      { data, files, camposCatalogoTramite },
      usuarioAuditoria,
    );

    const op = async (transaction) => {
      await this.guardarCampos(campos, transaction);
      await this.guardarDocumentosSoporte(documentosSoporte, transaction);
      await this.guardarTramiteSeccion(seccionTramite, transaction);
      return null;
    };
    const result: any = await this.tramiteRepository.runTransaction(op);
    return result;
  }

  async contruirObjetoCampos(
    idTramite: number,
    params: any,
    usuarioAuditoria: string,
  ) {
    const { data, camposCatalogoTramite } = params;

    const camposTramite = await this.tramiteDetalleRepository.buscarPorTramite(
      idTramite,
    );

    const camposKey = this.obtenerCamposKey(data, camposCatalogoTramite);

    const camposCrear = [];
    const camposActualizar = [];

    camposKey.map((campo) => {
      const catalogoTramite = getItemFromArrayObject(
        camposCatalogoTramite,
        campo,
      );
      if (!catalogoTramite.documentoSoporte) {
        const campoTramite = camposTramite.filter(
          (item) => item.campo === campo,
        );
        if (campoTramite?.length > 0) {
          camposActualizar.push({
            id: campoTramite[0].id,
            campo,
            valor: data[campo],
            tipo: catalogoTramite.tipo,
            tabla: catalogoTramite.tabla,
            idTramite,
            usuarioAuditoria,
          });
        } else {
          camposCrear.push({
            campo,
            valor: data[campo],
            tipo: catalogoTramite.tipo,
            tabla: catalogoTramite.tabla,
            idTramite,
            usuarioAuditoria,
          });
        }
      }
    });
    return { camposCrear, camposActualizar };
  }

  async addSeccionObjetoCampos(params: any) {
    const {
      idTramite,
      campos,
      camposCatalogoTramite,
      seccion: secciones,
      usuarioAuditoria,
    } = params;
    const result = [];
    if (camposCatalogoTramite[0]?.requiereRegistrarEditarSeccion) {
      const { camposCrear } = campos;
      // completar los campos
      camposCrear?.forEach((e) => {
        const campoCatalogo = camposCatalogoTramite.find(
          (cct) => e.campo === cct.campo,
        );
        e.seccion = campoCatalogo.idSeccion;
      });
      // armar objeto de actualizacion de secciones
      const tramiteSecciones =
        await this.tramiteSeccionRepository.listarPorTramite(idTramite);
      tramiteSecciones.forEach((e) => {
        const seccionEditada = secciones.find(
          (s) => e.idSeccionParametrica.toString() === s,
        );
        if ((seccionEditada && !e.editado) || (!seccionEditada && e.editado)) {
          const tramiteSeccion = new EditarTramiteSeccionDto();
          tramiteSeccion.id = e.id;
          tramiteSeccion.idSeccionParametrica = e.idSeccionParametrica;
          tramiteSeccion.idTramite = e.idTramite;
          tramiteSeccion.editado = !e.editado;
          tramiteSeccion.usuarioAuditoria = usuarioAuditoria;
          result.push(tramiteSeccion);
        }
      });
    }
    console.log('------- result- ', result);
    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  async construirObjetoDocumentosSoporte(
    idTramite: number,
    params,
    usuarioAuditoria: string,
  ) {
    const { data, files, camposCatalogoTramite } = params;
    console.log(' files: ', files);
    const filesKey = getKeysFromArrayObject(
      files,
      DOCUMENTO_SOPORTE_FIELD_NAME,
    );

    console.log(' filesKey: ', filesKey);

    this.validarDocumentosSoportePertenecenAlTramite(
      data,
      camposCatalogoTramite,
      filesKey,
    );

    // obtener campos con archivo
    const camposDocumentoSoporte = await this.obtenerCamposDocumentosSoporte(
      data,
      files,
    );

    console.log(' camposDocumentoSoporte: ', camposDocumentoSoporte);

    const camposCrear = [];
    const camposActualizar = [];

    const documentosSoporteTramite =
      await this.tramiteDocumentoSoporteRepository.buscarPorTramite(idTramite);

    camposDocumentoSoporte.map((campoDocSoporte) => {
      const dstr = documentosSoporteTramite.filter(
        (e) => e.campo === campoDocSoporte.campo,
      );
      const params: any = {
        nroDocumento: campoDocSoporte.nroDocumento,
        emisor: campoDocSoporte.emisor,
        fechaEmision: campoDocSoporte.fechaEmision,
        nombre: campoDocSoporte.nombre,
        ruta: campoDocSoporte.ruta,
        hash: campoDocSoporte.hash,
      };
      if (dstr.length > 0) {
        params.id = dstr[0].id;
        params.usuarioActualizacion = usuarioAuditoria;
        camposActualizar.push(params);
      } else {
        const ct = camposCatalogoTramite.filter(
          (e) => e.campo === campoDocSoporte.campo,
        );
        params.tipo = ct[0].codigoTipoDocumento;
        params.idTramite = idTramite;
        params.usuarioAuditoria = usuarioAuditoria;
        params.campo = campoDocSoporte.campo;
        camposCrear.push(params);
      }
    });

    const camposDocSoporteSinArchivo = this.obtenerCamposDocSoporteSinArchivo(
      data,
      camposCatalogoTramite,
      filesKey,
    );

    console.log(' camposDocSoporteSinArchivo: ', camposDocSoporteSinArchivo);

    const err = [];
    camposDocSoporteSinArchivo.map((campoDocSoporte) => {
      const dstr = documentosSoporteTramite.filter(
        (e) => e.campo === campoDocSoporte.campo,
      );
      const params = { ...campoDocSoporte };
      if (dstr.length > 0) {
        params.id = dstr[0].id;
        params.usuarioActualizacion = usuarioAuditoria;
        camposActualizar.push(params);
      } else {
        err.push(campoDocSoporte.campo);
      }
    });

    if (err.length > 0) {
      throw new PreconditionFailedException(
        `Los documentos soporte para : ${err.join(', ')} son requeridos`,
      );
    }

    return { camposCrear, camposActualizar };
  }

  async guardarCampos(data: any, transaction: any) {
    const { camposCrear, camposActualizar } = data;
    const tramiteDetalleRepositoryTransaction = transaction.getCustomRepository(
      TramiteDetalleRepository,
    );
    if (camposCrear?.length > 0)
      await tramiteDetalleRepositoryTransaction.crear(camposCrear);
    if (camposActualizar?.length > 0) {
      for (const campoTramite of camposActualizar) {
        await tramiteDetalleRepositoryTransaction.actualizarValor(campoTramite);
      }
    }
    return null;
  }

  async guardarDocumentosSoporte(data: any, transaction: any) {
    const { camposCrear, camposActualizar } = data;
    console.log('[guardarDocumentosSoporte] camposCrear: ', camposCrear);
    const tramiteDocumentoSoporteRepositoryTransaction =
      transaction.getCustomRepository(TramiteDocumentoSoporteRepository);
    if (camposCrear?.length > 0)
      await tramiteDocumentoSoporteRepositoryTransaction.crear(camposCrear);
    if (camposActualizar?.length > 0) {
      for (const campoTramite of camposActualizar) {
        await tramiteDocumentoSoporteRepositoryTransaction.actualizar(
          campoTramite,
        );
      }
    }
    return null;
  }

  async guardarTramiteSeccion(
    data: Array<EditarTramiteSeccionDto>,
    transaction: any,
  ) {
    if (data?.length > 0) {
      const tramiteSeccionRepositoryTransaction =
        transaction.getCustomRepository(TramiteSeccionRepository);
      const execute = [];
      data.forEach((e) => {
        execute.push(tramiteSeccionRepositoryTransaction.actualizar(e));
      });
      await Promise.all(execute);
    }
  }

  async obtenerTramite(idTramite: number) {
    const tramite = await this.tramiteRepository.findOne(idTramite);
    console.log(' ------ tramite ', tramite);
    if (!tramite)
      throw new PreconditionFailedException('No se encontro el tramite');
    return tramite;
  }

  obtenerCamposKey(data: any, camposCatalogoTramite: any) {
    const camposKey = Object.keys(data);

    const camposCatalogoTramiteKey = getKeysFromArrayObject(
      camposCatalogoTramite,
      CATALOGO_TRAMITE_CAMPO,
    );

    if (!isSubArray(camposCatalogoTramiteKey, camposKey))
      throw new PreconditionFailedException(
        'Los campos enviados no corresponden al tramite',
      );
    return camposKey;
  }

  /**
   * Metodo para validar que los campos pertenecen al documumento soporte del tramite
   * @param data campos enviados para actualizacion
   * @param camposCatalogoTramite campos del catalo tramite
   * @param documentoSoporte lista de documentos soporte adjuntos (nombre del campo)
   */
  validarDocumentosSoportePertenecenAlTramite(
    data: any,
    camposCatalogoTramite: any,
    documentoSoporte: Array<string>,
  ) {
    let camposKey = Object.keys(data);
    camposKey = camposKey.concat(documentoSoporte);

    const camposCatalogoTramiteKey = getKeysFromArrayObject(
      camposCatalogoTramite,
      CATALOGO_TRAMITE_CAMPO,
    );

    if (!isSubArray(camposCatalogoTramiteKey, camposKey))
      throw new PreconditionFailedException(
        'Los campos enviados no corresponden al tramite',
      );
  }

  /**
   * Metodo para obtener documentos soporte que se adjuntaron como archivo
   * @param data campos del tramite enviados para actualizacion
   * @param files adjuntos documentos soporte
   * @returns Objeto documeto soporte para los campos del archivo adjunto
   */
  async obtenerCamposDocumentosSoporte(data: any, files: any) {
    const result = [];
    const err = [];
    console.log('[obtenerCamposDocumentosSoporte] init ');
    for (const item of files) {
      const campos = {};
      campos[`${item.fieldname}${DocumentoSoporteFields.NRO_DOCUMENTO}`] =
        Joi.string().required();
      campos[`${item.fieldname}${DocumentoSoporteFields.EMISOR}`] =
        Joi.string().required();
      campos[`${item.fieldname}${DocumentoSoporteFields.FECHA_EMSION}`] =
        Joi.date().required();
      const schema = Joi.object(campos);

      const docSoporte = {};
      docSoporte[`${item.fieldname}${DocumentoSoporteFields.NRO_DOCUMENTO}`] =
        data[`${item.fieldname}${DocumentoSoporteFields.NRO_DOCUMENTO}`];
      docSoporte[`${item.fieldname}${DocumentoSoporteFields.EMISOR}`] =
        data[`${item.fieldname}${DocumentoSoporteFields.EMISOR}`];
      docSoporte[`${item.fieldname}${DocumentoSoporteFields.FECHA_EMSION}`] =
        data[`${item.fieldname}${DocumentoSoporteFields.FECHA_EMSION}`];
      const { error } = schema.validate(docSoporte, {
        abortEarly: false,
      });
      if (error) err.push(error.message);
      if (err.length === 0) {
        const hash = await checksumFile('sha512', item.path);
        result.push({
          nroDocumento:
            data[`${item.fieldname}${DocumentoSoporteFields.NRO_DOCUMENTO}`],
          emisor: data[`${item.fieldname}${DocumentoSoporteFields.EMISOR}`],
          fechaEmision:
            data[`${item.fieldname}${DocumentoSoporteFields.FECHA_EMSION}`],
          nombre: item.originalname,
          hash,
          ruta: item.path,
          campo: item.fieldname,
        });
      }
    }
    console.log('validate error : ', err);
    if (err.length > 0) {
      throw new PreconditionFailedException(err.join(', '));
    }
    console.log('[obtenerCamposDocumentosSoporte] end ');
    return result;
  }

  /**
   * Metodo para obtener los atributos de un documento soporte que no se
   * envio el archivo (actualizacion de atributos)
   * @param data campos de un tramite a actualizar
   * @param camposCatalogoTramite campos del catalogo de tramite
   * @param documentoSoporte lista de documentos soporte adjuntados
   * @returns Array de objetos con los datos de un documento soporte
   */
  obtenerCamposDocSoporteSinArchivo(
    data: any,
    camposCatalogoTramite: any,
    documentoSoporte: Array<string>,
  ) {
    const camposKey = Object.keys(data);

    const result = [];

    camposKey.map((campo) => {
      const { campo: campoPadre, atributo } = obtenerCampoDesdeAtributo(campo);
      if (documentoSoporte.indexOf(campoPadre) < 0) {
        const ct = camposCatalogoTramite.filter((e) => e.campo === campo);
        if (ct[0].documentoSoporte) {
          let registrado = false;
          for (const campoDocSoporte of result) {
            // eslint-disable-next-line max-depth
            if (campoDocSoporte?.campo === campoPadre) {
              campoDocSoporte[atributo] = data[campo];
              registrado = true;
              break;
            }
          }
          if (!registrado) {
            const params: any = {};
            params.campo = campoPadre;
            params[atributo] = data[campo];
            result.push(params);
          }
        }
      }
    });
    return result;
  }
}
