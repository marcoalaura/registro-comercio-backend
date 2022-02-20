import { EntityRepository, Repository } from 'typeorm';
import { PersonaDto } from '../dto/persona.dto';
import { Persona } from '../entity/persona.entity';

@EntityRepository(Persona)
export class PersonaRepository extends Repository<Persona> {
  buscarPersonaPorCI(persona: PersonaDto) {
    return this.createQueryBuilder('persona')
      .where('persona.nro_documento = :ci', { ci: persona.nroDocumento })
      .getOne();
  }
}
