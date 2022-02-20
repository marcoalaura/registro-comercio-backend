import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FiltrosPublicacionDto } from 'src/application/publicacion/dto/filtros-publicacion.dto';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { ParametricaService } from '../services/parametrica.service';

@ApiTags('Tramite')
@Controller('parametricas')
export class ParametricaController extends AbstractController {
  constructor(private parametricaService: ParametricaService) {
    super();
  }

  @Get('/tramites')
  async listarBandejaTramitesObservados(@Query() query: any) {
    const { tipo, buscar } = query;
    const result = await this.parametricaService.listarParametricaTramites(
      tipo,
      buscar,
    );
    return this.successList(result);
  }

  @Get('/publicaciones')
  async listarCatalogoPublicaciones() {
    const idEmpresa = '3'; // reemplazar por parámetro
    const result = await this.parametricaService.listarCatalagoPublicaciones(
      idEmpresa,
    );
    return this.successList(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/publicaciones/arancel')
  async listarCatalogoArancel(
    @Query() paginacionQueryDto: FiltrosPublicacionDto,
  ) {
    const result = await this.parametricaService.listarCatalogoArancel(
      paginacionQueryDto,
    );
    return this.successListRows(result);
  }

  @Get('/categorias')
  async obtenerCategorias(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.parametricaService.obtenerCategorias(
      paginacionQueryDto,
    );
    return this.successList(result);
  }
}
