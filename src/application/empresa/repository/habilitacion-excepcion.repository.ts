import { EntityRepository, Repository } from 'typeorm';
import { HabilitacionExcepcion } from '../entities/habilitacion_excepcion.entity';
// import { Empresa } from '../entities/empresa.entity';

import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';
import { Status } from '../../../common/constants';

@EntityRepository(HabilitacionExcepcion)
export class HabilitacionExcepcionRepository extends Repository<HabilitacionExcepcion> {
  async listarPorIdEmpresa(id: string) {
    const queryBuilder = await this.createQueryBuilder('habilitacionExcepcion')
      .select([
        'habilitacionExcepcion.id',
        'habilitacionExcepcion.motivo',
        'habilitacionExcepcion.fechaExcepcion',
        'habilitacionExcepcion.estado',
      ])
      .where(
        'habilitacionExcepcion.id_empresa= :id AND habilitacionExcepcion.estado = :estado',
        {
          id,
          estado: Status.ACTIVE,
        },
      )
      .getMany();
    return queryBuilder;
  }

  async buscarPorId(id: number) {
    const data = await this.createQueryBuilder('habilitacionExcepcion')
      .leftJoinAndSelect('habilitacionExcepcion.empresa', 'empresa')
      .select([
        'habilitacionExcepcion.id',
        'habilitacionExcepcion.motivo',
        'habilitacionExcepcion.fechaExcepcion',
        'empresa.id',
        'empresa.razonSocial',
      ])
      .where('habilitacionExcepcion.id = :id', { id })
      .getOne();
    if (!data) {
      throw new EntityNotFoundException(Messages.EXCEPTION_NOT_FOUND);
    }
    return data;
  }

  async tieneActivaPorIdEmpresa(id: string) {
    const excepcion = await this.createQueryBuilder('habilitacionExcepcion')
      .select(['habilitacionExcepcion.id'])
      .where(
        'habilitacionExcepcion.id_empresa= :id AND habilitacionExcepcion.estado = :estado',
        {
          id,
          estado: Status.ACTIVE,
        },
      )
      .getOne();
    return excepcion ? true : false;
  }
}
