import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LiquidacionRepository } from '../repository/tramite-liquidacion.repository';
// import {
//   ActualizarLiquidacionDTO,
//   CrearLiquidacionDTO,
// } from '../dto/tramite-liquidacion.dto';

@Injectable()
export class LiquidacionService {
  constructor(
    @InjectRepository(LiquidacionRepository)
    private liquidacionRepository: LiquidacionRepository,
  ) {}

  async buscarPorIdTramite(id: string) {
    const resultado = await this.liquidacionRepository.buscarPorIdTramite(id);
    return [resultado, resultado.length];
  }
}
