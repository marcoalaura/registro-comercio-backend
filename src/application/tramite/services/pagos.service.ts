/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
import { Injectable, PreconditionFailedException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagosRepository } from '../repository/pagos.repository';
import { TramiteBitacoraRepository } from '../repository/tramite-bitacora.repository';

import { PpeService } from '../../../core/external-services/ppe/ppe.service';
import { FacturaService } from './factura.service';

import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { PagoDTO } from '../../../core/external-services/ppe/ppe.dto';
import { ActualizarPagoDTO, CrearPagoDTO } from '../dto/tramite-pago.dto';
import { NotificacionPagoFacturaDto } from 'src/application/notificacion/dto/notificacion.dto';

import { ExternalServiceException } from 'src/common/exceptions/external-service.exception';
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception';

import {
  Status,
  TramiteEstado,
  TramiteAcciones,
  ParametrosFacturacion,
} from 'src/common/constants';
import { Messages } from 'src/common/constants/response-messages';

import { genCodigoOrden } from '../../../common/utils/pago.utils';

@Injectable()
export class PagosService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(PagosRepository)
    private pagosRepository: PagosRepository,
    @InjectRepository(TramiteBitacoraRepository)
    private bitacoraRepository: TramiteBitacoraRepository,
    private readonly _ppeService: PpeService,
    private readonly facturaService: FacturaService,
  ) {}

  async listarPorUsuarioEmpresa(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    idEmpresa: string,
  ) {
    const resultado = await this.pagosRepository.listarPorUsuarioEmpresa(
      paginacionQueryDto,
      usuarioAuditoria,
      idEmpresa,
    );
    return resultado;
  }

  async solicitarPago(
    pago: PagoDTO,
    usuarioCreacion: string,
    idTramite: number,
  ): Promise<any> {
    try {
      const codigoOrden = genCodigoOrden();
      pago.codigoOrden = codigoOrden;

      // Agregando datos de facturación
      pago.facturacion.municipio =
        pago.facturacion.municipio ?? ParametrosFacturacion.MUNICIPIO;
      pago.facturacion.departamento =
        pago.facturacion.departamento ?? ParametrosFacturacion.DEPARTAMENTO;
      pago.facturacion.tipoDocumentoIdentidad = pago.facturacion.nitCliente
        ? 5
        : 1;
      pago.facturacion.documentoIdentidad =
        pago.facturacion.nitCliente ??
        pago.datosPago.numeroDocumentoCliente.split('-')[0];
      if (pago.datosPago.numeroDocumentoCliente.includes('-')) {
        pago.facturacion.complemento =
          pago.datosPago.numeroDocumentoCliente.split('-')[1];
      }
      pago.facturacion.codigoCliente = pago.datosPago.numeroDocumentoCliente;
      pago.facturacion.montoTotal = pago.datosPago.montoTotal;
      pago.facturacion.tipoCambio = pago.datosPago.tipoCambioMoneda;
      pago.facturacion.documentoSector = ParametrosFacturacion.DOCUMENTO_SECTOR;
      delete pago.facturacion.nitCliente;
      pago.productos.map((item) => {
        delete item.subTotal;
        item.actividadEconomica = ParametrosFacturacion.ACTIVIDAD_ECONOMICA;
        item.codigoSin = ParametrosFacturacion.CODIGO_SIN;
        return item;
      });

      const respuesta = await this._ppeService.solicitudDePago(pago);
      if (respuesta.finalizado) {
        const nuevoPago: CrearPagoDTO = {
          usuarioCreacion,
          monto: pago.datosPago.montoTotal,
          canalSolicitud: respuesta.datos.urlRedireccion,
          estado: Status.PENDING,
          idTramite,
          canalPago: '',
          transaccion: {
            idTransaccion: respuesta.datos.codigoTransaccion,
            contenido: {
              codigoOrden,
              apellidosCliente: pago.datosPago.apellidosCliente,
              numeroDocumentoCliente: pago.datosPago.numeroDocumentoCliente,
              productos: pago.productos,
              facturacion: pago.facturacion,
            },
          },
        };
        const respuestaCrear = await this.pagosRepository.crearPago(nuevoPago);
        if (!respuestaCrear) {
          throw new EntityNotFoundException(Messages.EXCEPTION_CREATE);
        }

        await this.bitacoraRepository.crear({
          operacion: TramiteAcciones.PAGO_SOLICITADO,
          idTramite,
          idUsuario: usuarioCreacion,
          usuarioAuditoria: usuarioCreacion,
        });
        return respuesta.datos;
      } else {
        throw new ExternalServiceException(
          'SOLICITAR_PAGO',
          'Falló la consulta a la Pasarela de Pagos del Estado',
        );
      }
    } catch (error) {
      throw new ExternalServiceException('Pasarela de Pagos del Estado', error);
    }
  }

  async registrarPago(
    pagoDatos: NotificacionPagoFacturaDto,
    idTransaccion: string,
  ) {
    const pago = await this.pagosRepository.buscarPorIdTransaccionPpe(
      idTransaccion,
    );

    if (!pago) throw new EntityNotFoundException(Messages.INVALID_RECORD);

    // const fechaObtenida = new Date(pagoDatos.fecha);

    const actualizarPago = new ActualizarPagoDTO();
    actualizarPago.estado =
      pagoDatos.estado == 'PROCESADO' ? Status.ACTIVE : Status.PENDING;
    actualizarPago.canalPago = pagoDatos.detalle.metodoPago ?? 'TARJETA';
    actualizarPago.transaccion = {
      ...pago.transaccion,
      ...pagoDatos.detalle,
    };

    await this.pagosRepository.update(pago.id, actualizarPago);
    const id = pago.id;

    // registrar en bitacora
    const tramite = await this.pagosRepository.getIdTramite(id);

    await this.bitacoraRepository.crear({
      operacion:
        pagoDatos.estado == 'PROCESADO'
          ? TramiteEstado.PAGADO
          : TramiteAcciones.PAGO_SOLICITADO,
      idTramite: tramite?.tramite?.id,
      idUsuario: 1,
      usuarioAuditoria: 1,
    });

    // solicitar facturación via SUFE si no se utiliza integrado con PPE
    // const datosFactura = await this.facturaService.armarFactura(
    //   pago,
    //   pagoDatos,
    // );

    // console.log('datos de factura generada........', datosFactura);

    // try {
    //   const facturaSolicitada = await this.facturaService.emitirFactura(
    //     datosFactura,
    //     pago.id,
    //     1,
    //   );
    //   console.log('factura solicitada........... ', facturaSolicitada);
    // } catch (error) {
    //   console.error(
    //     `Sucedió un error al solicitar la emisión de la factura para el pago ${pago.id}. El cliente deberá volver a solicitara desde el sistema`,
    //   );
    // }

    try {
      const nuevaFactura = {
        montoTotal: pago.monto,
        codigoSeguimiento: pagoDatos.codigoSeguimiento,
      };

      const factura = await this.facturaService.crear(nuevaFactura, id, 1);
      if (!factura) {
        throw new EntityNotFoundException(Messages.EXCEPTION_CREATE);
      }

      await this.bitacoraRepository.crear({
        operacion: TramiteAcciones.FACTURA_SOLICITADA,
        idTramite: tramite?.tramite?.id,
        idUsuario: 1,
        usuarioAuditoria: 1,
      });
    } catch (error) {
      throw new PreconditionFailedException(error);
    }

    return { id };
  }

  async buscarPorIdTramite(id: string) {
    const resultado = await this.pagosRepository.buscarPorIdTramite(id);
    return resultado;
  }

  async verEstadoPago(idPago: number): Promise<any> {
    const pago = await this.pagosRepository.findOne(idPago);
    if (pago) {
      try {
        if (pago.transaccion && pago.transaccion.idTransaccion) {
          const respuesta = await this._ppeService.consultarPago(
            pago.transaccion.idTransaccion,
          );
          // console.log('respuesta', respuesta);
          if (respuesta && respuesta.resultado) {
            return {
              mensaje: respuesta.mensaje,
              datos: respuesta.datos,
            };
          } else {
            throw new Error(respuesta.mensaje);
          }
        } else {
          throw new PreconditionFailedException(
            'No se puede consultar el estado del pago porque no se cuenta con un id de transacción',
          );
        }
      } catch (error) {
        throw new ExternalServiceException('SUFE:CONSULTAR_FACTURA', error);
      }
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }
}
