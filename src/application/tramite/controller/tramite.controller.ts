import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { FiltrosTramitesDto } from './../dto/filtros-tramites.dto';
import { TramiteService } from '../services/tramite.service';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { createReadStream } from 'fs';
@ApiTags('Tramite')
@Controller('tramites')
export class TramiteController extends AbstractController {
  constructor(private tramiteService: TramiteService) {
    super();
  }

  @ApiOperation({ summary: 'Listar tramites por Usuario, Empresa y Estado' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/misTramites/:idEmpresa')
  async listarPorUsuarioEmpresa(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    @Param() params,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('usuario id token ', usuarioAuditoria);
    const { idEmpresa } = params;
    const result = await this.tramiteService.listarPorUsuarioEmpresa(
      paginacionQueryDto,
      usuarioAuditoria,
      idEmpresa,
    );
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'Obtener tramite por ID' })
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get(':id')
  async buscarPorId(@Param('id') id: number) {
    const result = await this.tramiteService.buscarPorId(id);
    return this.successList(result);
  }

  @Get(':id/datos')
  async datosPorId(@Param('id') id: number) {
    const result = await this.tramiteService.datosPorId(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Cambiar estado del tramite' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Post('/cambiarEstado')
  async cambiarEstado(@Req() req, @Body() body) {
    const usuarioAuditoria = this.getUser(req);
    const { id, estado } = body;
    const result = await this.tramiteService.cambiarEstado(
      usuarioAuditoria,
      id,
      estado,
    );
    return this.successDelete(result);
  }

  @ApiOperation({ summary: 'Listar seguimientos de un tramite por su id' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/seguimiento/:idTramite')
  async seguimientoPorTramite(@Param() params) {
    const { idTramite } = params;
    const result = await this.tramiteService.seguimientoPorTramite(idTramite);
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'pdf del tramite por su id' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/pdf/:idTramite')
  @Header('Content-Type', 'application/pdf')
  async pdfPorTramite(@Req() req, @Param() params, @Res() res) {
    const { idTramite } = params;
    const { path, nombre } = await this.tramiteService.pdfPorTramite(idTramite);
    res.setHeader('Content-disposition', 'attachment; filename=' + nombre);
    const filestream = createReadStream(path);
    filestream.pipe(res);
  }

  @ApiOperation({ summary: 'Obtener documento soporte' })
  // @UseGuards(JwtAuthGuard)
  @Get('/:idTramite/documentosSoporte/:campo')
  async obtenerDocumentoSoporte(@Param() params) {
    const { idTramite, campo } = params;
    const result = await this.tramiteService.obtenerDocumentoSoporte(
      Number(idTramite),
      campo,
    );
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Actualizar paso del tramite' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Post('/paso')
  async cambiarPasoTramite(@Req() req, @Body() body) {
    const usuarioAuditoria = this.getUser(req);
    const { id, paso } = body;
    const result = await this.tramiteService.cambiarPasoTramite(
      id,
      paso,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Aprobacion de documento' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/:idTramite/aprobaciondocumento')
  async aprobacionDocumento(@Req() req, @Param() params) {
    const usuarioAuditoria = this.getUser(req);
    const { idTramite } = params;
    const result = await this.tramiteService.aprobacionDocumento(
      idTramite,
      usuarioAuditoria,
    );
    return result;
  }
}
