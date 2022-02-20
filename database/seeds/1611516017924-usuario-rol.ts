import { Usuario } from 'src/core/usuario/entity/usuario.entity';
// import { TextService } from 'src/common/lib/text.service';
import { Rol } from 'src/core/authorization/entity/rol.entity';
import { UsuarioRol } from 'src/core/authorization/entity/usuario-rol.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: 3,
        usuario: 1,
      },
      {
        rol: 1,
        usuario: 2
      },
      {
        rol: 2,
        usuario: 2,
      },
      {
        rol: 2,
        usuario: 3,
      },
      {
        rol: 3,
        usuario: 4,
      },
      {
        rol: 4,
        usuario: 5,
      },
      {
        rol: 5,
        usuario: 6,
      },
      {
        rol: 5,
        usuario: 7,
      },
    ];
    const usuarioRol = items.map((item) => {
      const r = new Rol();
      r.id = item.rol;

      const u = new Usuario();
      u.id = item.usuario;

      const ur = new UsuarioRol();
      ur.usuarioCreacion = '1';
      ur.rol = r;
      ur.usuario = u;
      return ur;
    });
    await queryRunner.manager.save(usuarioRol);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
