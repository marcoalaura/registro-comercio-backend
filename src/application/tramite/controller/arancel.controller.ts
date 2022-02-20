import {
  Controller,
  Get,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { ArancelService } from '../services/arancel.service';

@ApiTags('Aranceles')
@Controller('aranceles')
export class ArancelController extends AbstractController {
  constructor(private aracelService: ArancelService) {
    super();
  }

  @ApiOperation({ summary: 'Aranceles por tramite' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('tramite/:idTramite')
  async listarPorTramite(@Param() params) {
    const { idTramite } = params;
    const result = await this.aracelService.listarPorTramite(idTramite);
    return this.successListRows(result);
  }
}
