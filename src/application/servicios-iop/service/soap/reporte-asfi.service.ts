import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReporteASFIRepository } from '../../repository/soap/reporte-asfi.repository';

@Injectable()
export class ListadoReporteASFIService {
  constructor(
    @InjectRepository(ReporteASFIRepository)
    private reporteASFIRepository: ReporteASFIRepository,
  ) {}

  async buscarPorMatricula() {
    return await this.reporteASFIRepository.generarListadoReporte();
  }
}
