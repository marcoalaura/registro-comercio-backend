import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CrearObjetoSocialDto,
  ActualizarObjetoSocialDto,
} from '../dto/objeto-social.dto';
import { ObjetoSocialRepository } from '../repository/objeto-social.repository';
import { ObjetoSocial } from '../entities/objeto_social.entity';
import { Empresa } from '../entities/empresa.entity';

import { Status } from '../../../common/constants';
import { Actions } from '../../../common/constants/audit-actions';

@Injectable()
export class ObjetoSocialService {
  constructor(
    @InjectRepository(ObjetoSocialRepository)
    private _objetoSocialRepo: ObjetoSocialRepository,
  ) {}
  //
  async buscarPorIdEmpresa(id: string) {
    const resultado = await this._objetoSocialRepo.listarPorIdEmpresa(id);
    return resultado;
  }

  async buscarPorId(id: string) {
    const resultado = await this._objetoSocialRepo.buscarPorId(
      parseInt(id, 10),
    );
    return resultado;
  }

  async crear(data: CrearObjetoSocialDto, idEmpresa: string) {
    const resultado = await this._objetoSocialRepo.crear(data, idEmpresa);
    const { id, estado } = resultado;
    return { id, estado };
  }

  async actualizar(data: ActualizarObjetoSocialDto) {
    const result = await this._objetoSocialRepo.buscarPorId(data.id);
    const op = async (transaction) => {
      const repositorio = transaction.getRepository(ObjetoSocial);
      await repositorio.update(data.id, {
        estado: Status.INACTIVE,
        usuarioActualizacion: data.usuarioActualizacion,
        usuarioBaja: data.usuarioActualizacion,
        accion: Actions.DELETE_UPDATE,
        fechaBaja: new Date().toISOString().slice(0, 10),
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { usuarioActualizacion, ...dataNueva } = data;
      const empresa = new Empresa();
      empresa.id = result.empresa.id;
      return repositorio.save({
        ...dataNueva,
        empresa,
        accion: Actions.CREATE_UPDATE,
        usuarioCreacion: data.usuarioActualizacion,
      });
    };
    await this._objetoSocialRepo.runTransaction(op);
    return { id: data.id, estado: Actions.UPDATE };
  }
}
