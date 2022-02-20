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
import { CrearCapitalDto } from '../dto/capital.dto';

import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { CapitalService } from '../service/capital.service';

@ApiTags('Capital')
@Controller('empresas')
export class CapitalController extends AbstractController {
  // constructor
  constructor(private _capitalSrvc: CapitalService) {
    super();
  }

  @ApiOperation({ summary: 'Listar todo el historial del capital de empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':idEmpresa/capitales')
  async obtener(@Param('idEmpresa') id: string) {
    const result = await this._capitalSrvc.buscarPorIdEmpresa(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Crear un capital de la empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post(':idEmpresa/capitales')
  async crear(
    @Param('idEmpresa') id: string,
    @Body() payload: CrearCapitalDto,
    @Req() req,
  ) {
    payload.usuarioCreacion = this.getUser(req);
    const result = await this._capitalSrvc.crear(payload, id);
    return this.successCreate(result);
  }
}
