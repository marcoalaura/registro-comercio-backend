import { MigrationInterface, QueryRunner } from "typeorm";
import { Arancel } from "src/application/tramite/entities/parametricas/arancel.entity";
import { Parametrica } from "src/application/tramite/entities/parametricas/parametrica.entity";

export class publicacionesAranceles1644430972783 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
              monto: 192,
              catalogoTramite: 1001,
            },
            {
              monto: 192,
              catalogoTramite: 1002,
            },
            {
              monto: 192,
              catalogoTramite: 1003,
            },
            {
              monto: 192,
              catalogoTramite: 1004,
            },
            {
              monto: 192,
              catalogoTramite: 1005,
            },
            {
              monto: 192,
              catalogoTramite: 1006,
            },
            {
              monto: 192,
              catalogoTramite: 1007,
            },
            {
              monto: 192,
              catalogoTramite: 1008,
            },
            {
              monto: 192,
              catalogoTramite: 1009,
            },
            {
              monto: 192,
              catalogoTramite: 1010,
            },
            {
              monto: 192,
              catalogoTramite: 1011,
            },
            {
              monto: 192,
              catalogoTramite: 1012,
            },
            {
              monto: 192,
              catalogoTramite: 1013,
            },
            // convocatorias y avisos
            {
              monto: 20,
              catalogoTramite: 1014,
            },
            {
              monto: 20,
              catalogoTramite: 1015,
            },
            {
              monto: 71,
              catalogoTramite: 1016,
            },
            {
              monto: 71,
              catalogoTramite: 1017,
            },
            {
              monto: 71,
              catalogoTramite: 1018,
            },
            {
              monto: 71,
              catalogoTramite: 1019,
            },
            {
              monto: 71,
              catalogoTramite: 1020,
            },
            /* {
              monto: 71,
              catalogoTramite: 1021,
            },
            {
              monto: 71,
              catalogoTramite: 1022,
            },
            {
              monto: 71,
              catalogoTramite: 1023,
            },
            {
              monto: 71,
              catalogoTramite: 1024,
            },
            {
              monto: 71,
              catalogoTramite: 1025,
            },
            {
              monto: 71,
              catalogoTramite: 1026,
            }, */
            {
              monto: 71,
              catalogoTramite: 1027,
            },
            // memorias
            {
              monto: 1500,
              catalogoTramite: 1028,
            },
            // balances
            {
              monto: 260,
              catalogoTramite: 1029,
            },
          ];
          const tramiteAranceles = items.map((item) => {
            const p = new Parametrica();
            p.id = item.catalogoTramite;
      
            const a = new Arancel();
            a.fechaCreacion = new Date();
            a.usuarioCreacion = 'SEEDER';
            a.monto = item.monto;
            a.tipo = 'tipo 1';
            a.catalogoTramite = p;
            return a;
          });
          await queryRunner.manager.save(tramiteAranceles);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
