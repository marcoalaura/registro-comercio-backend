import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { DocumentosEmitidosRepository } from '../repository/documentosEmitidos.repository';

@Injectable()
export class DocumentosEmitidosService {
  constructor(
    @InjectRepository(DocumentosEmitidosRepository)
    private documentosEmitidosRepository: DocumentosEmitidosRepository,
  ) {}

  async listarPorUsuarioEmpresa(
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    usuarioAuditoria: string,
    idEmpresa: string,
  ) {
    const resultado =
      await this.documentosEmitidosRepository.listarPorUsuarioEmpresa(
        paginacionQueryDto,
        usuarioAuditoria,
        idEmpresa,
      );
    return resultado;
  }
}
