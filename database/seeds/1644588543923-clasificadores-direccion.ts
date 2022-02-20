import { MigrationInterface, QueryRunner } from 'typeorm';
const csv = require('csv-parser');
const fs = require('fs');

export class clasificadoresDireccion1644588543923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const contenido = fs.createReadStream('./files/clasificadores_v2.csv').pipe(csv());

    console.log('Se procede a crear los parametros para direcciones...');

    const parametros = [];

    for await (const row of contenido) {
      parametros.push(  
        {
          codigo: row.codigo,
          nombre: row.nombre,
          grupo: row.grupo,
          descripcion: row.descripcion,
        },
      );
    }

    console.log(parametros.length);
    console.log('Agregando parametros para direcciones');

    await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('parametros')
        .values(parametros)
        .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
