import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VistaEmpresaRepository } from '../../repository/soap/empresa.repository';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(VistaEmpresaRepository)
    private vistaEmpresaRepository: VistaEmpresaRepository,
  ) {}

  async verEstadoMatriculaComercio(matricula: string) {
    return await this.vistaEmpresaRepository.verEstadoMatriculaComercio(
      matricula,
    );
  }

  async buscarPorNIT(nit: string) {
    return await this.vistaEmpresaRepository.buscarPorNIT(nit);
  }

  async buscarPorMatricula(matricula: string) {
    return await this.vistaEmpresaRepository.buscarPorMatricula(matricula);
  }

  async buscarPorRazonSocial(razonSocial: string) {
    return await this.vistaEmpresaRepository.buscarPorRazonSocial(razonSocial);
  }
}
