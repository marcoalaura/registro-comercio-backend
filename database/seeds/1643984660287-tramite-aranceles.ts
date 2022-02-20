import { MigrationInterface, QueryRunner } from "typeorm";
import { Arancel } from "src/application/tramite/entities/parametricas/arancel.entity";
import { Parametrica } from "src/application/tramite/entities/parametricas/parametrica.entity";

export class tramiteAranceles1643984660287 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        codigoTipoSocietario: '01',
        monto: 100.80,
        tipo: 'tipo 1',
        catalogoTramite: 2,
        funcionDependiente: null,
      },
      {
        codigoTipoSocietario: '02',
        monto: 200.50,
        tipo: 'tipo 1',
        catalogoTramite: 2,
        funcionDependiente: null,
      },
      {
        codigoTipoSocietario: null,
        monto: 300.20,
        tipo: 'publicacion',
        catalogoTramite: 2,
        funcionDependiente: 'dependedeDireccion',
      },
    ];
    const tramiteAranceles = items.map((item) => {
      const p = new Parametrica();
      p.id = item.catalogoTramite;

      const a = new Arancel();
      a.fechaCreacion = new Date();
      a.usuarioCreacion = 'SEEDER';
      a.codigoTipoSocietario = item.codigoTipoSocietario;
      a.monto = item.monto;
      a.tipo = item.tipo;
      a.funcionDependiente = item.funcionDependiente;
      a.catalogoTramite = p;
      return a;
    });
    await queryRunner.manager.save(tramiteAranceles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
