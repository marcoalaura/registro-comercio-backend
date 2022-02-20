import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { ClasificadorRepository } from '../repository/clasificador.repository';

@Injectable()
export class ClasificadorService {
  constructor(
    @InjectRepository(ClasificadorRepository)
    private clasificadorRepository: ClasificadorRepository,
  ) {}

  async listar(query: PaginacionQueryDto) {
    const resultado = await this.clasificadorRepository.listar(query);
    return resultado;
  }

  async obtenerDescripcion(tipo: string, codigo: string) {
    const resultado = await this.clasificadorRepository.obtenerDescripcion(
      tipo,
      codigo,
    );
    return resultado;
  }
}
