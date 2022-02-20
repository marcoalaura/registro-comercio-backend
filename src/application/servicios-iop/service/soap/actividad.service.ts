import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VistaActividadRepository } from '../../repository/soap/actividad.repository';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(VistaActividadRepository)
    private vistaActividadRepository: VistaActividadRepository,
  ) {}

  async buscarPorMatricula(matricula: string) {
    return await this.vistaActividadRepository.buscarPorMatricula(matricula);
  }
}
