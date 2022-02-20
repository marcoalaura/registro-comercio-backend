import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { ClasificadorService } from '../service/clasificador.service';

@ApiTags('Clasificadores')
@Controller('clasificadores')
export class ClasificadoresController extends AbstractController {
  constructor(private clasificadorService: ClasificadorService) {
    super();
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiOperation({
    summary: 'Listar los clasificadores CAEB por nombre y codigo',
  })
  @UsePipes(ValidationPipe)
  @Get()
  async listar(@Query() query: PaginacionQueryDto) {
    const result = await this.clasificadorService.listar(query);
    return this.successListRows(result);
  }
}
