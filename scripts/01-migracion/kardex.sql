CREATE OR REPLACE PROCEDURE seprec.obtener_o_registrar_documento(in matricula varchar, in Establecimiento int)
AS $$
declare
  kardex seprec.kardexs%ROWTYPE;
  documento seprec.documentos%ROWTYPE;
  fila migsrc.migsrc_emp_documentos%ROWTYPE;
  estadoDocumento varchar;
begin
	for fila in select * from migsrc.migsrc_emp_documentos where matricula_id = matricula loop
		-- marcar registros revocados como INACTIVO
		if fila.estado_revocatoria = 'T' then
			estadoDocumento := 'INACTIVO';
		else
			estadoDocumento := 'PENDIENTE';
		end if;
		if fila.tipo_documento = 'S/N' or rtrim(fila.tipo_documento) = '' then
		  fila.tipo_documento := null; -- Definir valor por defecto si no existe tipo de documento
		end if;
		if fila.numero_documento = 'S/N' or rtrim(fila.numero_documento) = '' then
		  fila.numero_documento := null; -- Definir valor por defecto si no existe numero de documento
		end if;
		if fila.origen_doc = 'S/N' or rtrim(fila.origen_doc) = '' then
		  fila.origen_doc := null; -- Definir valor por defecto si no existe
		end if;
		if fila.municipio_doc = 'S/N' or rtrim(fila.municipio_doc) = '' then
		  fila.municipio_doc := '020101'; -- Definir valor por defecto si no existe
		end if;
		if fila.codigo_tramite = 'S/N' or rtrim(fila.codigo_tramite) = '' then
		  fila.codigo_tramite := null; -- Definir valor por defecto si no existe codigo de tramite
		end if;
		if fila.codigo_acto = 'S/N' or rtrim(fila.codigo_acto) = '' then
		  fila.codigo_acto := null; -- Definir valor por defecto si no existe
		end if;
		if fila.libro_id = 'S/N' or rtrim(fila.libro_id) = '' then
		  fila.libro_id := null; -- Definir valor por defecto si no existe
		end if;
		if fila.registro_id = 'S/N' or rtrim(fila.registro_id) = '' then
		  fila.registro_id := null; -- Definir valor por defecto si no existe
		end if;
	
		if fila.registro_id is null and fila.libro_id is null and fila.codigo_acto is null then
			select *
			into documento
			from seprec.documentos d
			where d.id_establecimiento = Establecimiento
			and d.cod_tipo_documento = fila.tipo_documento
			and d.numero = fila.numero_documento
			and d.numero_tramite = fila.codigo_tramite;
			if documento.id is null then
				documento.fecha_creacion := coalesce (fila.fecha_creacion, now());
				documento.usuario_creacion := coalesce (fila.autor_creacion, '1');
				documento.fecha_actualizacion := coalesce (fila.fecha_ultima_actualizacion, now());
				documento.usuario_actualizacion := fila.autor_ultima_actualizacion;
				documento.accion := 'MIGRADO';
				documento.estado := estadoDocumento;
				documento.cod_tipo_documento := fila.tipo_documento;
				documento.numero := fila.numero_documento;
				documento.emisor := fila.origen_doc;
				documento.fecha_emision := fila.fecha_documento;
				documento.cod_municipio := fila.municipio_doc;
				documento.numero_tramite := fila.codigo_tramite;
				documento.id_establecimiento := Establecimiento;
			
				INSERT INTO seprec.documentos (
					fecha_creacion,
					usuario_creacion,
					fecha_actualizacion,
					usuario_actualizacion,
					accion,
					estado,
					cod_tipo_documento,
					numero,
					emisor,
					fecha_emision,
					cod_municipio,
					numero_tramite,
					id_establecimiento
					)
				VALUES (
					documento.fecha_creacion,
					documento.usuario_creacion,
					documento.fecha_actualizacion,
					documento.usuario_actualizacion,
					documento.accion,
					documento.estado,
					documento.cod_tipo_documento,
					documento.numero,
					documento.emisor,
					documento.fecha_emision,
					documento.cod_municipio,
					documento.numero_tramite,
					documento.id_establecimiento
				);
				-- COMMIT;
			end if;
		else
			select *
			into kardex
			from seprec.kardexs k
			where k.id_establecimiento = Establecimiento
			and k.cod_tipo_documento = fila.tipo_documento
			and k.numero = fila.numero_documento
			and k.numero_tramite = fila.codigo_tramite;
			if kardex.id is null then
				kardex.fecha_creacion := coalesce (fila.fecha_creacion, now());
				kardex.usuario_creacion := coalesce (fila.autor_creacion, '1');
				kardex.fecha_actualizacion := coalesce (fila.fecha_ultima_actualizacion, now());
				kardex.usuario_actualizacion := fila.autor_ultima_actualizacion;
				kardex.accion := 'MIGRADO';
				kardex.estado := estadoDocumento;
				kardex.cod_tipo_documento := fila.tipo_documento;
				kardex.numero := fila.numero_documento;
				kardex.emisor := fila.origen_doc;
				kardex.fecha_emision := fila.fecha_documento;
				kardex.cod_municipio := fila.municipio_doc;
				kardex.numero_tramite := fila.codigo_tramite;
				kardex.cod_tipo_acto := fila.codigo_acto;
				kardex.cod_libro_registro := fila.libro_id;
				kardex.numero_registro := fila.registro_id;
				kardex.id_establecimiento := Establecimiento;
			
				INSERT INTO seprec.kardexs (
					fecha_creacion,
					usuario_creacion,
					fecha_actualizacion,
					usuario_actualizacion,
					accion,
					estado,
					cod_tipo_documento,
					numero,
					emisor,
					fecha_emision,
					cod_municipio,
					numero_tramite,
					cod_tipo_acto,
					cod_libro_registro,
					numero_registro,
					id_establecimiento
					)
				VALUES (
					kardex.fecha_creacion,
					kardex.usuario_creacion,
					kardex.fecha_actualizacion,
					kardex.usuario_actualizacion,
					kardex.accion,
					kardex.estado,
					kardex.cod_tipo_documento,
					kardex.numero,
					kardex.emisor,
					kardex.fecha_emision,
					kardex.cod_municipio,
					kardex.numero_tramite,
					kardex.cod_tipo_acto,
					kardex.cod_libro_registro,
					kardex.numero_registro,
					kardex.id_establecimiento
				);
				-- COMMIT;
			end if;
		end if;
  	end loop;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.migrar_kardexs_documentos()
as $$
declare
	establecimiento seprec.establecimientos%ROWTYPE;
	kardex migsrc.migsrc_emp_documentos%ROWTYPE;
	id_establecimiento int;
    var text;
    var_out int;
	counter int;
begin
	counter := 0;
	--create index idx_matricula_id_documentos on migsrc.migsrc_emp_documentos(matricula_id);
	
	for establecimiento in select * from seprec.establecimientos e loop
		counter := counter + 1;
	    raise notice 'matricula: % - %', establecimiento.id, establecimiento.numero_establecimiento;
		id_establecimiento := establecimiento.id;
        
		-- Migrando documentos
        call seprec.obtener_o_registrar_documento(establecimiento.numero_establecimiento::varchar, id_establecimiento::int);
		
		if counter = 5000 then
			COMMIT;
			counter := 0;
			raise notice 'commiting... %', counter;
		end if;
	end loop;
END;
$$
LANGUAGE plpgsql;
