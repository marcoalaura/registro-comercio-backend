import { EntityRepository, Repository } from 'typeorm';
import { Contacto } from '../entities/contacto.entity';
import { CrearContactoDto } from '../dto/contacto.dto';
import { Establecimiento } from '../entities/establecimiento.entity';
import { Persona } from 'src/core/usuario/entity/persona.entity';

import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';

@EntityRepository(Contacto)
export class ContactoRepository extends Repository<Contacto> {
  async listarPorIdEstablecimiento(id: string) {
    const queryBuilder = await this.createQueryBuilder('contacto')
      .select([
        'contacto.id',
        'contacto.tipoContacto',
        'contacto.descripcion',
        'contacto.estado',
      ])
      .where('id_establecimiento= :id', { id })
      .getMany();
    return queryBuilder;
  }

  async listarPorIdPersona(id: string) {
    const queryBuilder = await this.createQueryBuilder('contacto')
      .select([
        'contacto.id',
        'contacto.tipoContacto',
        'contacto.descripcion',
        'contacto.estado',
      ])
      .where('id_persona= :id', { id })
      .getMany();
    return queryBuilder;
  }

  async crear(
    data: CrearContactoDto,
    idEstablecimiento: number,
    idPersona: number,
  ) {
    const establecimiento = new Establecimiento();
    establecimiento.id = idEstablecimiento;

    if (idPersona) {
      const persona = new Persona();
      persona.id = idPersona;
      return this.save({ ...data, establecimiento, persona });
    } else {
      return this.save({ ...data, establecimiento });
    }
  }

  async buscarPorId(id: number) {
    const data = await this.createQueryBuilder('contacto')
      .leftJoinAndSelect('contacto.establecimiento', 'establecimiento')
      .select([
        'contacto.id',
        'contacto.tipoContacto',
        'contacto.descripcion',
        'establecimiento.id',
      ])
      .where('contacto.id = :id', { id })
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
