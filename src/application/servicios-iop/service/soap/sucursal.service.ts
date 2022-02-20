import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VistaSucursalRepository } from '../../repository/soap/sucursal.repository';

@Injectable()
export class SucursalService {
  constructor(
    @InjectRepository(VistaSucursalRepository)
    private vistaSucursalRepository: VistaSucursalRepository,
  ) {}

  async buscarPorMatricula(matricula: string) {
    return await this.vistaSucursalRepository.buscarPorMatricula(matricula);
  }
}
