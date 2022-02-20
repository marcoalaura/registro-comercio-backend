import { MigrationInterface, QueryRunner } from "typeorm";
import { Observacion } from 'src/application/tramite/entities/tramite/observacion.entity';
import { ObservacionEstado } from 'src/common/constants'
import { Detalle } from "src/application/tramite/entities/tramite/detalle.entity";
import { Documento } from "src/application/tramite/entities/tramite/documento.entity";
import { Tramite } from "src/application/tramite/entities/tramite/tramite.entity";

export class tramitesObservaciones1643492407927 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        observacion: 'El dato coindignado no coincide con las coordenadas correspondientes a la ubicación georeferenciada  1',
        sugerencia: 'sugerencia 1',
        valorObservado: 'La Paz',
        detalle: 1,
      },
      {
        observacion: 'El dato coindignado no coincide con las coordenadas correspondientes a la ubicación georeferenciada  2',
        sugerencia: 'sugerencia 2',
        valorObservado: 'Murillo',
        detalle: 2,
      },
      {
        observacion: 'El dato coindignado no coincide con las coordenadas correspondientes a la ubicación georeferenciada  3',
        sugerencia: 'sugerencia 3',
        valorObservado: 'La Paz',
        detalle: 3,
      },
    ];
    let tramitesObservaciones = items.map((item) => {
      const d = new Detalle();
      d.id = item.detalle;

      const o = new Observacion();
      o.estado = ObservacionEstado.ACTIVE,
      o.observacion = item.observacion;
      o.valorObservado = item.valorObservado;
      o.fechaCreacion = new Date();
      o.usuarioCreacion = 'SEEDER';
      o.detalle = d;
      return o;
    });
    await queryRunner.manager.save(tramitesObservaciones);

    const itemss = [
      {
        observacion: 'El documento coindignado no coincide con las coordenadas correspondientes a la ubicación georeferenciada  1',
        valorObservado: 'CI',
        documento: 1,
      },
      {
        observacion: 'El documento coindignado no coincide con las coordenadas correspondientes a la ubicación georeferenciada  2',
        valorObservado: 'Certificado de nacimiento',
        documento: 2,
      },
    ];
    tramitesObservaciones = itemss.map((item) => {
      const d = new Documento();
      d.id = item.documento;

      const o = new Observacion();
      o.estado = ObservacionEstado.ACTIVE,
      o.observacion = item.observacion;
      o.valorObservado = item.valorObservado;
      o.fechaCreacion = new Date();
      o.usuarioCreacion = 'SEEDER';
      o.documento = d;
      return o;
    });
    await queryRunner.manager.save(tramitesObservaciones);

    const itemsss = [
      {
        observacion: 'Observción del documento en general  1',
        tramite: 9,
      },
      {
        observacion: 'Observción del documento en general  2',
        tramite: 9,
      },
    ];
    tramitesObservaciones = itemsss.map((item) => {
      const t = new Tramite();
      t.id = item.tramite;

      const o = new Observacion();
      o.estado = ObservacionEstado.ACTIVE,
      o.observacion = item.observacion;
      o.fechaCreacion = new Date();
      o.usuarioCreacion = 'SEEDER';
      o.tramite = t;
      return o;
    });
    await queryRunner.manager.save(tramitesObservaciones);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
