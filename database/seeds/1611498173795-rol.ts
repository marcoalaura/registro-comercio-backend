import { RolEnum } from 'src/core/authorization/rol.enum';
import { Rol } from '../../src/core/authorization/entity/rol.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class rol1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: RolEnum.ADMINISTRADOR,
      },
      {
        rol: RolEnum.TECNICO,
      },
      {
        rol: RolEnum.EMPRESARIO,
      },
      {
        rol: RolEnum.TECNICO_VENTANILLA,
      },
      {
        rol: RolEnum.TECNICO_JURIDICO,
      },
    ];
    const roles = items.map((item) => {
      const r = new Rol();
      r.rol = item.rol;
      return r;
    });
    await queryRunner.manager.save(roles);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
