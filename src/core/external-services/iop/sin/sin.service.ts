/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import {
  SINCredencialesDTO,
  SINVerificarPersonaNaturalDTO,
  SINVerificarPersonaJuridicaDTO,
  SINReservarPersonaNaturalDTO,
  SINReservarPersonaJuridicaDTO,
} from './credenciales.dto';

import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SinService {
  constructor(private http: HttpService) {}

  /**
   * @title Login
   * @description Metodo para verificar si la información de la empresa existe en el servicio del SIN
   * @param datosSIN Objeto de datos con la información de la empresa
   */
  async login(datosSIN: SINCredencialesDTO) {
    try {
      const datosCampos = {
        nit: datosSIN.Nit,
        usuario: datosSIN.Usuario,
        clave: datosSIN.Contrasena,
      };

      const respuesta = await this.http
        .post('/login', datosCampos)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those valuese/) !== null &&
        respuesta.message.match(/no API found with those valuese/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no se encontró el servicio solicitado.`,
        );
      }
      if (respuesta.Autenticado) {
        return {
          resultado: true,
          mensaje: respuesta.Estado,
        };
      } else {
        throw new Error(respuesta.Mensaje || 'Error con el servicio web SIN');
      }
    } catch (e) {
      return {
        resultado: false,
        mensaje: e.message,
      };
    }
  }

  /**
   * @title VerificarNITEmpresaUnipersonal
   * @description Metodo para verificar si la información de la empresa unipersonal existe en el servicio del SIN
   * @param datosSIN Objeto de datos con la información de la empresa
   */
  async VerificarNITEmpresaUnipersonal(
    datosSIN: SINVerificarPersonaNaturalDTO,
  ) {
    try {
      const datosCampos = {
        TipoDocumentoId: datosSIN.TipoDocumentoId,
        NumeroDocumentoId: datosSIN.NumeroDocumentoId,
        Complemento: datosSIN.Complemento,
        PrimerApellido: datosSIN.PrimerApellido,
      };

      // TODO determinar el verbo y ruta del metodo
      const respuesta = await this.http
        .post(
          process.env.URL_SIN_VERIFICACION_NIT_EMPRESA_UNIPERSONAL,
          datosCampos,
        )
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those values/) !== null &&
        respuesta.message.match(/no API found with those values/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no se encontró el servicio solicitado.`,
        );
      }
      if (respuesta.finalizado) {
        return {
          resultado: true,
          estado: respuesta.estado,
          mensaje: respuesta.mensaje,
          datos: respuesta.datos,
        };
      } else {
        throw new Error(
          respuesta.mensaje ||
            'Ocurrió un error al verificar la información con el SIN',
        );
      }
    } catch (e) {
      return {
        resultado: false,
        mensaje: e.message,
      };
    }
  }

  /**
   * @title VerificarNITPersonaJuridica
   * @description Metodo para verificar si la información de la empresa existe y coincide en el servicio del SIN
   * @param datosSIN Objeto de datos con la información de la empresa
   */
  async VerificarNITPersonaJuridica(datosSIN: SINVerificarPersonaJuridicaDTO) {
    try {
      const datosCampos = {
        NIT: datosSIN.NIT,
        RazonSocial: datosSIN.RazonSocial,
        MatriculaComercio: datosSIN.MatriculaComercio,
      };
      // TODO determinar el verbo y ruta del metodo
      const respuesta = await this.http
        .post(
          process.env.URL_SIN_VERIFICACION_NIT_PERSONA_JURIDICA,
          datosCampos,
        )
        .pipe(map((response) => response.data))
        .toPromise();
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those values/) !== null &&
        respuesta.message.match(/no API found with those values/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no se encontró el servicio solicitado.`,
        );
      }
      if (respuesta.finalizado) {
        return respuesta;
        /*
        if (respuesta.datos.EstadoNIT == '0') {
          let caso = 3;
          if (
            respuesta.datos.NIT == datosCampos.NIT &&
            respuesta.datos.RazonSocial == datosCampos.RazonSocial
          ) {
            caso = 1;
          } else if (
            respuesta.datos.NIT != datosCampos.NIT &&
            respuesta.datos.RazonSocial == datosCampos.RazonSocial
          ) {
            caso = 2;
          }
          return {
            resultado: true,
            mensaje: respuesta.estado,
            datos: {
              ...respuesta.datos,
              caso: caso,
            },
          };
        } else {
          throw new Error(
            'El NIT seleccionado se encuentra inactivo en el SIN',
          );
        }
        */
      } else {
        throw new Error(
          respuesta.mensaje ||
            'Ocurrió un error al verificar la información con el SIN',
        );
      }
    } catch (e) {
      return {
        finalizado: false,
        mensaje: e.message,
      };
    }
  }

  /**
   * @title ReservarNITEmpresaUnipersonal
   * @description Metodo para reservar un NIT como persona natural en el servicio del SIN
   * @param datosSIN Objeto de datos con la información de la persona
   */
  async ReservarNITEmpresaUnipersonal(datosSIN: SINReservarPersonaNaturalDTO) {
    try {
      const datosCampos = {
        TipoDocumentoId: datosSIN.TipoDocumentoId,
        NumeroDocumentoId: datosSIN.NumeroDocumentoId,
        Complemento: datosSIN.Complemento,
        Nombres: datosSIN.Nombres,
        PrimerApellido: datosSIN.PrimerApellido,
        SegundoApellido: datosSIN.SegundoApellido,
      };
      // TODO determinar el verbo y ruta del metodo
      const respuesta = await this.http
        .post(process.env.URL_SIN_RESERVA_NIT_EMPRESA_UNIPERSONAL, datosCampos)
        .pipe(map((response) => response.data))
        .toPromise();
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those values/) !== null &&
        respuesta.message.match(/no API found with those values/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no se encontró el servicio solicitado.`,
        );
      }
      if (respuesta.finalizado) {
        return {
          resultado: true,
          mensaje: respuesta.estado,
          datos: {
            NITReservado: respuesta.datos.NITReservado,
          },
        };
      } else {
        throw new Error(
          respuesta.mensaje ||
            'Ocurrió un error al solicitar la reserva al SIN',
        );
      }
    } catch (e) {
      return {
        resultado: false,
        mensaje: e.message,
      };
    }
  }

  /**
   * @title ReservarNITPersonaJuridica
   * @description Metodo para reservar un NIT como persona juridica en el servicio del SIN
   * @param datosSIN Objeto de datos con la información de la persona
   */
  async ReservarNITPersonaJuridica(datosSIN: SINReservarPersonaJuridicaDTO) {
    try {
      const datosCampos = {
        razonSocial: datosSIN.RazonSocial,
        //numeroTestimonioConstitucion: datosSIN.numeroTestimonioConstitucion,
      };
      // TODO determinar el verbo y ruta del metodo
      const respuesta = await this.http
        .post(process.env.URL_SIN_RESERVA_NIT_PERSONA_JURIDICA, datosCampos)
        .pipe(map((response) => response.data))
        .toPromise();
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those values/) !== null &&
        respuesta.message.match(/no API found with those values/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no se encontró el servicio solicitado.`,
        );
      }
      if (respuesta.finalizado) {
        return {
          resultado: true,
          mensaje: respuesta.estado,
          datos: {
            NITReservado: respuesta.datos.NITReservado,
          },
        };
      } else {
        throw new Error(
          respuesta.mensaje ||
            'Ocurrió un error al solicitar la reserva al SIN',
        );
      }
    } catch (e) {
      return {
        resultado: false,
        mensaje: e.message,
      };
    }
  }
}
