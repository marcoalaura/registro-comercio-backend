import { Injectable } from '@nestjs/common';
import {
  NotificacionPagoFacturaDto,
  NotificacionFacturaDto,
} from './dto/notificacion.dto';
import { FacturaService } from '../tramite/services/factura.service';
import { PagosService } from '../tramite/services/pagos.service';

@Injectable()
export class NotificacionService {
  constructor(
    private readonly facturaServicio: FacturaService,
    private readonly pagoServicio: PagosService,
  ) {}

  async notificacionSUFE(
    facturaDto: NotificacionFacturaDto,
    codigoSeguimiento: string,
  ): Promise<any> {
    console.log(facturaDto);

    const result = await this.facturaServicio.actualizar(
      facturaDto,
      codigoSeguimiento,
    );
    return result;
  }

  async notificacionPPE(
    ppeDto: NotificacionPagoFacturaDto,
    idTransaccion: string,
  ): Promise<any> {
    console.log(ppeDto);

    const result = await this.pagoServicio.registrarPago(ppeDto, idTransaccion);

    return result;
  }
}
