import { EntityRepository, Repository } from 'typeorm';
import { ObjetoSocial } from '../entities/objeto_social.entity';
import { CrearObjetoSocialDto } from '../dto/objeto-social.dto';
import { Empresa } from '../entities/empresa.entity';

import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';

@EntityRepository(ObjetoSocial)
export class ObjetoSocialRepository extends Repository<ObjetoSocial> {
  async listarPorIdEmpresa(id: string) {
    const queryBuilder = await this.createQueryBuilder('objeto_social')
      .select([
        'objeto_social.id',
        'objeto_social.objetoSocial',
        'objeto_social.estado',
      ])
      .where('id_empresa= :id', { id })
      .getMany();
    return queryBuilder;
  }

  //
  async crear(data: CrearObjetoSocialDto, idEmpresa: string) {
    const empresa = new Empresa();
    empresa.id = parseInt(idEmpresa, 10);
    return this.save({ ...data, empresa });
  }

  async buscarPorId(id: number) {
    const data = await this.createQueryBuilder('objeto_social')
      .leftJoinAndSelect('objeto_social.empresa', 'empresa')
      .select([
        'objeto_social.id',
        'objeto_social.objetoSocial',
        'empresa.id',
        'empresa.razonSocial',
      ])
      .where('objeto_social.id = :id', { id })
      .getOne();
    if (!data) {
      throw new EntityNotFoundException(Messages.EXCEPTION_NOT_FOUND);
    }
    return data;
  }

  async runTransaction(op) {
    return this.manager.transaction(op);
  }
}
