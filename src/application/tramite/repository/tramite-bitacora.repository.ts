import { EntityRepository, Repository } from 'typeorm';

import { Bitacora } from '../entities/tramite/bitacora.entity';
import { Status } from 'src/common/constants';

@EntityRepository(Bitacora)
export class TramiteBitacoraRepository extends Repository<Bitacora> {
  crear(params: any) {
    return this.createQueryBuilder()
      .insert()
      .into(Bitacora)
      .values({
        operacion: params.operacion,
        fecha: new Date(),
        estado: Status.ACTIVE,
        idTramite: params.idTramite,
        idUsuario: params.idUsuario,
        usuarioCreacion: params.usuarioAuditoria,
      })
      .execute();
  }
}
