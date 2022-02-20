import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FacturaService } from '../services/factura.service';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
// import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@ApiTags('Tramite')
@Controller('facturas')
export class FacturaController extends AbstractController {
  constructor(private facturaService: FacturaService) {
    super();
  }

  @ApiOperation({ summary: 'Listar tramites por Usuario, Empresa y Estado' })
  @UseGuards(JwtAuthGuard)
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
    const result = await this.facturaService.listarPorUsuarioEmpresa(
      paginacionQueryDto,
      usuarioAuditoria,
      idEmpresa,
    );
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'Consultar estado de emisión de factura a SUFE' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/consultar/:idFactura')
  async verEstadoFactura(@Req() req, @Param() params) {
    const usuarioAuditoria = this.getUser(req);
    console.log('usuario id token ', usuarioAuditoria);
    const { idFactura } = params;
    const result = await this.facturaService.verEstadoFactura(idFactura);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Solicitar emisión de una factura al SUFE' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Post('/solicitar/:idPago')
  async solicitarFactura(@Req() req, @Body() body, @Param() params) {
    const usuarioAuditoria = this.getUser(req);
    console.log('usuario id token ', usuarioAuditoria);
    const { idPago } = params;
    const result = await this.facturaService.emitirFactura(
      body,
      idPago,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  @ApiOperation({ summary: 'Solicitar anulación de una factura al SUFE' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Post('/anular/:idFactura')
  async anularFactura(@Req() req, @Body() body, @Param() params) {
    const usuarioAuditoria = this.getUser(req);
    console.log('usuario id token ', usuarioAuditoria);
    const { idFactura } = params;
    const result = await this.facturaService.anularFactura(
      idFactura,
      body,
      usuarioAuditoria,
    );
    return this.successDelete(result.datos, result.mensaje);
  }
}
