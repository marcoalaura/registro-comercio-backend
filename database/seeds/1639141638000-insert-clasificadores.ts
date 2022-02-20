import { MigrationInterface, QueryRunner } from 'typeorm';
const csv = require('csv-parser');
const fs = require('fs');

export class insertClasificadores1639141638000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const contenido = fs.createReadStream('./files/clasificadores.csv').pipe(csv());

    console.log('Se procede a crear los parametros...');

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
    console.log('Agregando parametros');

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('parametros')
      .values(parametros)
      .execute();
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
