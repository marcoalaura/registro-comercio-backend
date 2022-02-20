import {
  Controller,
  Get,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ObservacionService } from '../services/observacion.service';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@ApiTags('Observaciones')
@Controller('observaciones')
export class ObservacionController extends AbstractController {
  constructor(private observacionService: ObservacionService) {
    super();
  }

  @ApiOperation({ summary: 'Listar observaciones por tramite' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/tramite/:idTramite')
  async listarPorTramite(@Param() params) {
    const { idTramite } = params;
    const result = await this.observacionService.listarPorTramite(idTramite);
    return this.successListRows(result);
  }
}
