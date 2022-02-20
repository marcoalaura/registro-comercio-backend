import { Controller, Get, Param } from '@nestjs/common';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { ActividadEconomicaService } from '../service/actividad-economica.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Actividad Economica')
@Controller('empresas')
export class ActividadEconomicaController extends AbstractController {
  constructor(private actividadEconomicaService: ActividadEconomicaService) {
    super();
  }

  @ApiOperation({
    summary: 'Listar actividades economicas por establecimiento',
  })
  @Get('/:idEmpresa/establecimientos/:idEstablecimiento/actividades-economicas')
  async obtenerActividadesEconomicas(
    @Param('idEmpresa') idEmpresa: string,
    @Param('idEstablecimiento') idEstablecimiento: string,
  ) {
    const result =
      await this.actividadEconomicaService.buscarPorIdEstablecimiento(
        idEstablecimiento,
      );
    return this.successListRows(result);
  }
}
