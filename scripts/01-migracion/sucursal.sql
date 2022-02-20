create or replace procedure seprec.migrar_sucursal(in empresas RECORD, in id_empresa numeric, in id_establecimiento numeric, inout id_sucursal int)
as $$
DECLARE
estado varchar;
begin
  if rtrim(empresas.estado_matricula) = 'MA' then
    estado := 'PENDIENTE';
  else
    estado := 'CANCELADO';
  end if;
  insert into "seprec"."establecimientos" (
    fecha_creacion,
    usuario_creacion,
    fecha_actualizacion,
    usuario_actualizacion,
    accion,
    estado,
    cod_tipo_establecimiento,
    numero_establecimiento,
    id_empresa,
    id_establecimiento
  )
  values
  (
    coalesce(empresas.fecha_creacion, now()),
    empresas.autor_creacion,
    empresas.fecha_ultima_actualizacion,
    empresas.autor_ultima_actualizacion,
    'MIGRADO',
    estado,
    empresas.categoria_matricula,
    empresas.matricula_id,
    id_empresa, id_establecimiento
  )
  RETURNING id into id_sucursal;
  --  return;
end;
$$ LANGUAGE 'plpgsql';
