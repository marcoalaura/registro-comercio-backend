create or replace procedure seprec.migracion()
as $$
declare
tiempo timestamptz;
begin
  tiempo := now();
  raise notice 'FECHA INICIO MIGRACION %', tiempo;
  call seprec.empresa_establecimientos();
  call seprec.migrar_clasificadores();
  call seprec.iterar_establecimientos_actividades();
  raise notice 'FECHA FIN MIGRACION %', now() - tiempo;
end;
$$ LANGUAGE 'plpgsql';
