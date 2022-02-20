import { Controller, Body, Post, Req, UseGuards } from '@nestjs/common';
import { AbstractController } from '../../common/dto/abstract-controller.dto';
import { AprobacionService } from './aprobacion.service';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { UsuarioService } from '../usuario/service/usuario.service';

@Controller('aprobacion')
export class AprobacionController extends AbstractController {
  constructor(
    private aprobacionService: AprobacionService,
    private usuarioService: UsuarioService,
  ) {
    super();
  }

  @Post('tramite')
  @UseGuards(JwtAuthGuard)
  async aprobarTramite(@Req() req) {
    const datos = {
      idUsuario: this.getUser(req),
      idTramite: 123,
      pathFile: './documentos_soporte/1.pdf',
    };
    return await this.aprobacionService.enviarSolicitud(datos);
  }

  @Post('callback')
  async callbackAprobarDocumento(@Body() respuesta: any) {
    console.log(respuesta);
    return respuesta;
  }
}
