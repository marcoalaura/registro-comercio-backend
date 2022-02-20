import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { ServiciosRESTService } from '../service/rest/empresa.service';

@ApiTags('ServiciosIOP')
@Controller('servicios-iop')
export class ServiciosController extends AbstractController {
  // eslint-disable-next-line max-params
  constructor(private serviciosRESTService: ServiciosRESTService) {
    super();
  }

  @Get('/nits/:nit/matriculas')
  async buscarMatriculasPorNIT(@Param() params) {
    const nit = params.nit;
    const result = await this.serviciosRESTService.buscarMatriculasPorNIT(nit);
    return result;
  }

  @Get('/matriculas/:matricula')
  async buscarMatriculas(@Param() params) {
    const matricula = params.matricula;
    const result = await this.serviciosRESTService.buscarMatriculas(matricula);
    return result;
  }

  @Get('/matriculas/:matricula/representantes')
  async buscarRepresentatesPorMatricula(@Param() params) {
    const matricula = params.matricula;
    const result =
      await this.serviciosRESTService.buscarRepresentantesPorMatricula(
        matricula,
      );
    return result;
  }
}
