import { Controller, Get, Param } from '@nestjs/common';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { DenominacionService } from '../service/denominacion.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Denominación')
@Controller('empresas')
export class DenominacionController extends AbstractController {
  constructor(private denominacionService: DenominacionService) {
    super();
  }

  @ApiOperation({ summary: 'Listar denominaciones por establecimiento' })
  @Get('/:idEmpresa/establecimientos/:idEstablecimiento/denominaciones')
  async obtenerDenominaciones(
    @Param('idEmpresa') idEmpresa: string,
    @Param('idEstablecimiento') idEstablecimiento: string,
  ) {
    const result = await this.denominacionService.buscarPorIdEstablecimiento(
      idEstablecimiento,
    );
    return this.successListRows(result);
  }
}
