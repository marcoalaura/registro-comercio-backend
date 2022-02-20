import { EntityRepository, Repository } from 'typeorm';

import { Capital } from '../entities/capital.entity';
import { Empresa } from '../entities/empresa.entity';

import { CrearCapitalDto } from '../dto/capital.dto';

@EntityRepository(Capital)
export class CapitalRepository extends Repository<Capital> {
  //
  async listarPorIdEmpresa(id: string) {
    const queryBuilder = await this.createQueryBuilder('capital')
      .select([
        'capital.id',
        'capital.estado',
        'capital.codOrigenCapital',
        'capital.codPaisOrigenCapital',
        'capital.capitalSocial',
        'capital.cuotasCapitalSocial',
        'capital.capitalAutorizado',
        'capital.cuotaCapitalAutorizado',
        'capital.capitalSuscrito',
        'capital.cuotasCapitalSuscrito',
        'capital.capitalPagado',
        'capital.cuotasCapitalPagado',
        'capital.capitalAsignado',
        'capital.valorCuota',
        'capital.porcentajeAportePrivado',
        'capital.porcentajeAportePublico',
        'capital.porcentajeAporteExtranjero',
        'capital.codTipoMoneda',
        'capital.codLibroCapital',
        'capital.registroCapital',
      ])
      .where('id_empresa= :id', { id })
      .getMany();
    return queryBuilder;
  }

  //
  async crear(data: CrearCapitalDto, idEmpresa: string) {
    const empresa = new Empresa();
    empresa.id = parseInt(idEmpresa, 10);
    return this.save({ ...data, empresa });
  }
}
