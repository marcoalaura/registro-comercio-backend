create or replace procedure seprec.buscar_clasificador(in wcod_tabla varchar, in wcod_cla varchar, inout resultado boolean)
as $$
DECLARE
clasificador numeric;
begin
  select count(*) into clasificador from "seprec"."clasificadores" where "seprec"."clasificadores"."codigo" = wcod_tabla and "seprec"."clasificadores"."tipo" = wcod_cla;
  if clasificador > 0 then
    resultado := TRUE;
  else
    resultado := FALSE;
  end if;
  return;
end;
$$ LANGUAGE 'plpgsql';

create or replace procedure seprec.migrar_clasificadores()
as $$
DECLARE
clasificadores RECORD;
migrado numeric;
clasificador boolean;
clasificadores_ba numeric;
begin
  raise notice 'Migrando clasificadores';
  for clasificadores in select * from "migsrc"."migsrc_emp_clasificadores" where wcod_cla = 'C11' loop
    call seprec.buscar_clasificador(clasificadores.wcod_tabla, 'CAEB', clasificador);
    if clasificador then
      CONTINUE;
    end if;
    INSERT INTO seprec.clasificadores (
      fecha_creacion,
      usuario_creacion,
      accion,estado,
      tipo,
      codigo,
      descripcion
    )
    VALUES (
      now(),
      '1',
      'MIGRADO',
      'ACTIVO',
      'CAEB',
      clasificadores.wcod_tabla,
      clasificadores.wnombre
    );
  end loop;
  for clasificadores in select * from "migsrc"."migsrc_emp_clasificadores" where wcod_cla = 'C12' loop
    call seprec.buscar_clasificador(clasificadores.wcod_tabla, 'CIIU', clasificador);
    if clasificador then
      CONTINUE;
    end if;
    INSERT INTO seprec.clasificadores (
      fecha_creacion,
      usuario_creacion,
      accion,
      estado,
      tipo,
      codigo,
      descripcion
    )
    VALUES (
      now(),
      '1',
      'MIGRADO',
      'ACTIVO',
      'CIIU',
      clasificadores.wcod_tabla,
      clasificadores.wnombre
    );
  end loop;
  select count(*) into migrado from "seprec"."clasificadores";
  select count(*) into clasificadores_ba from "migsrc"."migsrc_emp_clasificadores" where wcod_cla = 'C11' or wcod_cla = 'C12';
  if migrado != clasificadores_ba then
    raise notice 'ERROR clasificadores migrados incorrectamente';
    return;
  else
    raise notice 'migrado %', migrado;
    raise notice 'Clasificadores migrados correctamente';
  end if;
end;
$$ LANGUAGE 'plpgsql';

--  select seprec.migrar_clasificadores();


