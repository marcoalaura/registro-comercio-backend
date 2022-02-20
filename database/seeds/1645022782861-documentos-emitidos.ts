import { MigrationInterface, QueryRunner } from "typeorm";
import { Parametrica } from 'src/application/tramite/entities/parametricas/parametrica.entity';
import { DocumentoEmitido } from 'src/application/tramite/entities/parametricas/documento-emitido.entity';
import { Status } from 'src/common/constants'

export class documentosEmitidos1645022782861 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'Matrícula de Comercio',
        tipo: '01',
        usoQr: {
          cantidad: 1
        },
        plantilla: 'matricula',
        estado: Status.ACTIVE,
        catalogoTramite: 1
      },
      {
        nombre: 'Atualizacion Matricula Comercio',
        tipo: '01',
        usoQr: {
          cantidad: 1
        },
        plantilla: 'matricula',
        estado: Status.ACTIVE,
        catalogoTramite: 2
      },
      {
        nombre: 'Certificado de Registro de Testimonio de Constitución de Sociedad',
        tipo: '03',
        usoQr: {
          cantidad: 1
        },
        plantilla: 'testimonioConstitucion',
        estado: Status.ACTIVE,
        catalogoTramite: 1
      },
    ];
    const tramitesDocumentosEmitidos = items.map((item) => {
      const t = new Parametrica();
      t.id = item.catalogoTramite;

      const tde = new DocumentoEmitido();
      tde.nombre = item.nombre;
      tde.tipo = item.tipo;
      tde.usoQr = item.usoQr;
      tde.plantilla = item.plantilla;
      tde.estado = item.estado;
      tde.fechaCreacion = new Date();
      tde.usuarioCreacion = 'SEEDER';
      tde.catalogoTramite = t;
      return tde;
    });
    await queryRunner.manager.save(tramitesDocumentosEmitidos);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
