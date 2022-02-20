import { EntityRepository, Repository } from 'typeorm';
import { EditarTramiteSeccionDto } from '../dto/tramite-seccion.dto';

import { TramiteSeccion } from '../entities/tramite/tramite-seccion.entity';

@EntityRepository(TramiteSeccion)
export class TramiteSeccionRepository extends Repository<TramiteSeccion> {
  crear(params: any) {
    return this.createQueryBuilder()
      .insert()
      .into(TramiteSeccion)
      .values(params)
      .execute();
  }

  actualizar(params: EditarTramiteSeccionDto) {
    const { id, editado, usuarioAuditoria } = params;
    return this.createQueryBuilder()
      .update(TramiteSeccion)
      .set({
        editado,
        usuarioActualizacion: usuarioAuditoria,
      })
      .where('id = :id', { id })
      .execute();
  }

  listarPorTramite(idTramite: number) {
    return this.createQueryBuilder('ts')
      .where('ts.idTramite = :idTramite', { idTramite })
      .getMany();
  }
}
