import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { CrearObjetoSocialDto } from '../dto/crear-objeto-social.dto';
import { VinculadoRepository } from '../repository/vinculado.repository';
// import { ActualizarObjetoSocialDto } from '../dto/actualizar-objeto-social.dto';
// import { ObjetoSocial } from '../entities/objeto_social.entity';

// import { Status } from '../../../common/constants';
// import { Empresa } from '../entities/empresa.entity';
// import { Actions } from '../../../common/constants/audit-actions';

@Injectable()
export class VinculadoService {
  constructor(
    @InjectRepository(VinculadoRepository)
    private _vinculadoRepository: VinculadoRepository,
  ) {}
  //
  async buscarPorIdEmpresa(id: string) {
    const resultado = await this._vinculadoRepository.listarPorIdEmpresa(id);
    return resultado;
  }
}
