import { EntityRepository, Repository } from 'typeorm';

import { Documento } from '../entities/tramite/documento.entity';
import { Status } from '../../../common/constants';

@EntityRepository(Documento)
export class TramiteDocumentoSoporteRepository extends Repository<Documento> {
  crear(params: any) {
    const data = [];
    if (params instanceof Array) {
      for (const item of params) {
        data.push({
          campo: item.campo,
          tipo: item.tipo,
          nroDocumento: item.nroDocumento,
          emisor: item.emisor,
          fechaEmision: item.fechaEmision,
          nombre: item.nombre,
          ruta: item.ruta,
          hash: item.hash,
          estado: item.estado,
          detalle: item.detalle,
          idTramite: item.idTramite,
          usuarioCreacion: item.usuarioAuditoria,
        });
      }
    } else {
      data.push({
        campo: params.campo,
        tipo: params.tipo,
        nroDocumento: params.nroDocumento,
        emisor: params.emisor,
        fechaEmision: params.fechaEmision,
        nombre: params.nombre,
        ruta: params.ruta,
        hash: params.hash,
        idTramite: params.idTramite,
        estado: params.estado,
        detalle: params.detalle,
        usuarioCreacion: params.usuarioAuditoria,
      });
    }

    return this.createQueryBuilder()
      .insert()
      .into(Documento)
      .values(data)
      .execute();
  }

  actualizar(params: any) {
    return this.createQueryBuilder()
      .update(Documento)
      .set(params)
      .where('id = :id', { id: params.id })
      .execute();
  }

  buscarPorId(id: number) {
    return this.createQueryBuilder('td').where('td.id = :id', { id }).getOne();
  }

  buscarPorTramite(idTramite: number) {
    return this.createQueryBuilder('tds')
      .select(['tds.id', 'tds.campo'])
      .where('tds.idTramite = :idTramite', { idTramite })
      .getMany();
  }

  buscarPorTramiteCampo(idTramite: number, campo: string) {
    return this.createQueryBuilder('tds')
      .select(['tds.id', 'tds.campo', 'tds.ruta'])
      .where('tds.idTramite = :idTramite', { idTramite })
      .andWhere('tds.campo = :campo', { campo })
      .getOne();
  }

  obtenerDocByTramite(idTramite: number) {
    const estado = Status.ACTIVE;
    return this.createQueryBuilder('tds')
      .select([
        'tds.id',
        'tds.nroDocumento',
        'tds.emisor',
        'tds.fechaEmision',
        'tds.detalle',
        'tds.idTramite',
        'tds.nombre',
      ])
      .where('tds.idTramite = :idTramite', { idTramite })
      .andWhere('tds.estado = :estado', { estado })
      .getOne();
  }
}
