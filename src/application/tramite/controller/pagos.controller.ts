import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PagosService } from '../services/pagos.service';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import {
  CrearPagoPeeDTO,
  PagoDTO,
} from 'src/core/external-services/ppe/ppe.dto';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController extends AbstractController {
  //
  constructor(private pagosService: PagosService) {
    super();
  }

  @ApiOperation({ summary: 'Listar tramites por Usuario, Empresa y Estado' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/:idEmpresa')
  async listarPorUsuarioEmpresa(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    @Param() params,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('usuario id token ', usuarioAuditoria);
    const { idEmpresa } = params;
    const result = await this.pagosService.listarPorUsuarioEmpresa(
      paginacionQueryDto,
      usuarioAuditoria,
      idEmpresa,
    );
    return this.successListRows(result);
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiOperation({
    summary: 'Solicitar pago de un tramite a la Pasarela de Pagos del Estado',
  })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  @Post('/solicitar')
  async solicitarPago(@Body() payload: CrearPagoPeeDTO, @Req() req) {
    const usuarioCreacion = this.getUser(req);
    const pago: PagoDTO = payload.pago;
    const { idTramite } = payload;
    const result = await this.pagosService.solicitarPago(
      pago,
      usuarioCreacion,
      idTramite,
    );
    return this.successCreate(result);
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiOperation({
    summary: 'Buscar pago por id de trámite',
  })
  @Get('/:id/tramite')
  async buscarPorIdTramite(@Param('id') id: string) {
    const result = await this.pagosService.buscarPorIdTramite(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Consultar estado de transacción en PPE' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/consultar/:idPago')
  async verEstadoPago(@Req() req, @Param() params) {
    const usuarioAuditoria = this.getUser(req);
    console.log('usuario id token ', usuarioAuditoria);
    const { idPago } = params;
    const result = await this.pagosService.verEstadoPago(idPago);
    return this.successList(result.datos, result.mensaje);
  }
}
