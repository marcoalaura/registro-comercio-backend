import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VistaRepresentanteLegalRepository } from '../../repository/soap/representante-legal.repository';

@Injectable()
export class RepresentanteLegalService {
  constructor(
    @InjectRepository(VistaRepresentanteLegalRepository)
    private vistaRepresentanteLegalRepository: VistaRepresentanteLegalRepository,
  ) {}

  async buscarPorMatricula(matricula: string) {
    return await this.vistaRepresentanteLegalRepository.buscarPorMatricula(
      matricula,
    );
  }
}
