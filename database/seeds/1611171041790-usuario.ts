import { Persona } from 'src/core/usuario/entity/persona.entity';
import { Usuario } from 'src/core/usuario/entity/usuario.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { TextService } from '../../src/common/lib/text.service';
import { Status } from '../../src/common/constants';

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASS = '123';
    const pass = await TextService.encrypt(DEFAULT_PASS);
    const items = [
      {
        usuario: 'ADMINISTRADOR',
        persona: 1,
        correoElectonico: 'agepic-9270815@yopmail.com',
      },
      {
        usuario: 'ADMINISTRADOR-TECNICO',
        persona: 2,
        correoElectonico: 'agepic-1765251@yopmail.com',
      },
      {
        usuario: 'TECNICO',
        persona: 3,
        correoElectonico: 'agepic-6114767@yopmail.com',
      },
      {
        usuario: 'EMPRESARIO',
        persona: 4,
        correoElectonico: 'age1142900@monemail.fr.nf',
      },
      {
        usuario: 'VENTANILLA',
        persona: 5,
        correoElectonico: '6813600@mailinator.com',
      },
      {
        usuario: 'JURIDICO',
        persona: 6,
        correoElectonico: '3662624@mailinator.com',
      },
      {
        usuario: '5837586-1G',
        persona: 7,
        correoElectonico: '5837586-1g@yopmail.com',
      }
    ];
    const usuarios = items.map((item) => {
      const p = new Persona();
      p.id = item.persona;
      const u = new Usuario();
      u.usuario = item.usuario;
      u.correoElectronico = item.correoElectonico;
      u.contrasena = pass;
      u.fechaCreacion = new Date();
      u.estado = Status.ACTIVE;
      u.usuarioCreacion = '1';
      u.persona = p;
      return u;
    });
    await queryRunner.manager.save(usuarios);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
