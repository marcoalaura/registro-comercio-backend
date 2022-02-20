import {
  // Body,
  Controller,
  Get,
  Param,
  // Post,
  // Req,
  UseGuards,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
// import { CrearObjetoSocialDto } from '../dto/crear-objeto-social.dto';
import { VinculadoService } from '../service/vinculado.service';

@Controller('/empresa/:idEmpresa')
export class VinculadoController extends AbstractController {
  constructor(private _vinculadoService: VinculadoService) {
    super();
  }
  // obtener objeto social
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/vinculados')
  async obtenerVinculados(@Param('idEmpresa') id: string) {
    const result = await this._vinculadoService.buscarPorIdEmpresa(id);
    return result;
  }

  // // POST crear objeto social
  // @UseGuards(JwtAuthGuard, CasbinGuard)
  // @Post('/empresa')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async crear(@Req() req, @Body() objetoSocialDto: CrearObjetoSocialDto) {
  //   const usuarioAuditoria = this.getUser(req);
  //   const result = await this._objetoSocialService.crear(
  //     usuarioAuditoria,
  //     objetoSocialDto,
  //   );
  //   return this.successCreate(result);
  // }
}
