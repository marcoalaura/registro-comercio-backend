import { Brackets, EntityRepository, Repository } from 'typeorm';
import { Arancel } from '../entities/parametricas/arancel.entity';

@EntityRepository(Arancel)
export class ArancelRepository extends Repository<Arancel> {
  solicitudPagoPorTramite(idTramite: number) {
    return this.createQueryBuilder('a')
      .innerJoinAndSelect('a.catalogoTramite', 'c')
      .innerJoinAndSelect('c.tramites', 't')
      .innerJoinAndSelect('t.empresa', 'e')
      .innerJoinAndSelect('t.parametrica', 'p')
      .select([
        'a.id',
        'a.tipo',
        'a.monto',
        'a.funcionDependiente',
        'c.id',
        't.id',
        'p.nombre',
      ])
      .where('t.id =:idTramite', { idTramite })
      .andWhere(
        new Brackets((qb) => {
          qb.where('a.codigoTipoSocietario is null').orWhere(
            'a.codigoTipoSocietario = e.codTipoPersona',
          );
        }),
      )
      .orderBy('a.id')
      .getManyAndCount();
  }
}
