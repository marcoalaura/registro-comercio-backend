import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VistaServiciosRESTRepository } from '../../repository/rest/empresa.repository';

@Injectable()
export class ServiciosRESTService {
  constructor(
    @InjectRepository(VistaServiciosRESTRepository)
    private vistaServiciosRESTRepository: VistaServiciosRESTRepository,
  ) {}

  async buscarMatriculasPorNIT(nit: string) {
    return await this.vistaServiciosRESTRepository.buscarMatriculaPorNIT(nit);
  }

  async buscarMatriculas(matricula: string) {
    return await this.vistaServiciosRESTRepository.buscarMatriculas(matricula);
  }

  async buscarRepresentantesPorMatricula(matricula: string) {
    return await this.vistaServiciosRESTRepository.buscarRepresentantesPorMatricula(
      matricula,
    );
  }
}
