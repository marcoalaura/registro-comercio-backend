import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { FiltrosPublicacionDto } from '../dto/filtros-publicacion.dto';
import { PublicacionService } from '../services/publicacion.service';

const idEmpresa = '3'; // reemplazar por parámetro

@ApiTags('Publicaciones')
@Controller('publicaciones')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class PublicacionController extends AbstractController {
  constructor(private publicacionService: PublicacionService) {
    super();
  }

  @ApiOperation({
    summary: 'Listar publicaciones por empresa',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/')
  async listar(@Query() paginacionQueryDto: FiltrosPublicacionDto) {
    const result = await this.publicacionService.listar(
      paginacionQueryDto,
      idEmpresa,
    );
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'Detalle publicación' })
  @Get('/:id')
  async obtener(@Param() params) {
    const { id } = params;
    const result = await this.publicacionService.obtener(id);
    return this.successList(result);
  }
}
