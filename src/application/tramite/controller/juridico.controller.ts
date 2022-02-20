import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { TramiteService } from '../services/tramite.service';
import { ObservacionService } from '../services/observacion.service';
// import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@ApiTags('Juridico')
@Controller('juridico')
export class JuridicoController extends AbstractController {
  constructor(
    private tramiteService: TramiteService,
    private observacionService: ObservacionService,
  ) {
    super();
  }
  @ApiOperation({ summary: 'Listar tramites por las bandejas de pendientes' })
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/pendientes')
  async listarBandejaTramitesPendientes(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosTramitesDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteService.listarBandejaPendientes(
      paginacionQueryDto,
      usuarioAuditoria,
      req.query,
    );
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'Listar tramites por las bandejas observados' })
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/observados')
  async listarBandejaTramitesObservados(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosTramitesDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteService.listarBandejaObservados(
      paginacionQueryDto,
      usuarioAuditoria,
      req.query,
    );
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'Listar tramites por las bandejas de concluidos' })
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/concluidos')
  async listarBandejaTramitesConcluidos(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosTramitesDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteService.listarBandejaConcluidos(
      paginacionQueryDto,
      usuarioAuditoria,
      req.query,
    );
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'Listar tramites por las bandejas de inscritos' })
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/inscritos')
  async listarBandejaTramitesInscritos(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosTramitesDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteService.listarBandejaInscritos(
      paginacionQueryDto,
      usuarioAuditoria,
      req.query,
    );
    return this.successListRows(result);
  }

  @ApiOperation({
    summary: 'Actualizar trámite a estado REVISION',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Put('/pendientes/:idTramite/revision')
  async actualizarPendientes(
    @Req() req,
    @Param('idTramite') idTramite: number,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteService.cambiarEstadoRevision(
      usuarioAuditoria,
      idTramite,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({
    summary: 'Actualizar trámite a estado OBSERVADO',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Put('/pendientes/:idTramite/observado')
  async enviarObservados(@Req() req, @Param('idTramite') idTramite: number) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteService.cambiarEstadoObservado(
      usuarioAuditoria,
      idTramite,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({
    summary: 'Actualizar trámite a estado CONCLUIDO',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Put('/pendientes/:idTramite/concluido')
  async aprobarTramite(@Req() req, @Param('idTramite') idTramite: number) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteService.cambiarEstadoConcluido(
      usuarioAuditoria,
      idTramite,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({
    summary: 'Actualizar trámite a estado INSCRITO',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Put('/pendientes/:idTramite/inscrito')
  async inscribirTramite(@Req() req, @Param('idTramite') idTramite: number) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteService.cambiarEstadoInscrito(
      usuarioAuditoria,
      idTramite,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Listar observaciones de un tramite' })
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/observacion/:idTramite')
  async listarObservacionesTramites(
    @Req() req,
    @Param('idTramite') idTramite: number,
  ) {
    // const usuarioAuditoria = this.getUser(req);
    const result = await this.observacionService.listarPorTramiteFormato(
      idTramite,
    );
    return this.successList(result);
  }

  // eslint-disable-next-line max-params
  @ApiOperation({
    summary: 'Agregar observación a un campo del trámite',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Put('observacion/:idTramite/detalle/:idDetalle')
  async observacionDetalle(
    @Req() req,
    @Param('idTramite') idTramite: number,
    @Param('idDetalle') id: number,
    @Body() body,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const { observacion, sugerencia } = body;
    const result = await this.observacionService.actualizarObservacion(
      id,
      idTramite,
      'DETALLE',
      observacion,
      sugerencia,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // eslint-disable-next-line max-params
  @ApiOperation({
    summary: 'Agregar observación a un documento del trámite',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Put('observacion/:idTramite/documento/:idDocumento')
  async observacionDocumento(
    @Req() req,
    @Param('idTramite') idTramite: number,
    @Param('idDocumento') id: number,
    @Body() body,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const { observacion, sugerencia } = body;
    const result = await this.observacionService.actualizarObservacion(
      id,
      idTramite,
      'DOCUMENTO',
      observacion,
      sugerencia,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({
    summary: 'Agregar observación general a un trámite',
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Post('observacion/:idTramite/tramite')
  async observacionTramite(
    @Req() req,
    @Param('idTramite') id: number,
    @Body() body,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const { observacion, sugerencia } = body;
    const result = await this.observacionService.actualizarObservacion(
      id,
      id,
      'TRAMITE',
      observacion,
      sugerencia,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // eslint-disable-next-line max-params
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Put('observacion/:idTramite/tramite/:id')
  async actualizarObservacionTramite(
    @Req() req,
    @Param('idTramite') idTramite: number,
    @Param('id') id: number,
    @Body() body,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const { observacion, sugerencia } = body;
    const result = await this.observacionService.actualizarObservacionTramite(
      id,
      idTramite,
      observacion,
      sugerencia,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @ApiOperation({
    summary: 'Inactivar observación de un trámite',
  })
  @Put('observacion/:idTramite/inactivar/:id')
  async inactivarObservacion(
    @Req() req,
    @Param('idTramite') idTramite: number,
    @Param('id') id: number,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.observacionService.inactivarObservacion(
      id,
      idTramite,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Listar seguimientos de un tramite por su id' })
  @UseGuards(JwtAuthGuard)
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
}
