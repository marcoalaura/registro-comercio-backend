import { MigrationInterface, QueryRunner } from 'typeorm';

export class vistaMEmpresaHomonimia1645021317712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
         CREATE MATERIALIZED VIEW ${process.env.DB_SCHEMA_EMPRESA}.v_empresas_homonimia
         AS
         select e.id, e.razon_social, o.objeto_social, ae.cod_actividad actividad_economica, e.estado  from ${process.env.DB_SCHEMA_EMPRESA}.empresas e
         inner join ${process.env.DB_SCHEMA_EMPRESA}.objetos_sociales o on o.id_empresa = e.id and o.estado in ('ACTIVO', 'PENDIENTE')
         inner join ${process.env.DB_SCHEMA_EMPRESA}.establecimientos es on e.id = es.id_empresa and es.id_establecimiento is null and es.estado in ('ACTIVO', 'PENDIENTE')
         inner join ${process.env.DB_SCHEMA_EMPRESA}.actividades_economicas ae on es.id = ae.id_establecimiento and ae.estado in ('ACTIVO', 'PENDIENTE')
         where e.estado in ('ACTIVO', 'PENDIENTE')
         WITH DATA;
      `);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
