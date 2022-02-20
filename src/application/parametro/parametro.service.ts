import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParametroRepository } from './parametro.repository';
import { Parametro } from './parametro.entity';
import { CrearParametroDto } from './dto/crear-parametro.dto';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';

@Injectable()
export class ParametroService {
  constructor(
    @InjectRepository(ParametroRepository)
    private parametroRepositorio: ParametroRepository,
  ) {}

  async crear(parametroDto: CrearParametroDto): Promise<Parametro> {
    const result = await this.parametroRepositorio.crear(parametroDto);
    return result;
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.parametroRepositorio.listar(paginacionQueryDto);
    return result;
  }

  async listarPorGrupo(grupo: string) {
    const result = await this.parametroRepositorio.listarPorGrupo(grupo);
    return result;
  }

  async listarDepartamentos(query: PaginacionQueryDto) {
    const resultado = await this.parametroRepositorio.listarDepartamentos(
      query,
    );
    return resultado;
  }

  async listarTerritorios(query: PaginacionQueryDto) {
    const resultado = await this.parametroRepositorio.listarTerritorios(query);
    return resultado;
  }

  async listarMunicipiosByDpto(idDpto: string) {
    const resultado = await this.parametroRepositorio.listarMunicipiosByDpto(
      idDpto,
    );
    return resultado;
  }

  async obtenerDescripcion(grupo: string, codigo: string) {
    const resultado = await this.parametroRepositorio.obtenerDescripcion(
      grupo,
      codigo,
    );
    return resultado;
  }
}
