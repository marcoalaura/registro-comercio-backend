-- ambito_accion NO SE ENCONTRO
-- fecha_habilitacion NO SE ENCONTRO DEFAULT = fecha_creacion
-- fecha_ultima_actualizacion EN BASE A QUE SE PUEDE MEDIR ESTO?
-- cod_tipo_unidad_economica NO SE TIENE DEFECTO AA
-- mes_cierre_gestion se puso a nullable porque hay muchos nulos MODEL
-- ultimo_anio_actualizacion se puso nullable por haber 195 casos vacios
-- cod_tipo_persona se puso nullable por 134 casos == tipo_societario_id
-- codTipoPersona se cambio de length 1 a 2 porque existen personas con tipo 10, 13

create or replace procedure seprec.migrar_empresa(in empresas RECORD, inout id_empresa integer)
as $$
DECLARE empresa RECORD;
DECLARE nit numeric;
DECLARE estado varchar;
begin
    if rtrim(empresas.estado_matricula) = 'MA' then
      estado := 'PENDIENTE';
    else
      estado := 'CANCELADO';
    end if;
    if empresas.cierre_gestion_id = 'S/N' then
      empresas.cierre_gestion_id := null;
    end if;
    if rtrim(empresas.cierre_gestion_id) = '' then
      empresas.cierre_gestion_id := null;
    end if;
    if rtrim(empresas.ultimo_ano_renovado) = '' then
      empresas.ultimo_ano_renovado := null;
    end if;
    if rtrim(empresas.tipo_societario_id) like 'S%' or rtrim(empresas.tipo_societario_id) = '' then
      empresas.tipo_societario_id := null;
    end if;
    if rtrim(empresas.tipo_id) = 'N' and seprec.isnumeric(empresas.num_id) then
      nit := empresas.num_id::numeric;
    end if;
    INSERT INTO "seprec"."empresas" (
      fecha_creacion,
      usuario_creacion,
      fecha_actualizacion,
      usuario_actualizacion,
      accion,
      estado,
      matricula,
      matricula_anterior,
      razon_social,
      sigla,
      cod_tipo_unidad_economica,
      cod_tipo_persona,
      cod_pais_origen,
      ambito_accion,
      mes_cierre_gestion,
      pagina_web,
      vigencia,
      fecha_vigencia,
      duracion_sociedad,
      cod_tipo_constitucion_acciones,
      numero_senarec,
      fecha_inscripcion,
      fecha_habilitacion,
      fecha_cancelacion,
      fecha_ultima_actualizacion,
      ultimo_anio_actualizacion,
      cod_estado_actualizacion
    )
    values   (
      coalesce(empresas.fecha_creacion, now()),
      empresas.autor_creacion,
      empresas.fecha_ultima_actualizacion,
      empresas.autor_ultima_actualizacion,
      'MIGRADO',
      estado,
      nit,
      empresas.matricula_id,
      empresas.razon_social,
      null,
      'AA',
      empresas.tipo_societario_id,
      empresas.pais_origen_id,
      null,
      empresas.cierre_gestion_id::numeric,
      empresas.pagina_web,
      empresas.vigencia,
      empresas.fecha_vigencia,
      empresas.duracion_sociedad,
      empresas.tipo_constitucion_acciones,
      empresas.senarec_id,
      empresas.fecha_creacion,
      empresas.fecha_creacion,
      empresas.fecha_cancelacion,
      empresas.fecha_renovacion,
      empresas.ultimo_ano_renovado::numeric,
      empresas.estado_actualizacion
    )
    RETURNING id into id_empresa;
    return;
end;
$$ LANGUAGE 'plpgsql';
