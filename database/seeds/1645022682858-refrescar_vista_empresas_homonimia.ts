import { MigrationInterface, QueryRunner } from 'typeorm';

export class refrescarVistaEmpresasHomonimia1645022682858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE OR REPLACE FUNCTION refrescar_vista_empresas_homonimia()
          RETURNS text
            LANGUAGE plpgsql
          AS $function$
          BEGIN
            REFRESH MATERIALIZED VIEW ${process.env.DB_SCHEMA_EMPRESA}.v_empresas_homonimia;
            RETURN 'Ok';
          END
          $function$;
   `);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
