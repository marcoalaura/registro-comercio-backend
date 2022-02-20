import { EntityRepository, Repository } from 'typeorm';

import { Kardex } from '../entities/kardex.entity';

@EntityRepository(Kardex)
export class KardexRepository extends Repository<Kardex> {
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
          codTipoActo: item.codTipoActo,
          codLibroRegistro: item.codLibroRegistro,
          numeroRegistro: item.numeroRegistro,
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
        codTipoActo: params.codTipoActo,
        codLibroRegistro: params.codLibroRegistro,
        numeroRegistro: params.numeroRegistro,
        idEstablecimiento: params.idEstablecimiento,
        usuarioCreacion: params.usuarioAuditoria,
      });
    }

    return this.createQueryBuilder()
      .insert()
      .into(Kardex)
      .values(data)
      .execute();
  }

  actualizar(params: any) {
    return this.createQueryBuilder()
      .update(Kardex)
      .set(params)
      .where('id = :id', { id: params.id })
      .execute();
  }

  buscarPorId(id: number) {
    return this.createQueryBuilder('kardex')
      .where('kardex.id = :id', { id })
      .getOne();
  }

  buscarPorIdEstablecimiento(idEstablecimiento: number) {
    return this.createQueryBuilder('kardex')
      .select([
        'kardex.id',
        'kardex.numero',
        'kardex.fechaEmision',
        'kardex.emisor',
        'kardex.numeroTramite',
        'kardex.codigosinplu',
        'kardex.numeroRegistro',
      ])
      .where('kardex.idEstablecimiento = :idEstablecimiento', {
        idEstablecimiento,
      })
      .getMany();
  }
}
