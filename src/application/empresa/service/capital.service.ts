import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrearCapitalDto } from '../dto/capital.dto';
import { CapitalRepository } from '../repository/capital.repository';

@Injectable()
export class CapitalService {
  // constructor
  constructor(
    @InjectRepository(CapitalRepository)
    private _capitalRepo: CapitalRepository,
  ) {}

  // buscar por id de empresa
  async buscarPorIdEmpresa(id: string) {
    const resultado = await this._capitalRepo.listarPorIdEmpresa(id);
    return resultado;
  }

  // crear por id de empresa
  async crear(data: CrearCapitalDto, idEmpresa: string) {
    const resultado = await this._capitalRepo.crear(data, idEmpresa);
    const { id, estado } = resultado;
    return { id, estado };
  }
}
