import { Brackets, EntityRepository, Repository } from 'typeorm';
import { Observacion } from '../entities/tramite/observacion.entity';
import { ObservacionEstado } from '../../../common/constants';

@EntityRepository(Observacion)
export class ObservacionRepository extends Repository<Observacion> {
  listarPorTramite(idTramite: string) {
    return this.createQueryBuilder('o')
      .leftJoinAndSelect('o.detalle', 'd')
      .leftJoinAndSelect('o.documento', 'do')
      .leftJoinAndSelect('o.tramite', 't')
      .select([
        'o.observacion',
        'o.valorObservado',
        'd.campo',
        'do.nombre',
        'd.idTramite',
        'do.idTramite',
      ])
      .where('o.estado =:activo', { activo: ObservacionEstado.ACTIVE })
      .andWhere(
        new Brackets((qb) => {
          qb.where('d.idTramite =:idTramite', { idTramite })
            .orWhere('do.idTramite =:idTramite', { idTramite })
            .orWhere('t.id =:idTramite', { idTramite });
        }),
      )
      .orderBy('d.id', 'ASC')
      .addOrderBy('do.id', 'ASC')
      .getManyAndCount();
  }

  listarPorTramiteFormato(idTramite: number) {
    return this.createQueryBuilder('o')
      .leftJoinAndSelect('o.detalle', 'd', 'd.tramite = :idTramite', {
        idTramite,
      })
      .leftJoinAndSelect('o.documento', 'do', 'do.tramite = :idTramite', {
        idTramite,
      })
      .leftJoinAndSelect('o.tramite', 't', 't.id = :idTramite', {
        idTramite,
      })
      .select([
        'o.id as id',
        'CASE WHEN d.campo is not null THEN d.id WHEN do.nombre is not null THEN do.id ELSE null END as "idCampo"',
        `CASE WHEN d.campo is not null THEN 'DETALLE' WHEN do.nombre is not null THEN 'DOCUMENTO' ELSE 'GENERAL' END as tipo`,
        'CASE WHEN d.campo is not null THEN d.campo WHEN do.nombre is not null THEN do.nombre ELSE null END as casilla',
        'o.valorObservado as valorObservado',
        'o.observacion as observacion',
      ])
      .where('o.estado =:activo AND o.id_tramite = :idTramite', {
        activo: ObservacionEstado.ACTIVE,
        idTramite,
      })
      .getRawMany();
  }

  // eslint-disable-next-line max-lines-per-function
  crearObservacion(params: any) {
    return this.createQueryBuilder()
      .insert()
      .into(Observacion)
      .values({
        observacion: params.observacion,
        detalle: params.detalle,
        documento: params.documento,
        tramite: params.tramite,
        valorObservado: params.valorObservado,
        estado: ObservacionEstado.ACTIVE,
        fechaCreacion: new Date(),
        usuarioCreacion: params.usuarioAuditoria,
      })
      .returning(['id', 'estado'])
      .execute();
  }

  actualizarObservacion(params: any) {
    return this.createQueryBuilder()
      .update(Observacion)
      .set({
        observacion: params.observacion,
        estado: ObservacionEstado.ACTIVE,
        usuarioActualizacion: params.usuarioAuditoria,
      })
      .where('id = :id', {
        id: params.id,
      })
      .returning(['id', 'estado'])
      .execute();
  }

  inactivarObservacion(params: any) {
    return this.createQueryBuilder()
      .update(Observacion)
      .set({
        estado: params.estado,
        usuarioActualizacion: params.usuarioAuditoria,
      })
      .where('id = :id', {
        id: params.id,
      })
      .returning(['id', 'estado'])
      .execute();
  }

  buscarPorId(id: number) {
    return this.createQueryBuilder('o')
      .leftJoinAndSelect('o.detalle', 'de')
      .leftJoinAndSelect('o.documento', 'do')
      .leftJoinAndSelect('o.tramite', 't')
      .where('o.id = :id', { id })
      .getOne();
  }

  buscarPorIdDetalle(id: number) {
    return this.createQueryBuilder('o')
      .innerJoinAndSelect('o.detalle', 'd')
      .innerJoinAndSelect('d.tramite', 't')
      .where('d.id = :id', { id })
      .getOne();
  }

  buscarPorIdDocumento(id: number) {
    return this.createQueryBuilder('o')
      .innerJoinAndSelect('o.documento', 'd')
      .innerJoinAndSelect('d.tramite', 't')
      .where('d.id = :id', { id })
      .getOne();
  }

  buscarPorIdTramite(id: number) {
    return this.createQueryBuilder('o')
      .innerJoinAndSelect('o.tramite', 't')
      .where('o.id = :id', { id })
      .getOne();
  }

  cantidadObservacionesPorDetalle(idTramite: number) {
    return this.createQueryBuilder('o')
      .select(['count(1) as "cantidad"'])
      .innerJoin('o.detalle', 'd')
      .where('d.id_tramite = :idTramite and o.estado = :estado', {
        idTramite,
        estado: ObservacionEstado.ACTIVE,
      })
      .getRawOne();
  }

  cantidadObservacionesPorDocumento(idTramite: number) {
    return this.createQueryBuilder('o')
      .select(['count(1) as "cantidad"'])
      .innerJoin('o.documento', 'd')
      .where('d.id_tramite = :idTramite and o.estado = :estado', {
        idTramite,
        estado: ObservacionEstado.ACTIVE,
      })
      .getRawOne();
  }

  cantidadObservacionesPorTramite(idTramite: number) {
    return this.createQueryBuilder('o')
      .select(['count(1) as "cantidad"'])
      .innerJoin('o.tramite', 't')
      .where('t.id = :idTramite and o.estado = :estado', {
        idTramite,
        estado: ObservacionEstado.ACTIVE,
      })
      .getRawOne();
  }

  runTransaction(op) {
    return this.manager.transaction(op);
  }
}
