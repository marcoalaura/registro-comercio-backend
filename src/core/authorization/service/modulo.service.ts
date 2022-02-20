import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuloRepository } from '../repository/modulo.repository';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { CrearModuloDto } from '../dto/crear-modulo.dto';
@Injectable()
export class ModuloService {
  constructor(
    @InjectRepository(ModuloRepository)
    private moduloRepositorio: ModuloRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.moduloRepositorio.listar(paginacionQueryDto);
    return result;
  }

  async listarTodo() {
    const result = await this.moduloRepositorio.obtenerModulosSubmodulos();
    return result;
  }

  async crear(moduloDto: CrearModuloDto) {
    const result = await this.moduloRepositorio.crear(moduloDto);
    return result;
  }
}
