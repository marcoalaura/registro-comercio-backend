import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  // UseGuards,
  Param,
} from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import {
  NotificacionPagoFacturaDto,
  NotificacionFacturaDto,
} from './dto/notificacion.dto';
// import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
// import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';
import { AbstractController } from '../../common/dto/abstract-controller.dto';

@Controller()
// @UseGuards(JwtAuthGuard, CasbinGuard)
export class NotificacionController extends AbstractController {
  constructor(private notificacionServicio: NotificacionService) {
    super();
  }

  @Post('/notificacion-ppe')
  @UsePipes(ValidationPipe)
  async notificacionPagoyFactura(
    @Body() notificacionDto: NotificacionPagoFacturaDto,
  ) {
    if (notificacionDto.fuente === 'PPE') {
      console.log('Se recibe una notificacion de PPE sin parametros--------');
      const codigoSeguimiento = notificacionDto.codigoSeguimiento;
      const result = await this.notificacionServicio.notificacionPPE(
        notificacionDto,
        codigoSeguimiento,
      );
      return this.successUpdate(result);
    } else if (notificacionDto.fuente === 'SUFE') {
      console.log('Se recibe una notificacion de SUFE sin parametros--------');
      const codigoSeguimiento = notificacionDto.codigoSeguimiento;
      const result = await this.notificacionServicio.notificacionSUFE(
        notificacionDto,
        codigoSeguimiento,
      );
      return this.successUpdate(result);
    } else {
      return {
        finalizado: true,
        mensaje: 'Notificación ignorada',
        datos: [],
      };
    }
  }

  @Post('/notificacion-sufe/:codigoSeguimiento')
  @UsePipes(ValidationPipe)
  async notificacionSUFE(
    @Body() facturaDto: NotificacionFacturaDto,
    @Param() params,
  ) {
    console.log(
      'Se recibe una notificacion de SUFE con codigo como parametro--------',
    );
    let { codigoSeguimiento } = params;
    if (facturaDto.fuente === 'SUFE') {
      if (!codigoSeguimiento) {
        codigoSeguimiento = facturaDto.codigoSeguimiento;
      }
      const result = await this.notificacionServicio.notificacionSUFE(
        facturaDto,
        codigoSeguimiento,
      );
      return this.successUpdate(result);
    } else {
      return {
        finalizado: true,
        mensaje: 'Notificación ignorada',
        datos: [],
      };
    }
  }

  @Post('/notificacion-ppe/:codigoTransaccion')
  @UsePipes(ValidationPipe)
  async notificacionPPE(
    @Body() ppeDto: NotificacionPagoFacturaDto,
    @Param() params,
  ) {
    console.log(
      'Se recibe una notificacion de PPE con codigo como parametro--------',
    );
    const { codigoTransaccion } = params;
    const result = await this.notificacionServicio.notificacionPPE(
      ppeDto,
      codigoTransaccion,
    );
    return this.successUpdate(result);
  }
}
