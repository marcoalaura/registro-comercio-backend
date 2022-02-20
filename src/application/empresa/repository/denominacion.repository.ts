import { EntityRepository, Repository } from 'typeorm';
import { Denominacion } from '../entities/denominacion.entity';
import { Establecimiento } from '../entities/establecimiento.entity';
import { Status } from '../../../common/constants';
import { CrearDenominacionDto } from '../dto/denominacion.dto';

@EntityRepository(Denominacion)
export class DenominacionRepository extends Repository<Denominacion> {
  async listarPorIdEstablecimiento(id) {
    const queryBuilder = await this.createQueryBuilder('denominacion')
      .select([
        'denominacion.id',
        'denominacion.denominacion',
        'denominacion.sigla',
        'denominacion.estado',
      ])
      .where('denominacion.estado = :estado', { estado: Status.ACTIVE })
      .andWhere('id_establecimiento = :id', { id })
      .getMany();
    return queryBuilder;
  }

  buscarPorDenominacion(denominacion: string) {
    return this.createQueryBuilder('denominacion')
      .where('denominacion = :denominacion', {
        denominacion: denominacion,
      })
      .getOne();
  }

  async crear(
    idEstablecimiento,
    denominacionDto: CrearDenominacionDto,
    usuarioAuditoria: string,
  ) {
    // Establecimiento
    const establecimiento = new Establecimiento();
    establecimiento.id = idEstablecimiento;

    // Denominacion
    const denominacion = new Denominacion();
    denominacion.establecimiento = establecimiento;

    denominacion.denominacion = denominacionDto?.denominacion;
    denominacion.sigla = denominacionDto?.sigla;
    denominacion.estado = denominacionDto?.estado ?? Status.CREATE;
    denominacion.usuarioCreacion = usuarioAuditoria;

    return this.save(denominacion);
  }
}
