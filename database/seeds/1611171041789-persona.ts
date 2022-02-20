import {Genero} from 'src/common/constants';
import { Persona } from 'src/core/usuario/entity/persona.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class usuario1611171041789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        usuarioCreacion: '1',
        nombres: 'JUAN',
        primerApellido: 'PEREZ',
        segundoApellido: 'PEREZ',
        nroDocumento: '6098567',
        fechaNacimiento: '2002-02-09',
        genero: Genero.M,
      },
      {
        usuarioCreacion: '1',
        nombres: 'MARIA',
        primerApellido: 'PEREZ',
        segundoApellido: 'PEREZ',
        nroDocumento: '1765251',
        fechaNacimiento: '2002-02-09',
        genero: Genero.F,
      },
      {
        usuarioCreacion: '1',
        nombres: 'PEDRO',
        primerApellido: 'PEREZ',
        segundoApellido: 'PEREZ',
        nroDocumento: '6114767',
        fechaNacimiento: '2002-02-09',
        genero: Genero.M,
      },
      {
        usuarioCreacion: '1',
        nombres: 'JOSE',
        primerApellido: 'LOPEZ',
        segundoApellido: 'PECHO',
        nroDocumento: '1142900',
        fechaNacimiento: '1985-03-23',
        genero: Genero.M,
      },
      {
        usuarioCreacion: '1',
        nombres: 'MABEL',
        primerApellido: 'CHIRI',
        segundoApellido: 'NINA',
        nroDocumento: '6813600-1L',
        fechaNacimiento: '1975-05-20',
        genero: Genero.F,
      },
      {
        usuarioCreacion: '1',
        nombres: 'VLADIMIR',
        primerApellido: 'YUCRA',
        segundoApellido: 'GUTIERREZ',
        nroDocumento: '3662624',
        fechaNacimiento: '1995-01-03',
        genero: Genero.M,
      },
      {
        usuarioCreacion: '1',
        nombres: 'CAROLINA',
        primerApellido: 'BRESCIANI',
        nroDocumento: '5837586-1G',
        fechaNacimiento: '1987-04-12',
        Genero: Genero.F,
      },
    ];
    const personas = items.map((item) => {
      const p = new Persona();
      p.nombres = item.nombres;
      p.primerApellido = item.primerApellido;
      p.segundoApellido = item.segundoApellido;
      p.tipoDocumento = 'CI';
      p.nroDocumento = item.nroDocumento;
      p.fechaNacimiento = item.fechaNacimiento;
      p.genero = item.genero;
      p.usuarioCreacion = item.usuarioCreacion;
      return p;
    });
    await queryRunner.manager.save(personas);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
