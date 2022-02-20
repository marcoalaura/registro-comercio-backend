import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { ParametroService } from './parametro.service';
import { CrearParametroDto } from './dto/crear-parametro.dto';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
// import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../common/dto/abstract-controller.dto';
import { ParamGrupoDto } from './dto/grupo.dto';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Parámetros')
@Controller('parametros')
// @UseGuards(JwtAuthGuard, CasbinGuard) TODO agregar CasbinGuard
@UseGuards(JwtAuthGuard)
export class ParametroController extends AbstractController {
  constructor(private parametroServicio: ParametroService) {
    super();
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.parametroServicio.listar(paginacionQueryDto);
    return this.successListRows(result);
  }

  @UsePipes(ValidationPipe)
  @Get('/:grupo/listado')
  async listarPorGrupo(@Param() params: ParamGrupoDto) {
    const { grupo } = params;
    const result = await this.parametroServicio.listarPorGrupo(grupo);
    return this.successList(result);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crear(@Body() parametroDto: CrearParametroDto) {
    const result = await this.parametroServicio.crear(parametroDto);
    return this.successCreate(result);
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiOperation({
    summary: 'Listar los departamentos de Bolivia',
  })
  @UsePipes(ValidationPipe)
  @Get('departamentos')
  async listarDepartamentos(@Query() query: PaginacionQueryDto) {
    const result = await this.parametroServicio.listarDepartamentos(query);
    return this.successListRows(result);
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiOperation({
    summary: 'Listar los departamentos de Bolivia',
  })
  @UsePipes(ValidationPipe)
  @Get('departamentos/territorios')
  async listarTerritorios(@Query() query: PaginacionQueryDto) {
    const result = await this.parametroServicio.listarTerritorios(query);
    return this.successListRows(result);
  }

  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @ApiOperation({
    summary: 'Listar los municipios de Bolivia por departamento',
  })
  @UsePipes(ValidationPipe)
  @Get('municipios/:idDpto')
  async listarMunicipiosByDpto(@Param('idDpto') id: string) {
    const result = await this.parametroServicio.listarMunicipiosByDpto(id);
    return this.successListRows(result);
  }
}
