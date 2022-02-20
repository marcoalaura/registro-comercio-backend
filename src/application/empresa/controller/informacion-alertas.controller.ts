import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AbstractController } from 'src/common/dto/abstract-controller.dto';

import { InformacionAlertasService } from '../service/informacion-alertas.service';

// import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
// import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@ApiTags('Informacion inicio')
@Controller('empresas')
export class InformacionAlertasController extends AbstractController {
  constructor(private informacionAlertasService: InformacionAlertasService) {
    super();
  }

  @ApiOperation({ summary: 'Listar la fecha de actualizacion de la matricula' })
  //  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':idEmpresa/datos/matriculas')
  async obtenerFechaActualizacionMatricula(@Param('idEmpresa') id: string) {
    const result =
      await this.informacionAlertasService.obtenerFechaActualizacionMatricula(
        Number(id),
      );
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Lista la cantidad de tramites por estado' })
  //  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':idEmpresa/datos/tramites')
  async obtenerTramitesPorEstado(
    @Param('idEmpresa') id: string,
    @Query() query,
  ) {
    if (!query?.estado) {
      throw new BadRequestException(
        'El parametro estado es obligatorio para obtener la consulta',
      );
    }

    const result =
      await this.informacionAlertasService.obtenerTramitesPorEstado(
        Number(id),
        query.estado,
      );
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Lista las ultimas publicaciones' })
  //  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':idEmpresa/datos/publicaciones')
  async obtenerPublicaciones(@Param('idEmpresa') id: string) {
    const result = await this.informacionAlertasService.obtenerPublicaciones(
      Number(id),
    );
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Lista las ultimas normativas actualzadas' })
  //  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':idEmpresa/datos/normativas')
  async obtenerNormativaActualizada(@Param('idEmpresa') id: string) {
    const result =
      await this.informacionAlertasService.obtenerNormativaActualizada(
        Number(id),
      );
    return this.successList(result);
  }
}
