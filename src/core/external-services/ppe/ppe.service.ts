import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import * as dotenv from 'dotenv';
import { PagoDTO } from './ppe.dto';

dotenv.config();

@Injectable()
export class PpeService {
  constructor(private _http: HttpService) {}

  /**
   * @title Solicitud de Pago
   * @description Metodo para solicitar un pago a la Pasarela de Pagos del Estado (PPE).
   * @param datosRegistro Objeto con los datos de la solicitud del pago
   */
  async solicitudDePago(pago: PagoDTO) {
    pago.datosPago.cuentaBancaria = process.env.PPE_CUENTA_BANCARIA;
    try {
      const respuesta = await this._http
        .post('/transaccion/deuda', pago)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.finalizado &&
        respuesta.message &&
        respuesta.message.match(/Unauthorized/) !== null &&
        respuesta.message.match(/Unauthorized/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio de la Pasarela de Pagos del Estado: no tiene permisos para usar este servicio.`,
        );
      }

      if (!respuesta.finalizado) {
        throw new Error(
          `Error con el Servicio Pasarela de Pagos del Estado: ${respuesta.mensaje}`,
        );
      }

      if (respuesta && respuesta.finalizado) {
        return {
          finalizado: true,
          mensaje: respuesta.mensaje,
          datos: respuesta.datos,
        };
      }
    } catch (error) {
      console.log(error.response.data);
      return {
        finalizado: false,
        mensaje: error.response.data.mensaje,
        error: error.response.data.datos.errores,
      };
    }
  }

  /**
   * @title Consulta de estado de Pago
   * @description Metodo para consultar el estado de una transacción a la PPE
   * @param datosPago Objeto con los datos de la solicitud del pago
   */
  async consultarPago(idTransaccion) {
    try {
      const respuesta = await this._http
        .get(`/consulta/estado/${idTransaccion}`)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.finalizado &&
        respuesta.message &&
        respuesta.message.match(/Unauthorized/) !== null &&
        respuesta.message.match(/Unauthorized/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio de la Pasarela de Pagos del Estado: no tiene permisos para usar este servicio.`,
        );
      }

      if (!respuesta.finalizado) {
        throw new Error(
          `Error con el Servicio Pasarela de Pagos del Estado: ${respuesta.mensaje}`,
        );
      }

      if (respuesta && respuesta.finalizado) {
        return {
          resultado: true,
          mensaje: respuesta.mensaje,
          datos: respuesta.datos,
        };
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
