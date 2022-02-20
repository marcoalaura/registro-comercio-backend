import { EntityRepository, Repository } from 'typeorm';

import { Documento } from '../entities/documento.entity';

@EntityRepository(Documento)
export class DocumentoSoporteRepository extends Repository<Documento> {
  crear(params: any) {
    const data = [];
    if (params instanceof Array) {
      for (const item of params) {
        data.push({
          codTipoDocumento: item.codTipoDocumento,
          numero: item.numero,
          codigoSinplu: item.codigoSinplu,
          emisor: item.emisor,
          fechaEmision: item.fechaEmision,
          codMunicipio: item.codMunicipio,
          numeroTramite: item.numeroTramite,
          idEstablecimiento: item.idEstablecimiento,
          usuarioCreacion: item.usuarioAuditoria,
        });
      }
    } else {
      data.push({
        codTipoDocumento: params.codTipoDocumento,
        numero: params.numero,
        codigoSinplu: params.codigoSinplu,
        emisor: params.emisor,
        fechaEmision: params.fechaEmision,
        codMunicipio: params.codMunicipio,
        numeroTramite: params.numeroTramite,
        idEstablecimiento: params.idEstablecimiento,
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
    return this.createQueryBuilder('documento')
      .where('documento.id = :id', { id })
      .getOne();
  }

  buscarPorIdEstablecimiento(idEstablecimiento: number) {
    return this.createQueryBuilder('documento')
      .select([
        'documento.id',
        'documento.numero',
        'documento.fechaEmision',
        'documento.emisor',
        'documento.numeroTramite',
      ])
      .where('documento.idEstablecimiento = :idEstablecimiento', {
        idEstablecimiento,
      })
      .getMany();
  }
}
