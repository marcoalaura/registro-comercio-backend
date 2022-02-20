import { MigrationInterface, QueryRunner } from "typeorm";
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import { Bitacora } from 'src/application/tramite/entities/tramite/bitacora.entity';
import { Usuario } from 'src/core/usuario/entity/usuario.entity';
import { Status } from 'src/common/constants'

export class bitacoras1643292407926 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        operacion: 'Envio',
        estado: Status.ACTIVE,
        tramite: 3,
        usuario: 4,
        fecha: new Date(),
      },
      {
        operacion: 'Derivación',
        estado: Status.ACTIVE,
        tramite: 3,
        usuario: 5,
        fecha: new Date((new Date()).getTime() + 24 * 60 * 60 * 1000),
      },
      {
        operacion: 'Aprobación',
        estado: Status.ACTIVE,
        tramite: 3,
        usuario: 6,
        fecha: new Date((new Date()).getTime() + 48 * 60 * 60 * 1000),
      },
      {
        operacion: 'Derivación',
        estado: Status.ACTIVE,
        tramite: 3,
        usuario: 6,
        fecha: new Date((new Date()).getTime() + 64 * 60 * 60 * 1000),
      },
      {
        operacion: 'En espera',
        estado: Status.ACTIVE,
        tramite: 3,
        usuario: 4,
        fecha: new Date((new Date()).getTime() + 80 * 60 * 60 * 1000),
      },
      {
        operacion: 'Envio',
        estado: Status.ACTIVE,
        tramite: 5,
        usuario: 4,
        fecha: new Date(),
      },
    ];
    const bitacoras = items.map((item) => {
      const t = new Tramite();
      t.id = item.tramite;

      const u = new Usuario();
      u.id = item.usuario;

      const b = new Bitacora();
      b.operacion = item.operacion;
      b.fechaCreacion = item.fecha;
      b.fecha = item.fecha;
      b.usuarioCreacion = 'SEEDER';
      b.estado = item.estado;
      b.usuario = u;
      b.tramite = t;
      return b;
    });
    await queryRunner.manager.save(bitacoras);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
