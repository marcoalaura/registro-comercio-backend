import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FiltrosPublicacionDto } from '../dto/filtros-publicacion.dto';
import { PublicacionRepository } from '../repository/publicacion.repository';

/* eslint-disable max-lines-per-function */
@Injectable()
export class PublicacionService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(PublicacionRepository)
    private publicacionRepository: PublicacionRepository,
  ) {}

  async listar(
    @Query() paginacionQueryDto: FiltrosPublicacionDto,
    idEmpresa: string,
  ) {
    const resultado = await this.publicacionRepository.listar(
      paginacionQueryDto,
      idEmpresa,
    );
    return resultado;
  }

  async obtener(id: number) {
    const publicacion = await this.publicacionRepository.obtenerPorId(id);

    return publicacion;
  }
}
