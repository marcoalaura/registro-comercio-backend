import { MigrationInterface, QueryRunner } from "typeorm";
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import { Detalle } from 'src/application/tramite/entities/tramite/detalle.entity';

export class tramitesDetalles1643492407926 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        campo: 'tipo_unidad_economica',
        valor: 'Unipersonal',
        tipo: 'string',
        tabla: 'test',
        tramite: 9
      },
      {
        campo: 'objeto_social',
        valor: 'Compra y venta',
        tipo: 'string',
        tabla: 'test',
        tramite: 9
      },
      {
        campo: 'tipo_documento',
        valor: 'CI',
        tipo: 'string',
        tabla: 'test',
        tramite: 9
      },
      {
        campo: 'manzana',
        valor: 'manzana1',
        tipo: 'string',
        tabla: 'direcciones',
        tramite: 9
      },
      {
        campo: 'numero_domicilio',
        valor: '315',
        tipo: 'string',
        tabla: 'direcciones',
        tramite: 9
      },
    ];
    const tramitesDetalles = items.map((item) => {
      const t = new Tramite();
      t.id = item.tramite;

      const d = new Detalle();
      d.campo = item.campo;
      d.valor = item.valor;
      d.tabla = item.tabla;
      d.tipo = item.tipo;
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
