import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import {
  CrearObjetoSocialDto,
  ActualizarObjetoSocialDto,
} from '../dto/objeto-social.dto';

import { ObjetoSocialService } from '../service/objeto-social.service';

@ApiTags('Objeto Social')
@Controller('empresas')
export class ObjetoSocialController extends AbstractController {
  constructor(private _objetoSocialSrvc: ObjetoSocialService) {
    super();
  }

  @ApiOperation({ summary: 'Listar objetos sociales de la empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':idEmpresa/objetos-sociales')
  async obtener(@Param('idEmpresa') id: string) {
    const result = await this._objetoSocialSrvc.buscarPorIdEmpresa(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Obtener objeto social de la empresa por id' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('objetos-sociales/:id')
  async obtenerPorId(@Param('id') id: string) {
    const result = await this._objetoSocialSrvc.buscarPorId(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Crear objeto social de la empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post(':idEmpresa/objetos-sociales')
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(
    @Param('idEmpresa') id: string,
    @Req() req,
    @Body() payload: CrearObjetoSocialDto,
  ) {
    payload.usuarioCreacion = this.getUser(req);
    const result = await this._objetoSocialSrvc.crear(payload, id);
    return this.successCreate(result);
  }

  @ApiOperation({ summary: 'Modificar objeto social de la empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put('objetos-sociales/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async editar(
    @Param('id') id: string,
    @Req() req,
    @Body() payload: ActualizarObjetoSocialDto,
  ) {
    payload.usuarioActualizacion = this.getUser(req);
    payload.id = parseInt(id, 10);
    const resul = await this._objetoSocialSrvc.actualizar(payload);
    return this.successUpdate(resul);
  }
}
