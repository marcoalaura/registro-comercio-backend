create or replace procedure seprec.empresa_establecimientos()
as $$
declare
empresas RECORD;
empresa RECORD; 
id_empresa int; 
id_sucursal_principal int;
id_sucursal_secundario int;
sucursal RECORD; 
contador integer;
tiempo timestamptz;
begin
  contador := 0;
  tiempo := now();
  raise notice 'Fecha Inicio %', tiempo;
    for empresas in
      ((select * from "migsrc"."migsrc_empresas_sucursales" where rtrim(matricula_ppal) = '')
      UNION ALL
      (select * from "migsrc"."migsrc_empresas_sucursales" where matricula_ppal not like 'S%' and rtrim(matricula_ppal) != '')
      UNION ALL
      (select * from "migsrc"."migsrc_empresas_sucursales" where matricula_ppal like 'S%' and rtrim(matricula_ppal) != '')) loop
    contador := contador + 1;
    raise notice 'matricula ==> %', empresas.matricula_id;
    -- migracion de empresas
    if rtrim(empresas.categoria_matricula) != '' and empresas.categoria_matricula::numeric = 1 or empresas.matricula_id in ('00001359', '00049916', '00212579') then -- in porque matricula_idy matricula_ppal son iguales
      call seprec.migrar_empresa(empresas, id_empresa);
      -- migracion sucursal principal
      call seprec.migrar_sucursal(empresas, id_empresa, null, id_sucursal_principal);
    else
      -- migracion sucursales
      if empresas.matricula_ppal is not null and rtrim(empresas.matricula_ppal) != '' then
        select * into empresa from "seprec"."empresas" where "seprec"."empresas"."matricula_anterior" = empresas.matricula_ppal;
        if empresa.id is null then
          raise notice 'no EXISTE LA EMPRESA %', empresas.matricula_id;
          CONTINUE;
        end if;
        select * into sucursal from "seprec"."establecimientos" where "seprec"."establecimientos"."id_empresa" = empresa.id and "seprec"."establecimientos"."id_establecimiento" is null;
        call seprec.migrar_sucursal(empresas, sucursal.id_empresa, sucursal.id::numeric, id_sucursal_secundario);
      else
        raise notice 'error  este no hay %', empresas.matricula_id;
        -- sucursales sin padre S0008214, S0000172, S0002442
      end if;
    end if;
    if contador = 10000 then
      COMMIT;
      contador := 0;
    end if;
  end loop;
  COMMIT;
  raise notice 'Fecha Fin %', now() - tiempo;
end;
$$ LANGUAGE 'plpgsql';
