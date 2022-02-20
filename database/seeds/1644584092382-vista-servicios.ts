import { MigrationInterface, QueryRunner } from 'typeorm';

export class vistaServicios1644584092382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE VIEW ${process.env.DB_SCHEMA_EMPRESA}.vista_servicios 
      AS SELECT
      -- empresa
      em.id AS emp_id,
      em.matricula AS emp_matricula,
      em.razon_social AS emp_razon_social,
      em.cod_tipo_unidad_economica as emp_cod_tipo_unidad_economica,
      em.fecha_inscripcion AS emp_fecha_inscripcion,
      em.fecha_ultima_actualizacion AS emp_fecha_ultima_actualizacion,
      em.ultimo_anio_actualizacion AS emp_ultimo_anio_actualizacion,
      em.nit AS emp_nit,
      em.cod_estado_actualizacion AS emp_cod_estado_actualizacion,
      em.estado AS emp_estado,
      -- establecimientos
      es.id AS est_id,
      es.nombre_establecimiento AS est_nombre_establecimiento,
      es.cod_tipo_establecimiento AS est_tipo_establecimiento,
      es.id_establecimiento AS est_id_establecimiento,
      -- direcciones
      d.cod_departamento AS dir_cod_departamento,
      d.cod_provincia AS dir_cod_provincia,
      d.cod_municipio AS dir_cod_municipio,
      d.nombre_via AS dir_nombre_via,
      d.numero_domicilio AS dir_numero_domicilio,
      d.nombre_subdivision_geografica as dir_nombre_subdivision_geografica,
      d.uv AS dir_uv,
      d.manzana AS dir_manzana,
      d.edificio AS dir_edificio,
      d.numero_nombre_ambiente AS dir_numero_nombre_ambiente,
      d.piso AS dir_piso,
      d.direccion_referencial AS dir_direccion_referencial,
      -- actividades economicas
      ae.cod_actividad AS act_cod_actividad,
      -- vinculados
      v.id AS vin_id,
      v.fecha_vinculacion AS vin_fecha_vinculacion,
      v.cod_tipo_vinculo AS vin_cod_tipo_vinculo,
      v.registro_designacion AS vin_registro_designacion,
      v.cod_libro_designacion AS vin_cod_libro_designacion,
      -- personas
      p.nombre_completo AS per_nombre_completo,
      -- personas juridicas
      pj.id AS pju_id,
      pj.numero_documento AS pju_numero_documento,
      pj.cod_tipo_documento AS pju_cod_tipo_documento,
      -- contactos
      c.tipo_contacto AS con_tipo_contacto,
      c.descripcion AS con_descripcion
      
      FROM ${process.env.DB_SCHEMA_EMPRESA}.empresas em
      
      LEFT JOIN ${process.env.DB_SCHEMA_EMPRESA}.establecimientos es
      on es.id_empresa = em.id
      
      LEFT JOIN ${process.env.DB_SCHEMA_EMPRESA}.vinculados v
      on v.id_establecimiento = es.id
      
      LEFT JOIN ${process.env.DB_SCHEMA_EMPRESA}.personas_juridicas pj
      on v.id_persona_juridica = pj.id
      
      LEFT JOIN ${process.env.DB_SCHEMA_EMPRESA}.personas p
      on v.id_persona = p.id
      
      LEFT JOIN ${process.env.DB_SCHEMA_EMPRESA}.direcciones d
      on es.id = d.id_establecimiento

      LEFT JOIN ${process.env.DB_SCHEMA_EMPRESA}.contactos c
      on es.id = c.id_establecimiento
      
      LEFT JOIN ${process.env.DB_SCHEMA_EMPRESA}.actividades_economicas ae
      on es.id = ae.id_establecimiento
    `);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
