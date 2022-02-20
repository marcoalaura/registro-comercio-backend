/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import {
  datosRegistroSucursalSUFEDTO,
  datosRegistroPuntoVentaSUFEDTO,
  datosFacturaDTO,
  datosFacturaAnulacionDTO,
} from './sufe.dto';

import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SufeService {
  constructor(private http: HttpService) {}

  /**
   * @title Registro sucursal
   * @description Metodo para registrar una nueva sucursal para facturación
   * @param datosRegistro Objeto con los datos de registro de la sucursal
   */
  async registroSucursal(datosRegistro: datosRegistroSucursalSUFEDTO) {
    try {
      const datos = {
        nombre: datosRegistro.nombre,
        direccion: datosRegistro.direccion,
        codigo: datosRegistro.codigo,
        actividades: datosRegistro.actividades,
      };

      const idCliente = process.env.IOP_SUFE_ID_CLIENTE;

      const respuesta = await this.http
        .post(`/administracion/sucursal/${idCliente}`, datos)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those valuese/) !== null &&
        respuesta.message.match(/no API found with those valuese/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no se encontró el servicio solicitado.`,
        );
      }

      if (respuesta && respuesta.finalizado) {
        return {
          resultado: true,
          mensaje: respuesta.mensaje,
          datos: respuesta.datos,
        };
      } else {
        throw new Error(
          respuesta.mensaje ||
            'Error con el servicio web SUFE al registrar la sucursal',
        );
      }
    } catch (error) {
      return {
        resultado: false,
        mensaje: error.response.data.mensaje,
        error: error.response.data.datos.errores,
      };
    }
  }

  /**
   * @title Registro punto de venta
   * @description Metodo para registrar un nuevo punto de venta para facturación
   * @param datosRegistro Objeto con los datos de registro del punto de venta
   */
  async registroPuntoVenta(datosRegistro: datosRegistroPuntoVentaSUFEDTO) {
    try {
      const datos = {
        nombre: datosRegistro.nombre,
        descripcion: datosRegistro.descripcion,
        tipoPuntoVenta: datosRegistro.tipoPuntoVenta,
        sucursal: datosRegistro.sucursal,
      };

      const idCliente = process.env.IOP_SUFE_ID_CLIENTE;

      const respuesta = await this.http
        .post(`/administracion/puntoVenta/${idCliente}`, datos)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those valuese/) !== null &&
        respuesta.message.match(/no API found with those valuese/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no se encontró el servicio solicitado.`,
        );
      }

      if (respuesta && respuesta.finalizado) {
        return {
          resultado: true,
          mensaje: respuesta.mensaje,
          datos: respuesta.datos,
        };
      } else {
        throw new Error(
          respuesta.mensaje ||
            'Error con el servicio web SUFE al registrar el punto de venta',
        );
      }
    } catch (error) {
      return {
        resultado: false,
        mensaje: error.response.data.mensaje,
        error: error.response.data.datos.errores,
      };
    }
  }

  /**
   * @title Solicitud de emisión de factura
   * @description Metodo para solicitar al SUFE la emisión de una factura
   * @param datosFactura Objeto con los datos de la factura a ser emitida
   */
  async solicitarEmisionFactura(datosFactura: datosFacturaDTO) {
    try {
      const datos = {
        codigoSucursal: datosFactura.codigoSucursal,
        puntoVenta: datosFactura.puntoVenta,
        documentoSector: datosFactura.documentoSector,
        municipio: datosFactura.municipio,
        departamento: datosFactura.departamento,
        telefono: datosFactura.telefono,
        razonSocial: datosFactura.razonSocial,
        documentoIdentidad: datosFactura.documentoIdentidad,
        complemento: datosFactura.complemento,
        tipoDocumentoIdentidad: datosFactura.tipoDocumentoIdentidad,
        correo: datosFactura.correo,
        codigoCliente: datosFactura.codigoCliente,
        metodoPago: datosFactura.metodoPago,
        numeroTarjeta: datosFactura.numeroTarjeta,
        codigoMoneda: datosFactura.codigoMoneda,
        tipoCambio: datosFactura.tipoCambio,
        montoTotal: datosFactura.montoTotal,
        montoGiftCard: datosFactura.montoGiftCard,
        montoDescuentoAdicional: datosFactura.montoDescuentoAdicional,
        formatoFactura: datosFactura.formatoFactura,
        codigoExcepcion: datosFactura.codigoExcepcion,
        detalle: datosFactura.detalle,
      };

      const respuesta = await this.http
        .post(`/facturacion/emision/individual`, datos)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those valuese/) !== null &&
        respuesta.message.match(/no API found with those valuese/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no se encontró el servicio solicitado.`,
        );
      }

      if (respuesta && respuesta.finalizado) {
        return {
          resultado: true,
          mensaje: respuesta.mensaje,
          datos: respuesta.datos,
        };
      } else {
        throw new Error(
          respuesta.mensaje ||
            'Error con el servicio web SUFE al solicitar la emisión de una factura',
        );
      }
    } catch (error) {
      console.log(error.response.data);
      return {
        resultado: false,
        mensaje: error.response.data.mensaje,
        error: error.response.data.datos.errores,
      };
    }
  }

  // TODO metodo para solicitud de un documento de ajuste de factura
  // TODO metodo para solicitud de facturas multiples (?)
  // TODO metodo para solicitud de emision de facturas por contingencia CAFC

  /**
   * @title Solicitud de anulación de factura
   * @description Metodo para solicitar al SUFE la anulación de una factura emitida previamente
   * @param datosAnulacion Objeto con los datos de anulacion de la factura
   * @param cuf Codigo único de la factura para la que se solicita anulación
   */
  async solicitarAnulacionFactura(
    datosAnulacion: datosFacturaAnulacionDTO,
    cuf: string,
  ) {
    try {
      const datos = {
        motivo: datosAnulacion.motivo,
        tipoAnulacion: datosAnulacion.tipoAnulacion ?? 3,
      };

      const respuesta = await this.http
        .patch(`/anulacion/${cuf}`, datos)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those valuese/) !== null &&
        respuesta.message.match(/no API found with those valuese/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no se encontró el servicio solicitado.`,
        );
      }

      if (respuesta && respuesta.finalizado) {
        return {
          resultado: true,
          mensaje: respuesta.mensaje,
          datos: respuesta.datos,
        };
      } else {
        throw new Error(
          respuesta.mensaje ||
            `Error con el servicio web SUFE al solicitar la anulación de la factura ${cuf}`,
        );
      }
    } catch (error) {
      return {
        resultado: false,
        mensaje: error.response.data.mensaje,
        error: error.response.data.datos.errores,
      };
    }
  }

  /**
   * @title Consulta de estado de factura
   * @description Metodo para consultar el estado de procesamiento de una factura en SUFE
   * @param codigoSeguimiento Codigo proporcionado por el SUFE para la consulta de una factura
   */
  async consultarFactura(codigoSeguimiento: string) {
    try {
      const respuesta = await this.http
        .get(`/facturacion/consulta/${codigoSeguimiento}`)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those valuese/) !== null &&
        respuesta.message.match(/no API found with those valuese/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SUFE: no se encontró el servicio solicitado.`,
        );
      }

      if (respuesta && respuesta.estado) {
        return {
          resultado: true,
          datos: respuesta,
        };
      } else {
        throw new Error(
          respuesta.mensaje ||
            `Error con el servicio web SUFE al consultar la factura ${codigoSeguimiento}`,
        );
      }
    } catch (error) {
      return {
        resultado: false,
        mensaje: error.response.data.mensaje,
        error: error.response.data.datos.errores,
      };
    }
  }
}
