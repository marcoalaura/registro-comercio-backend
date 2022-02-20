import { MigrationInterface, QueryRunner } from "typeorm";
import { TramiteLiquidacion } from "src/application/tramite/entities/tramite/tramite-liquidacion.entity";
import { Tramite } from "src/application/tramite/entities/tramite/tramite.entity";
import { Status } from "src/common/constants";

export class tramiteLiquidacion1644329798691 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
          monto: 100.00,
          descripcion: 'arancel de tramite 1',
          estado: Status.ACTIVE,
          tramite: 1,
      },
      {
          monto: 150.00,
          descripcion: 'publicación en gaceta',
          estado: Status.ACTIVE,
          tramite: 1,
      },
      {
          monto: 300,
          descripcion: 'otro monto',
          estado: Status.ACTIVE,
          tramite: 2,
      },
    ];
    const tramiteLiquidaciones = items.map((item) => {
      const t = new Tramite();
      t.id = item.tramite;

      const l = new TramiteLiquidacion();
      l.fechaCreacion = new Date();
      l.usuarioCreacion = 'SEEDER';
      l.monto = item.monto;
      l.descripcion = item.descripcion;
      l.estado = item.estado;
      l.tramite = t;
      return l;
    });
    await queryRunner.manager.save(tramiteLiquidaciones);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
