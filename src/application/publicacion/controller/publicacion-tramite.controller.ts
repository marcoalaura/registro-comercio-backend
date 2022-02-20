import {
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { PublicacionTramiteService } from '../services/publicacion-tramite.service';
import { FiltrosPublicacionDto } from '../dto/filtros-publicacion.dto';

const idEmpresa = '3'; // reemplazar por parámetro

@ApiTags('PublicacionesTramite')
@Controller('publicacion-tramite')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class PublicacionTramiteController extends AbstractController {
  constructor(private publicacionTramiteService: PublicacionTramiteService) {
    super();
  }

  @ApiOperation({
    summary: 'Listar publicaciones solicitadas por empresa',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('solicitados/listado')
  async listarSolicitudes(@Query() paginacionQueryDto: FiltrosPublicacionDto) {
    const result = await this.publicacionTramiteService.listarSolicitudes(
      paginacionQueryDto,
      idEmpresa,
    );
    return this.successListRows(result);
  }

  @ApiOperation({
    summary: 'Listar publicaciones confirmadas por empresa',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('confirmados/listado')
  async listarConfirmados(@Query() paginacionQueryDto: FiltrosPublicacionDto) {
    const result = await this.publicacionTramiteService.listarConfirmados(
      paginacionQueryDto,
      idEmpresa,
    );
    return this.successListRows(result);
  }

  @ApiOperation({ summary: 'Detalle publicación-tramite' })
  @Get('/:id')
  async obtener(@Param() params) {
    const { id } = params;
    const result = await this.publicacionTramiteService.obtener(id, idEmpresa);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Anular publicación-tramite por empresa' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch('/:id/anulacion')
  async anular(@Req() req, @Param() params) {
    const usuarioAuditoria = this.getUser(req);
    const { id } = params;
    const result = await this.publicacionTramiteService.anular(
      usuarioAuditoria,
      id,
      idEmpresa,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Crear publicacion-tramite en estado SOLICITUD' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/:id/solicitud')
  async crearPublicacionTramiteSolicitud(@Param('id') id: string, @Req() req) {
    // const usuarioAuditoria = this.getUser(req);
    const usuarioAuditoria = 1;
    const body = req.body;
    console.log('[publicacion-tramite:controller] req.body :: ', req.body);
    const result = await this.publicacionTramiteService.crearPublicacion(
      {
        idEmpresa,
        idCatalogoPublicacion: id,
        usuarioAuditoria,
        fechaPublicacion: body.fechaPublicacion,
      },
      body.camposFormulario,
    );
    return this.successCreate(result);
  }
}
