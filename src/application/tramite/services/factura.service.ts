/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
import { Injectable, Query, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacturaRepository } from '../repository/factura.repository';
import {
  Status,
  TramiteAcciones,
  ParametrosFacturacion,
} from 'src/common/constants';
import { Messages } from 'src/common/constants/response-messages';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { NotificacionFacturaDto } from 'src/application/notificacion/dto/notificacion.dto';
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception';
import { ActualizarFacturaDto } from '../dto/factura.dto';
import { SufeService } from '../../../core/external-services/iop/sufe/sufe.service';
import { ExternalServiceException } from 'src/common/exceptions/external-service.exception';
import { Factura } from '../entities/tramite/factura.entity';
import { TramiteBitacoraRepository } from '../repository/tramite-bitacora.repository';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(FacturaRepository)
    private facturaRepositorio: FacturaRepository,
    @InjectRepository(TramiteBitacoraRepository)
    private bitacoraRepositorio: TramiteBitacoraRepository,
    private readonly sufeServices: SufeService,
  ) {}

  async crear(factura, idPago, usuarioAuditoria): Promise<Factura> {
    console.log(factura);

    const data = {
      numeroFactura: null,
      codigoSeguimiento: factura.codigoSeguimiento,
      estado: Status.PENDING,
      montoTotal: factura.montoTotal,
      cuf: factura?.cuf,
      urlFactura: null,
      fechaEmision: factura.fechaEmision ?? new Date(),
    };
    const result = await this.facturaRepositorio.crear(
      data,
      idPago,
      usuarioAuditoria,
    );

    return result;
  }

  async listarPorUsuarioEmpresa(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    idEmpresa: string,
  ) {
    const resultado = await this.facturaRepositorio.listarPorUsuarioEmpresa(
      paginacionQueryDto,
      usuarioAuditoria,
      idEmpresa,
    );
    return resultado;
  }

  async actualizar(
    facturaDatos: NotificacionFacturaDto,
    codigoSeguimiento: string,
  ) {
    const factura = await this.facturaRepositorio.buscarPorCodigoSeguimiento(
      codigoSeguimiento,
    );
    if (factura) {
      // dd/mm/yyyy hh:mm:ss AM
      const reggie =
        /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}):(\d{1,2}) ([A,P]M)/;
      const [, day, month, year, hours, minutes, seconds, dayhalf] =
        reggie.exec(facturaDatos.fecha);
      const fechaObtenida = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        dayhalf == 'PM' && parseInt(hours) < 12
          ? parseInt(hours) + 12
          : parseInt(hours),
        parseInt(minutes),
        parseInt(seconds),
      );

      const actualizarFactura = new ActualizarFacturaDto();
      actualizarFactura.estado =
        facturaDatos.detalle?.tipoEmision == 'EMISION' &&
        facturaDatos.estado == 'EXITO'
          ? Status.ACTIVE
          : facturaDatos.detalle?.tipoEmision == 'ANULACIÓN'
          ? Status.CANCEL
          : facturaDatos.detalle?.tipoEvento == 'OBSERVACION'
          ? Status.INACTIVE
          : Status.PENDING;
      actualizarFactura.cuf = facturaDatos.detalle.cuf;
      actualizarFactura.numeroFactura = facturaDatos.detalle.nroFactura;
      actualizarFactura.fechaEmision = fechaObtenida;
      actualizarFactura.urlFactura = facturaDatos?.detalle?.urlPdf;
      actualizarFactura.observacion = facturaDatos?.detalle?.observacion;

      await this.facturaRepositorio.update(factura.id, actualizarFactura);
      const id = factura.id;

      // registrar en bitacora
      const tramite = await this.facturaRepositorio.getIdTramite(id);

      await this.bitacoraRepositorio.crear({
        operacion:
          facturaDatos.detalle?.tipoEmision == 'EMISION' &&
          facturaDatos.estado == 'EXITO'
            ? TramiteAcciones.FACTURA_EMITIDA
            : facturaDatos.detalle?.tipoEmision == 'ANULACIÓN'
            ? TramiteAcciones.FACTURA_ANULADA
            : TramiteAcciones.FACTURA_SOLICITADA,
        idTramite: tramite?.pago?.tramite?.id,
        idUsuario: 1,
        usuarioAuditoria: 1,
      });

      return { id };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  async emitirFactura(datos, idPago, usuarioAuditoria): Promise<Factura> {
    // console.log(datos);
    try {
      const respuesta = await this.sufeServices.solicitarEmisionFactura(datos);
      // console.log('respuesta desde external service', respuesta);
      if (respuesta && respuesta.resultado) {
        datos.codigoSeguimiento = respuesta.datos?.codigoSeguimiento;
        const factura = await this.crear(datos, idPago, usuarioAuditoria);
        // console.log('factura guarda en sistema ', factura);
        // registrar en bitacora
        const tramite = await this.facturaRepositorio.getIdTramite(factura.id);

        await this.bitacoraRepositorio.crear({
          operacion: TramiteAcciones.FACTURA_SOLICITADA,
          idTramite: tramite?.pago?.tramite?.id,
          idUsuario: usuarioAuditoria,
          usuarioAuditoria: usuarioAuditoria,
        });

        return factura;
      } else {
        console.log('something failed while connecting to SUFE...');
        // throw new Error(respuesta.mensaje);
        throw new PreconditionFailedException(
          respuesta.mensaje + ' ' + respuesta.error,
        );
        // throw new ExternalServiceException(
        //   'SUFE:SOLICITAR_FACTURA',
        //   'Falló la consulta al SUFE',
        // );
      }
    } catch (error) {
      throw new ExternalServiceException('SUFE:SOLICITAR_FACTURA', error);
    }
  }

  async anularFactura(idFactura, datos, usuarioAuditoria): Promise<any> {
    // console.log(datos);
    const factura = await this.facturaRepositorio.findOne(idFactura);
    if (factura) {
      if (factura.cuf) {
        try {
          const respuesta = await this.sufeServices.solicitarAnulacionFactura(
            datos,
            factura.cuf,
          );
          // console.log(respuesta);
          if (respuesta && respuesta.resultado) {
            // registrar en bitacora
            const tramite = await this.facturaRepositorio.getIdTramite(
              factura.id,
            );

            await this.bitacoraRepositorio.crear({
              operacion: TramiteAcciones.FACTURA_ANULACION,
              idTramite: tramite?.pago?.tramite?.id,
              idUsuario: usuarioAuditoria,
              usuarioAuditoria: usuarioAuditoria,
            });

            return respuesta;
          } else {
            console.log('something failed while connecting to SUFE...');
            throw new Error(respuesta.mensaje);
            // throw new ExternalServiceException(
            //   'SUFE:ANULAR_FACTURA',
            //   'Falló la consulta al SUFE',
            // );
          }
        } catch (error) {
          throw new ExternalServiceException('SUFE:ANULAR_FACTURA', error);
        }
      } else {
        throw new PreconditionFailedException(
          'No se puede anular la factura porque aún no ha sido procesada',
        );
      }
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  async verEstadoFactura(idFactura: number): Promise<any> {
    // console.log(idFactura);
    const factura = await this.facturaRepositorio.findOne(idFactura);
    if (factura) {
      try {
        // console.log('codigo seguimiento... ', factura.codigoSeguimiento);
        const respuesta = await this.sufeServices.consultarFactura(
          factura.codigoSeguimiento,
        );
        // console.log('respuesta', respuesta);
        if (respuesta && respuesta.resultado) {
          return respuesta.datos;
        } else {
          console.log('something failed while connecting to SUFE...');
          throw new Error(respuesta.mensaje);
          // throw new ExternalServiceException(
          //   'SUFE:CONSULTAR_FACTURA',
          //   'Falló la consulta al SUFE',
          // );
        }
      } catch (error) {
        throw new ExternalServiceException('SUFE:CONSULTAR_FACTURA', error);
      }
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  async armarFactura(pago, notificacionPago): Promise<any> {
    const datosFactura = {
      municipio: ParametrosFacturacion.MUNICIPIO,
      telefono: ParametrosFacturacion.TELEFONO_CONTACTO,
      codigoSucursal: ParametrosFacturacion.CODIGO_SUCURSAL,
      puntoVenta: ParametrosFacturacion.PUNTO_VENTA,
      documentoSector: ParametrosFacturacion.DOCUMENTO_SECTOR,
      formatoFactura: ParametrosFacturacion.FORMATO_FACTURA,
      metodoPago: notificacionPago.metodoPago == 'TARJETA' ? 2 : 1,
      numeroTarjeta: notificacionPago.datosFacturacion?.numeroTarjeta
        ? notificacionPago.datosFacturacion?.numeroTarjeta.replace(/ /g, '')
        : null,
      montoTotal: +pago.monto,
      codigoCliente:
        pago.transaccion.contenido &&
        pago.transaccion.contenido.numeroDocumentoCliente
          ? pago.transaccion.contenido.numeroDocumentoCliente
          : 'sistema',
      tipoDocumentoIdentidad:
        pago.transaccion.contenido &&
        pago.transaccion.contenido['facturacion'] &&
        pago.transaccion.contenido['facturacion'].nitCliente
          ? 5
          : 1,
      documentoIdentidad:
        pago.transaccion.contenido &&
        pago.transaccion.contenido['facturacion'] &&
        pago.transaccion.contenido['facturacion'].nitCliente
          ? pago.transaccion.contenido['facturacion'].nitCliente
          : pago.transaccion.contenido.numeroDocumentoCliente,
      correo:
        pago.transaccion.contenido &&
        pago.transaccion.contenido['facturacion'] &&
        pago.transaccion.contenido['facturacion'].emailCliente
          ? pago.transaccion.contenido['facturacion'].emailCliente
          : ParametrosFacturacion.CORREO_CONTACTO,
      razonSocial:
        pago.transaccion.contenido &&
        pago.transaccion.contenido['facturacion'] &&
        pago.transaccion.contenido['facturacion'].razonSocialCliente
          ? pago.transaccion.contenido['facturacion'].razonSocialCliente
          : pago.transaccion.contenido.apellidosCliente,
      detalle:
        pago.transaccion.contenido && pago.transaccion.contenido['productos']
          ? pago.transaccion.contenido['productos'].map((item) => {
              const i = Math.floor(Math.random() * 100);
              const producto = {
                actividadEconomica: ParametrosFacturacion.ACTIVIDAD_ECONOMICA,
                codigo: item.codigo
                  ? `${item.codigo}-${i}`
                  : `codigo-item-${i}`,
                codigoSin: ParametrosFacturacion.CODIGO_SIN,
                cantidad: item.cantidad ?? 1,
                descripcion: item.descripcion ?? `item-${i}`,
                unidadMedida: item.unidadMedida ?? 1,
                precioUnitario: item.precioUnitario,
              };
              return producto;
            })
          : [],
    };

    if (datosFactura.numeroTarjeta === null) {
      datosFactura.metodoPago = 1;
    }

    if (datosFactura.metodoPago === 1) {
      delete datosFactura.numeroTarjeta;
    }

    if (
      process.env.IOP_SUFE_VALIDAR_NIT === 'false' ||
      !process.env.IOP_SUFE_VALIDAR_NIT
    ) {
      // Saltar validación de NIT con SIN
      datosFactura.tipoDocumentoIdentidad = 1;
    }

    return datosFactura;
  }
}
