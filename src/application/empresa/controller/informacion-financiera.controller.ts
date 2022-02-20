import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { CrearInformacionFinancieraDto } from '../dto/informacion-financiera.dto';

import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard';

import { InformacionFinancieraService } from '../service/informacion-financiera.service';

@ApiTags('Información Financiera')
@Controller('empresas')
export class InformacionFinancieraController extends AbstractController {
  //
  constructor(private _infoFinanSrvc: InformacionFinancieraService) {
    super();
  }

  @ApiOperation({ summary: 'Listar Información Financiera de la empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':idEmpresa/informaciones-financieras')
  async obtener(@Param('idEmpresa') id: string) {
    const result = await this._infoFinanSrvc.buscarPorIdEmpresa(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Listar Información Financiera por id' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('informaciones-financieras/:id')
  async obtenerPorId(@Param('id') id: string) {
    const result = await this._infoFinanSrvc.buscarPorId(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Crear Información Financiera de la empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post(':idEmpresa/informaciones-financieras')
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(
    @Param('idEmpresa') id: string,
    @Req() req,
    @Body() payload: CrearInformacionFinancieraDto,
  ) {
    payload.usuarioCreacion = this.getUser(req);
    const result = await this._infoFinanSrvc.crear(payload, id);
    return this.successCreate(result);
  }
}
