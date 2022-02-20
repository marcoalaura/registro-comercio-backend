import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CrearInformacionFinancieraDto } from '../dto/informacion-financiera.dto';

import { InformacionFinancieraRepository } from '../repository/informacion-financiera.repository';

@Injectable()
export class InformacionFinancieraService {
  //
  constructor(
    @InjectRepository(InformacionFinancieraRepository)
    private _infoFinanRepo: InformacionFinancieraRepository,
  ) {}

  async buscarPorIdEmpresa(id: string) {
    const resultado = await this._infoFinanRepo.listarPorIdEmpresa(id);
    return resultado;
  }

  async buscarPorId(id: string) {
    const resultado = await this._infoFinanRepo.buscarPorId(parseInt(id, 10));
    return resultado;
  }

  async crear(data: CrearInformacionFinancieraDto, idEmpresa: string) {
    const resultado = await this._infoFinanRepo.crear(data, idEmpresa);
    const { id, estado } = resultado;
    return { id, estado };
  }
}
