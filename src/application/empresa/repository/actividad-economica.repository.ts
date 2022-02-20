import { EntityRepository, Repository } from 'typeorm';
import { ActividadEconomica } from '../entities/actividad-economica.entity';
import { Establecimiento } from '../entities/establecimiento.entity';
import { Status } from '../../../common/constants';
import { CrearActividadEconomicaDto } from '../dto/actividad-economica.dto';

@EntityRepository(ActividadEconomica)
export class ActividadEconomicaRepository extends Repository<ActividadEconomica> {
  async listarPorIdEstablecimiento(id) {
    const queryBuilder = await this.createQueryBuilder('actividadEconomica')
      .select([
        'actividadEconomica.id',
        'actividadEconomica.codGranActividad',
        'actividadEconomica.codTipoActividad',
        'actividadEconomica.codTipoClasificador',
        'actividadEconomica.codActividad',
        'actividadEconomica.estado',
      ])
      .where('actividadEconomica.estado = :estado', { estado: Status.ACTIVE })
      .andWhere('id_establecimiento = :id', { id })
      .getMany();
    return queryBuilder;
  }

  async crear(
    idEstablecimiento,
    actividadEconomicaDto: CrearActividadEconomicaDto,
    usuarioAuditoria: string,
  ) {
    // Establecimiento
    const establecimiento = new Establecimiento();
    establecimiento.id = idEstablecimiento;

    // Actividad economica
    const actividadEconomica = new ActividadEconomica();
    actividadEconomica.establecimiento = establecimiento;

    actividadEconomica.codGranActividad =
      actividadEconomicaDto?.codGranActividad;
    actividadEconomica.codTipoActividad =
      actividadEconomicaDto?.codTipoActividad;
    actividadEconomica.codTipoClasificador =
      actividadEconomicaDto?.codTipoClasificador;
    actividadEconomica.codActividad = actividadEconomicaDto?.codActividad;
    actividadEconomica.estado = actividadEconomicaDto?.estado ?? Status.CREATE;
    actividadEconomica.usuarioCreacion = usuarioAuditoria;

    return this.save(actividadEconomica);
  }
}
