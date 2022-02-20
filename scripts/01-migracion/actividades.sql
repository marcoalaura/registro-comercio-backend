-- cod_gran_actividad mapear con ...
-- cod_tipo_actividad mapear con ...
-- cod_tipo_clasificador mapear con ... // por le momento CAEB, CIIU

create or replace procedure seprec.migrar_actividades_economicas(in id_establecimiento numeric, in matricula varchar, inout actividad_id numeric)
as $$
declare
actividad RECORD;
tipo varchar;
actividad_id numeric;
codigo varchar;
begin
  select * into actividad from "migsrc"."migsrc_emp_actividades" where "migsrc"."migsrc_emp_actividades"."matricula_id" = matricula;
  if actividad.matricula_id is null then
    raise notice 'no existe %', matricula;
    actividad_id := 0;
    return;
  end if;
  if rtrim(actividad.ciiu) != '' then
    tipo := 'CIIU';
    codigo := actividad.ciiu;
  end if;
  if rtrim(actividad.caeb) != '' then
    tipo := 'CAEB';
    codigo := actividad.caeb;
  end if;
  INSERT INTO seprec.actividades_economicas (
    fecha_creacion,
    usuario_creacion,
    accion,
    estado,
    cod_tipo_clasificador,
    cod_actividad,
    id_establecimiento
  )
  VALUES (
    now(),
    '1',
    'MIGRADO',
    'PENDIENTE',
    tipo,
    codigo,
    id_establecimiento
  ) returning id into actividad_id;
end;
$$ LANGUAGE 'plpgsql';

create or replace procedure seprec.iterar_establecimientos_actividades()
as $$
declare
establecimientos RECORD;
actividad_id numeric;
contador integer;
tiempo timestamptz;
begin
  contador := 0;
  tiempo := now();
  raise notice 'Fecha Inicio %', tiempo;
  for establecimientos in select id, numero_establecimiento from seprec.establecimientos loop
    call seprec.migrar_actividades_economicas(establecimientos.id, establecimientos.numero_establecimiento, actividad_id);
    contador := contador + 1;
    if contador = 10000 then
      COMMIT;
      contador := 0;
    end if;
    raise notice 'actividad_id %', actividad_id;
  end loop;
  COMMIT;
  raise notice 'Fecha Fin %', now() - tiempo;
end;
$$ LANGUAGE 'plpgsql';

--  call seprec.iterar_establecimientos_actividades();
