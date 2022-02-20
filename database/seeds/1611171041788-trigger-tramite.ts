import { MigrationInterface, QueryRunner } from 'typeorm';

export class triggerTramite1611171041788 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SEQUENCE IF EXISTS ${process.env.DB_SCHEMA_PARAMETRICA}.sec_tramite_codigo;`);
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS ${process.env.DB_SCHEMA_PARAMETRICA}.sec_tramite_codigo;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS ${process.env.DB_SCHEMA_PARAMETRICA}.sec_publicacion_codigo;`);
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS ${process.env.DB_SCHEMA_PARAMETRICA}.sec_publicacion_codigo;`);
    await queryRunner.query(`CREATE OR REPLACE FUNCTION ${process.env.DB_SCHEMA_PARAMETRICA}.befo_create_tramite()
                                RETURNS trigger AS
                              $$
                              BEGIN
                                IF new.tipo_tramite = 2 THEN
                                  new.codigo = concat(nextval('${process.env.DB_SCHEMA_PARAMETRICA}.sec_publicacion_codigo'), '/', EXTRACT(YEAR FROM NOW()));
                                ELSE
                                  new.codigo = concat(nextval('${process.env.DB_SCHEMA_PARAMETRICA}.sec_tramite_codigo'), '/', EXTRACT(YEAR FROM NOW()));
                                END IF;
                                RETURN new;
                              END;
                              $$
                              LANGUAGE 'plpgsql';`);
    await queryRunner.query(`CREATE TRIGGER crear_codigo_tramite
                              BEFORE insert 
                              ON ${process.env.DB_SCHEMA_PARAMETRICA}.tramites
                              FOR EACH ROW
                              EXECUTE PROCEDURE ${process.env.DB_SCHEMA_PARAMETRICA}.befo_create_tramite();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
