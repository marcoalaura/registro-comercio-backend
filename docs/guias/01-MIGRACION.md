# Guia de migracion V0.1.1 (sin verificación de registros duplicados)

## 1 Indexaciones

```sql
# Ejecutar las indexaciones respectivas dentro de la consola de base de datos.
-- roy
create index idx_matricula_id_actividades on migsrc.migsrc_emp_actividades(matricula_id);
create index idx_empresa_matricula_anterior on seprec.empresas(matricula_anterior);
create index idx_establecimiento_empresa on seprec.establecimientos(id_empresa);
create index idx_establecimiento_establecimiento on seprec.establecimientos(id_establecimiento);
-- javier
CREATE INDEX idx_matricula_id_objeto_social on migsrc.migsrc_emp_objeto(matricula_id);
CREATE INDEX idx_matricula_id_capital on migsrc.migsrc_emp_capital(matricula_id);
CREATE INDEX idx_matricula_id_informacion_financiera on  migsrc.migsrc_emp_informacion_financiera(matricula_id);
-- nestor
create index idx_matricula_id_direcciones on migsrc.migsrc_emp_direcciones(matricula_id);
create index idx_matricula_id_correos on migsrc.migsrc_emp_correos(matricula_id);
create index idx_matricula_id_telefonos on migsrc.migsrc_emp_telefonos(matricula_id);
create index idx_matricula_id_productos on migsrc.migsrc_emp_productos(matricula_id);
create index idx_matricula_id_documentos on migsrc.migsrc_emp_documentos(matricula_id);
--  juanca
create index idx_tipo_documento_naturales_juridicas on migsrc.migsrc_emp_naturales_juridicas(tipo_documento);
create index idx_numero_documento_naturales_juridicas on migsrc.migsrc_emp_naturales_juridicas(numero_documento);
create index idx_matricula_id_representantes_legales on migsrc.migsrc_emp_representantes_legales(matricula_id);
create index idx_tipo_documento_id_representantes_legales on migsrc.migsrc_emp_representantes_legales(tipo_documento_id);
create index idx_numero_documento_representantes_legales on migsrc.migsrc_emp_representantes_legales(numero_documento);
create index idx_numero_establecimiento_establecimientos on seprec.establecimientos(numero_establecimiento);
create index idx_id_personas_vinculados on seprec.vinculados(id_persona);
create index idx_id_persona_juridica_vinculados on seprec.vinculados(id_persona_juridica);
create index idx_cod_tipo_documento_personas_juridicas on seprec.personas_juridicas(cod_tipo_documento);
create index idx_numero_documento_personas_juridicas on seprec.personas_juridicas(numero_documento);
create index idx_matricula_personas_juridicas on seprec.personas_juridicas(matricula);
create index idx_fecha_actualizacion_personas_juridicas on seprec.personas_juridicas(fecha_actualizacion);
create index idx_cod_tipo_numero_documento_personas_juridicas on seprec.personas_juridicas(cod_tipo_documento, numero_documento);
create index idx_cod_tipo_numero_documento_personas on seprec.personas(tipo_documento, nro_documento);
```

## 2 Ingresar a la carpeta de scripts

```sql
cd scripts/01-migracion
```

## 3 Crear los procedimientos

```bash
migracion.sql
empresa_establecimientos.sql
empresa.sql
sucursal.sql
clasificadores.sql
actividades.sql
direcciones_contactos_productos_v2.sql
kardex_v2.sql
objeto_social.sql
capital.sql
informacion_financiera.sql
vinculos_personas_naturales_juridicas_v2.sql
```
comando ejemplo 
```bash
psql -h localhost -U postgres -W -d seprec_db -f utils.sql -f migracion.sql -f empresa_establecimientos.sql -f empresa.sql -f sucursal.sql -f clasificadores.sql -f actividades.sql -f direcciones_contactos_productos_v2.sql -f kardex_v2.sql -f objeto_social.sql -f capital.sql -f informacion_financiera.sql -f vinculos_personas_naturales_juridicas_v2.sql
```


## 4 Ingresar a la consola de base de datos y ejecutar los procedimientos almacenados en el siguiente orden

### Migrar empresas, establecimientos, clasificadores y actividades economicas

```sql
call seprec.migracion();
```

```sql
call seprec.registrar_vinculados_personas_juridicos_v2();
```

### Migrar objeto social

```sql
call seprec.migrar_objeto_social_v2();
```

### Migrar capital

```sql
call seprec.migrar_capital_v2();
```

### Migrar información financiera

```sql
call seprec.migrar_informacion_financiera_v2();
```

### Migrar direcciones, contactos y productos

```sql
CALL seprec.migrar_direcciones_contactos_productos_v2();
```

### Migrar documentos

```sql
CALL seprec.migrar_kardexs_documentos_v2();
```