import { EntityRepository, Repository } from 'typeorm';
import { Direccion } from '../entities/direccion.entity';
import { CrearDireccionDto } from '../dto/direccion.dto';
import { Establecimiento } from '../entities/establecimiento.entity';

import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';

@EntityRepository(Direccion)
export class DireccionRepository extends Repository<Direccion> {
  async listarPorIdEstablecimiento(id: string) {
    const queryBuilder = await this.createQueryBuilder('direccion')
      .select([
        'direccion.id',
        'direccion.codTipoDireccion',
        'direccion.codDepartamento',
        'direccion.codProvincia',
        'direccion.codMunicipio',
        'direccion.nombreSubdivisionGeografica',
        'direccion.nombreVia',
        'direccion.numeroDomicilio',
        'direccion.edificio',
        'direccion.direccionReferencial',
        'direccion.latitud',
        'direccion.longitud',
        'direccion.estado',
      ])
      .where('id_establecimiento= :id', { id })
      .getMany();
    return queryBuilder;
  }

  async crear(data: CrearDireccionDto, idEstablecimiento: number) {
    const establecimiento = new Establecimiento();
    establecimiento.id = idEstablecimiento;

    return this.save({ ...data, establecimiento });
  }

  async buscarPorId(id: number) {
    const data = await this.createQueryBuilder('direccion')
      .leftJoinAndSelect('direccion.establecimiento', 'establecimiento')
      .select([
        'direccion.id',
        'direccion.codTipoDireccion',
        'direccion.codDepartamento',
        'direccion.codProvincia',
        'direccion.codMunicipio',
        'direccion.nombreSubdivisionGeografica',
        'direccion.nombreVia',
        'direccion.numeroDomicilio',
        'direccion.edificio',
        'direccion.direccionReferencial',
        'direccion.latitud',
        'direccion.longitud',
        'direccion.estado',
        'establecimiento.id',
      ])
      .where('direccion.id = :id', { id })
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
