import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LiquidacionService } from '../services/liquidacion.service';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
// import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@ApiTags('Liquidacion')
@Controller('liquidaciones')
export class LiquidacionController extends AbstractController {
  constructor(private liquidacionService: LiquidacionService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Buscar liquidaciones por id de trámite',
  })
  @Get('/:id/tramite')
  async buscarPorIdTramite(@Param('id') id: string) {
    const result = await this.liquidacionService.buscarPorIdTramite(id);
    return this.successListRows(result);
  }
}
