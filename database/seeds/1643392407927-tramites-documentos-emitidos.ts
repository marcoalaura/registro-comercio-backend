import { MigrationInterface, QueryRunner } from "typeorm";
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import { TramiteDocumentoEmitido } from 'src/application/tramite/entities/tramite/tramite-documento-emitido.entity';
import { Status } from 'src/common/constants'

export class tramitesDocumentosEmitidos1643392407927 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'documento1',
        ruta: 'ruta1',
        usoQr: {
          cantidad: 10
        },
        estado: Status.ACTIVE,
        tramite: 1
      },
      {
        nombre: 'documento2',
        ruta: 'ruta2',
        usoQr: {
          cantidad: 8
        },
        estado: Status.ACTIVE,
        tramite: 2
      },
    ];
    const tramitesDocumentosEmitidos = items.map((item) => {
      const t = new Tramite();
      t.id = item.tramite;

      const tde = new TramiteDocumentoEmitido();
      tde.nombre = item.nombre;
      tde.ruta = item.ruta;
      tde.usoQr = item.usoQr;
      tde.estado = item.estado;
      tde.fechaCreacion = new Date();
      tde.usuarioCreacion = 'SEEDER';
      tde.tramite = t;
      return tde;
    });
    await queryRunner.manager.save(tramitesDocumentosEmitidos);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
