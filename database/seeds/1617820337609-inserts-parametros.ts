import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertsParametros1617820337609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TIPO DOCUMENTO
    const parametros = [
      {
        codigo: 'TD-CI',
        nombre: 'Cédula de identidad',
        grupo: 'TD',
        descripcion: 'Cédula de Identidad',
      },
      {
        codigo: 'TD-CIE',
        nombre: 'Cédula de identidad de extranjero',
        grupo: 'TD',
        descripcion: 'Cédula de identidad de extranjero',
      },
      // APPS
      {
        codigo: 'TAPP-B',
        nombre: 'Backend',
        grupo: 'TAPP',
        descripcion: 'Backend',
      },
      {
        codigo: 'TAPP-F',
        nombre: 'Frontend',
        grupo: 'TAPP',
        descripcion: 'Frontend',
      },
      // ACCIONES
      // FRONTEND
      {
        codigo: 'TACCF-R',
        nombre: 'read',
        grupo: 'TACCF',
        descripcion: 'READ',
      },
      {
        codigo: 'TACCF-U',
        nombre: 'update',
        grupo: 'TACCF',
        descripcion: 'UPDATE',
      },
      {
        codigo: 'TACCF-C',
        nombre: 'create',
        grupo: 'TACCF',
        descripcion: 'CREATE',
      },
      {
        codigo: 'TACCF-D',
        nombre: 'delete',
        grupo: 'TACCF',
        descripcion: 'DELETE',
      },
      // BACKEND
      {
        codigo: 'TACCB-G',
        nombre: 'GET',
        grupo: 'TACCB',
        descripcion: 'GET',
      },
      {
        codigo: 'TACCB-U',
        nombre: 'UPDATE',
        grupo: 'TACCB',
        descripcion: 'UPDATE',
      },
      {
        codigo: 'TACCF-P',
        nombre: 'PATCH',
        grupo: 'TACC',
        descripcion: 'PATCH',
      },
      {
        codigo: 'TACCB-C',
        nombre: 'POST',
        grupo: 'TACCB',
        descripcion: 'POST',
      },
      {
        codigo: 'TACCB-D',
        nombre: 'DELETE',
        grupo: 'TACCB',
        descripcion: 'DELETE',
      },
    ];
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
