import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { PublicacionGenericoService } from '../services/publicacion-generico.service';

@ApiTags('Publicacion')
@Controller('publicaciones')
export class PublicacionGenericoController extends AbstractController {
  constructor(private publicacionGenericoService: PublicacionGenericoService) {
    // private publicacionGenericoCamposService: TramiteGenericoCamposService,
    super();
  }

  @Get(':idPublicacion/genericos')
  async consultaCatalogoTramite(@Param('idPublicacion') idPublicacion: string) {
    const result =
      await this.publicacionGenericoService.consultarPublicacionCatalogoTramite(
        Number(idPublicacion),
      );
    return this.successList(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('genericos/:idCatalogoPublicacion')
  async crearSolicitudPublicacion(
    @Param('idCatalogoPublicacion') idCatalogoPublicacion: string,
    @Req() req,
  ) {
    // const idEmpresa = 1;
    const usuarioAuditoria = this.getUser(req);
    console.log('usuarioAuditoria :: ', usuarioAuditoria);
    const result =
      await this.publicacionGenericoService.obtenerCatalogoPublicacion(
        // idEmpresa,
        Number(idCatalogoPublicacion),
        // usuarioAuditoria,
      );
    return this.successCreate(result);
  }
}
