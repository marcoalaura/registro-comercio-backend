import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabilitacionExcepcionRepository } from '../repository/habilitacion-excepcion.repository';
// import { HabilitacionExcepcion } from '../entities/habilitacion_excepcion.entity';
// import { Empresa } from '../entities/empresa.entity';

// import { Status } from '../../../common/constants';
// import { Actions } from '../../../common/constants/audit-actions';

@Injectable()
export class HabilitacionExcepcionService {
  constructor(
    @InjectRepository(HabilitacionExcepcionRepository)
    private habilitacionExcepcionRepo: HabilitacionExcepcionRepository,
  ) {}

  async verificarExisteActivaPorIdEmpresa(id: string) {
    const resultado =
      await this.habilitacionExcepcionRepo.tieneActivaPorIdEmpresa(id);
    return resultado;
  }

  async buscarPorIdEmpresa(id: string) {
    const resultado = await this.habilitacionExcepcionRepo.listarPorIdEmpresa(
      id,
    );
    return resultado;
  }

  async buscarPorId(id: string) {
    const resultado = await this.habilitacionExcepcionRepo.buscarPorId(
      parseInt(id, 10),
    );
    return resultado;
  }
}
