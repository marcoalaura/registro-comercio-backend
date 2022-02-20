import { MigrationInterface, QueryRunner } from 'typeorm';

export class parametricaTipoRazonSocial1644933259118 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Agregar parametros adicionales...');

    const parametros = [
      {
        codigo: '0',
        nombre: 'Nombre propio de propietario',
        grupo: 'CA200_tipo_razon_social',
        descripcion: 'Nombre propio de propietario',
      },
      {
        codigo: '1',
        nombre: 'Nombre de fantasía',
        grupo: 'CA200_tipo_razon_social',
        descripcion: 'Nombre de fantasía',
      },
    ];
    
    console.log(parametros.length);
    console.log('Agregando parametros...');

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
