import { MigrationInterface, QueryRunner } from "typeorm";
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import { Documento } from 'src/application/tramite/entities/tramite/documento.entity';
import { Status } from 'src/common/constants'

export class tramitesDocumentosSoportes1643492407924 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        campo: 'certificado',
        nombre: 'CI',
        hash: '1111',
        nroDocumento: '123',
        ruta: 'CI/CI',
        rutaKardex: 'ruta1',
        estado: Status.ACTIVE,
        tramite: 9
      },
      {
        campo: 'certificado2',
        nombre: 'CN',
        hash: '2222',
        nroDocumento: '456',
        ruta: 'Cn/CCN',
        rutaKardex: 'ruta2',
        estado: Status.ACTIVE,
        tramite: 9
      },
    ];
    const tramitesDetalles = items.map((item) => {
      const t = new Tramite();
      t.id = item.tramite;

      const d = new Documento();
      d.campo = item.campo;
      d.nombre = item.nombre;
      d.emisor = 'seeder',
      d.tipo = 'pdf',
      d.fechaEmision = new Date();
      d.hash = item.hash;
      d.nroDocumento = item.nroDocumento;
      d.ruta = item.ruta;
      d.estado = item.estado;
      d.rutaKardex = item.rutaKardex;
      d.fechaCreacion = new Date();
      d.usuarioCreacion = 'SEEDER';
      d.tramite = t;
      return d;
    });
    await queryRunner.manager.save(tramitesDetalles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
