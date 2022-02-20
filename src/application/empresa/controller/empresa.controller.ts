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
import { CrearEmpresaDto, ActualizarEmpresaDto } from '../dto/empresa.dto';
import { EmpresaService } from '../service/empresa.service';
import { FiltrosEmpresaDto } from '../dto/filtros-empresa.dto';
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Empresa')
@Controller('empresas')
export class EmpresaController extends AbstractController {
  constructor(private empresaService: EmpresaService) {
    super();
  }

  @ApiOperation({ summary: 'Listar empresas' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get()
  async listar(@Query() paginacionQueryDto: FiltrosEmpresaDto) {
    const result = await this.empresaService.listar(paginacionQueryDto);
    return this.successListRows(result);
  }

  @ApiOperation({
    summary: 'Listar empresas por usuario propietario/representante legal',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/misEmpresas')
  async listarPorUsuario(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosEmpresaDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('usuario id token ', usuarioAuditoria);
    const result = await this.empresaService.listarPorUsuario(
      paginacionQueryDto,
      usuarioAuditoria,
    );
    return this.successListRows(result);
  }

  @ApiOperation({
    summary:
      'Listar empresas por usuario propietario/representante legal con estado de habilitacion',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/misEmpresasHabilitacion')
  async listarHabilitacionPorUsuario(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosEmpresaDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    //console.log('usuario id token ', usuarioAuditoria);
    const result = await this.empresaService.listarHabilitacionPorUsuario(
      paginacionQueryDto,
      usuarioAuditoria,
    );
    return this.successListRows(result);
  }

  @ApiOperation({
    summary:
      'Consultar estado de habilitación de empresa por matricula anterior',
  })
  //@UseGuards(JwtAuthGuard)
  @Get('/consultarEstadoHabilitacion/:matricula')
  async consultarEstadoHabilitacion(@Req() req, @Param() params) {
    const matriculaConsultar = params.matricula;
    const result =
      await this.empresaService.consultarEstadoPorMatriculaAnterior(
        matriculaConsultar,
      );
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Obtener información de empresa' })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async obtenerDatosEmpresa(@Req() req, @Param() params) {
    const { id: idEmpresa } = params;
    // const usuarioAuditoria = this.getUser(req);
    const result = await this.empresaService.buscarPorId(idEmpresa);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Crear empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Req() req, @Body() empresaDto: CrearEmpresaDto) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.empresaService.crear(
      empresaDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  @ApiOperation({ summary: 'Buscar empresa por matricula (sin autenticar)' })
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('/buscarMatricula')
  @UsePipes(new ValidationPipe({ transform: true }))
  async buscarEmpresaMatricula(@Req() req, @Body() body) {
    const result = await this.empresaService.buscarPorMatricula(body);
    return this.successList(result);
  }

  @ApiOperation({
    summary: 'Validar datos de empresa con SIN para habilitación en línea',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/validarNITLinea')
  async validarNITLinea(@Req() req, @Body() body) {
    const result = await this.empresaService.validarNITLinea(body);
    return this.successList(result.datos, result.mensaje);
  }

  @ApiOperation({ summary: 'Activar empresa' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch('/habilitar')
  async habilitar(@Req() req, @Body() body) {
    console.log(body);
    const { id: id } = body;
    const { nit: nit } = body;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.empresaService.habilitar(
      id,
      nit,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Cambiar escenario' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch('/cambiarEscenario')
  async cambiarEscenario(@Req() req, @Body() body) {
    const { id: idEmpresa } = body;
    const datos = {
      escenario: body.escenario,
      observacion: body.observacion,
    };
    const usuarioAuditoria = this.getUser(req);
    const result = await this.empresaService.cambiarEscenario(
      idEmpresa,
      datos,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Inactivar empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() param) {
    const { id: idEmpresa } = param;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.empresaService.inactivar(
      idEmpresa,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'actualizar datos de empresa' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch(':id')
  async actualizarDatos(
    @Req() req,
    @Param() param,
    @Body() empresaDto: ActualizarEmpresaDto,
  ) {
    const { id: idEmpresa } = param;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.empresaService.actualizarDatos(
      idEmpresa,
      empresaDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }
}
