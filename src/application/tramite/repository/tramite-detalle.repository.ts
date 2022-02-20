import { EntityRepository, Repository } from 'typeorm';

import { Detalle } from '../entities/tramite/detalle.entity';

@EntityRepository(Detalle)
export class TramiteDetalleRepository extends Repository<Detalle> {
  crear(params: any) {
    // TODO: no usar any
    const data = [];
    if (params instanceof Array) {
      for (const item of params) {
        data.push({
          campo: item.campo,
          valor: item.valor,
          valorComplejo: item.valorComplejo,
          tipo: item.tipo,
          tabla: item.tabla,
          idTramite: item.idTramite,
          seccion: item.seccion,
          usuarioCreacion: item.usuarioAuditoria,
        });
      }
    } else {
      data.push({
        campo: params.campo,
        valor: params.valor,
        valorComplejo: params.valorComplejo,
        tipo: params.tipo,
        tabla: params.tabla,
        idTramite: params.idTramite,
        seccion: params.seccion,
        usuarioCreacion: params.usuarioAuditoria,
      });
    }

    return this.createQueryBuilder()
      .insert()
      .into(Detalle)
      .values(data)
      .execute();
    // .orIgnore()
  }

  actualizarValor(params: any) {
    return this.createQueryBuilder()
      .update(Detalle)
      .set({
        valor: params?.valor ?? null,
        valorComplejo: params?.valorComplejo ?? null,
        usuarioActualizacion: params.usuarioAuditoria,
      })
      .where('id = :id', { id: params.id })
      .execute();
  }

  actualizarValorPorCampoTramite(params: any) {
    return this.createQueryBuilder()
      .update(Detalle)
      .set({
        valor: params?.valor ?? null,
        valorComplejo: params?.valorComplejo ?? null,
        usuarioActualizacion: params.usuarioAuditoria,
      })
      .where('campo = :campo AND id_tramite = :idTramite', {
        campo: params.campo,
        idTramite: params.idTramite,
      })
      .execute();
  }

  buscarPorTramite(idTramite: number) {
    return this.createQueryBuilder('td')
      .select(['td.id', 'td.campo'])
      .where('td.idTramite = :idTramite', { idTramite })
      .getMany();
  }

  buscarPorCampoTramite(campo: string, idTramite: number) {
    return this.createQueryBuilder('td')
      .select(['td.id', 'td.campo', 'td.valor', 'td.valorComplejo'])
      .where('td.idTramite = :idTramite AND td.campo = :campo', {
        idTramite,
        campo,
      })
      .getOne();
  }

  buscarPorId(id: number) {
    return this.createQueryBuilder('td').where('td.id = :id', { id }).getOne();
  }

  buscarPorIdTramite(idTramite: number) {
    return this.createQueryBuilder('td')
      .select(['td.id', 'td.campo', 'td.valor'])
      .where('td.idTramite = :idTramite', { idTramite })
      .getMany();
  }
}
