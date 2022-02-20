import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { EstablecimientoService } from '../service/establecimiento.service';
// import { Messages } from '../../../common/constants/response-messages';
import {
  CrearEstablecimientoDto,
  ActualizarEstablecimientoDto,
} from '../dto/establecimiento.dto';
import { FiltrosEstablecimientoDto } from '../dto/filtros-establecimiento.dto';
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard';
// import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Establecimiento')
@Controller('empresas')
export class EstablecimientoController extends AbstractController {
  constructor(private establecimientoService: EstablecimientoService) {
    super();
  }
  // GET establecimientos
  //   @UseGuards(JwtAuthGuard, CasbinGuard)
  //   @UsePipes(
  //     new ValidationPipe({
  //       transform: true,
  //     }),
  //   )
  //   @Get()
  //   async listar(@Query() paginacionQueryDto: FiltrosEstablecimientoDto) {
  //     const result = await this.establecimientoService.listar(paginacionQueryDto);
  //     return this.successListRows(result);
  //   }

  @ApiOperation({ summary: 'Listar establecimientos por empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/:idEmpresa/establecimientos')
  async obtenerEstablecimientosDeEmpresa(
    @Query() paginacionQueryDto: FiltrosEstablecimientoDto,
    @Req() req,
    @Param() params,
  ) {
    const { idEmpresa: idEmpresa } = params;
    // const idUsuario = this.getUser(req);
    const result = await this.establecimientoService.buscarPorIdEmpresa(
      idEmpresa,
      paginacionQueryDto,
    );
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'Obtener información de establecimiento' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/:idEmpresa/establecimientos/:id')
  async obtenerEstablecimiento(@Req() req, @Param() params) {
    const { id: idEstablecimiento } = params;
    // const idUsuario = this.getUser(req);
    const result = await this.establecimientoService.buscarPorId(
      idEstablecimiento,
    );
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Crear establecimiento' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('/:idEmpresa/establecimientos')
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(
    @Req() req,
    @Param() params,
    @Body() establecimientoDto: CrearEstablecimientoDto,
  ) {
    const { idEmpresa: idEmpresa } = params;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.establecimientoService.crear(
      idEmpresa,
      establecimientoDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  @ApiOperation({ summary: 'Activar establecimiento' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:idEmpresa/establecimientos/:id/activacion')
  @UsePipes(ValidationPipe)
  async activar(@Req() req, @Param() params) {
    const { id: idEstablecimiento } = params;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.establecimientoService.activar(
      idEstablecimiento,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Inactivar establecimiento' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:idEmpresa/establecimientos/:id/inactivacion')
  async inactivar(@Req() req, @Param() param) {
    const { id: idEstablecimiento } = param;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.establecimientoService.inactivar(
      idEstablecimiento,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Actualizar información de establecimiento' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch(':idEmpresa/establecimientos/:id')
  async actualizarDatos(
    @Req() req,
    @Param() param,
    @Body() establecimientoDto: ActualizarEstablecimientoDto,
  ) {
    const { id: idEstablecimiento } = param;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.establecimientoService.actualizarDatos(
      idEstablecimiento,
      establecimientoDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }
}
