-- Direcciones:
-- Para registros sin datos de departamento, provincia, municipio se toma por defecto La Paz, Murillo 020101. Debería ser null?
-- Definir valor por defecto si no existe campo nombre_zona o null
-- Definir Valor por defecto si no existe campo calle_avenida o null
-- Definir de donde obtener código para tipo de dirección (por ahora 'D')
-- Definir de donde obtener código para tipo de subdivisión geográfica / zona (por ahora '1')
-- Definir de donde obtener código para tipo de via (por ahora '1')
-- Definir de donde obtener código para tipo de ambiente (por ahora 'D')
-- Productos:
-- Definir lógica de separación de productos. Cuando es solo ',' se corre el riesgo de perder contexto. Actualmente "',"

CREATE OR REPLACE PROCEDURE seprec.obtener_o_registrar_direccion_v2(in matricula varchar, in Establecimiento int, inout id_direccion int)
AS $$
declare
  direccion seprec.direcciones%ROWTYPE;
  fila migsrc.migsrc_emp_direcciones%ROWTYPE;
begin
  for fila in select * from migsrc.migsrc_emp_direcciones where matricula_id = matricula loop
	if fila.departamento_id = 'S/N' or rtrim(fila.departamento_id) = '' then
	  fila.departamento_id := '02';
	end if;
	if fila.provincia_id = 'S/N' or rtrim(fila.provincia_id) = '' then
	  fila.provincia_id := '0201';
	end if;
	if fila.municipio_id = 'S/N' or rtrim(fila.municipio_id) = '' then
	  fila.municipio_id := '020101';
	end if;
	if fila.nombre_zona = 'S/N' or rtrim(fila.nombre_zona) = '' then
	  fila.nombre_zona := 'Zona';
	end if;
	-- reemplazando caracteres (??, _)
	fila.nombre_zona := translate(fila.nombre_zona, '??', '"');
	fila.nombre_zona := trim(translate(fila.nombre_zona, '_', ' '));
	if fila.calle_avenida = 'S/N' or rtrim(fila.calle_avenida) = '' then
	  fila.calle_avenida := 'No especificado';
	end if;
	-- removiendo (_)
	fila.calle_avenida := trim(translate(fila.calle_avenida, '_', ' '));
	if fila.numero_direccion = 'S/N' or rtrim(fila.numero_direccion) = '' then
	  fila.numero_direccion := 'Sin número';
	end if;
	if fila.manzana = 'S/N' or rtrim(fila.manzana) = '' then
	  fila.manzana := null;
	end if;
	if fila.uv = 'S/N' or rtrim(fila.uv) = '' then
	  fila.uv := null;
	end if;
	if fila.edificio = 'S/N' or rtrim(fila.edificio) = '' then
	  fila.edificio := null;
	end if;
	if fila.piso = 'S/N' or rtrim(fila.piso) = '' then
	  fila.piso := null;
	end if;
	if fila.local = 'S/N' or rtrim(fila.local) = '' then
	  fila.local := null;
	end if;
	if fila.dic_referencial = 'S/N' or rtrim(fila.dic_referencial) = '' then
	  fila.dic_referencial := null;
	end if;
	if fila.latitud = 'S/N' or rtrim(fila.latitud) = '' then
	  fila.latitud := null;
	end if;
	if fila.longitud = 'S/N' or rtrim(fila.longitud) = '' then
	  fila.longitud := null;
	end if;

	direccion.fecha_creacion := coalesce (fila.fecha_creacion, now());
	direccion.usuario_creacion := coalesce (fila.autor_creacion, '1');
	direccion.fecha_actualizacion := coalesce (fila.fecha_ultima_actualizacion, now());
	direccion.usuario_actualizacion := fila.autor_ultima_actualizacion;
	direccion.accion := 'MIGRADO';
	direccion.estado := 'PENDIENTE';
	direccion.id_establecimiento := Establecimiento;
	direccion.cod_tipo_direccion := 'D'; -- definir de donde obtener código
	direccion.cod_departamento := fila.departamento_id;
	direccion.cod_provincia := fila.provincia_id;
	direccion.cod_municipio := fila.municipio_id;
	direccion.cod_tipo_subdivision_geografica := '1'; -- definir de donde obtener código
	direccion.nombre_subdivision_geografica := fila.nombre_zona;
	direccion.cod_tipo_via := '1'; -- definir de donde obtener código
	direccion.nombre_via := fila.calle_avenida;
	direccion.numero_domicilio := fila.numero_direccion;
	direccion.manzana := fila.manzana;
	direccion.uv := fila.uv;
	direccion.edificio := fila.edificio;
	direccion.piso := fila.piso;
	direccion.cod_tipo_ambiente := 'D'; -- definir de donde obtener código
	direccion.numero_nombre_ambiente := fila.local;
	direccion.direccion_referencial := fila.dic_referencial;
	direccion.latitud := fila.latitud;
	direccion.longitud := fila.longitud;

	INSERT INTO seprec.direcciones (
		fecha_creacion,
		usuario_creacion,
		fecha_actualizacion,
		usuario_actualizacion,
		accion,
		estado,
		id_establecimiento,
		cod_tipo_direccion,
		cod_departamento,
		cod_provincia,
		cod_municipio,
		cod_tipo_subdivision_geografica,
		nombre_subdivision_geografica,
		cod_tipo_via,
		nombre_via,
		numero_domicilio,
		manzana,
		uv,
		edificio,
		piso,
		cod_tipo_ambiente,
		numero_nombre_ambiente,
		direccion_referencial,
		latitud,
		longitud)
	VALUES (
		direccion.fecha_creacion,
		direccion.usuario_creacion,
		direccion.fecha_actualizacion,
		direccion.usuario_actualizacion,
		direccion.accion,
		direccion.estado,
		direccion.id_establecimiento,
		direccion.cod_tipo_direccion,
		direccion.cod_departamento,
		direccion.cod_provincia,
		direccion.cod_municipio,
		direccion.cod_tipo_subdivision_geografica,
		direccion.nombre_subdivision_geografica,
		direccion.cod_tipo_via,
		direccion.nombre_via,
		direccion.numero_domicilio,
		direccion.manzana,
		direccion.uv,
		direccion.edificio,
		direccion.piso,
		direccion.cod_tipo_ambiente,
		direccion.numero_nombre_ambiente,
		direccion.direccion_referencial,
		direccion.latitud,
		direccion.longitud
	)
	RETURNING id into id_direccion;
	--COMMIT;
  end loop;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.obtener_o_registrar_telefono_v2(in matricula varchar, in Establecimiento int)
AS $$
declare
  telefono seprec.contactos%ROWTYPE;
  fila migsrc.migsrc_emp_telefonos%ROWTYPE;
begin
	-- Select de filas con datos útiles
	for fila in select * from migsrc.migsrc_emp_telefonos where matricula_id = matricula and (numero_telefono1 ~ '^[0-9]' or numero_telefono2 ~ '^[0-9]' or numero_fax ~ '^[0-9]' or numero_celular ~ '^[0-9]') loop
		telefono.fecha_creacion := coalesce (fila.fecha_creacion, now());
		telefono.usuario_creacion := coalesce (fila.autor_creacion, '1');
	    telefono.fecha_actualizacion := coalesce (fila.fecha_ultima_actualizacion, now());
	    telefono.usuario_actualizacion := fila.autor_ultima_actualizacion;
		telefono.accion := 'MIGRADO';
	    telefono.estado := 'PENDIENTE';
		telefono.id_establecimiento := Establecimiento;
	
		if seprec.isnumeric(fila.numero_telefono1) then
			telefono.tipo_contacto := 'Telefono fijo';
			telefono.descripcion := fila.numero_telefono1;

			INSERT INTO seprec.contactos (
				fecha_creacion, usuario_creacion, fecha_actualizacion, usuario_actualizacion, accion, estado, tipo_contacto, descripcion, id_establecimiento)
			VALUES (telefono.fecha_creacion, telefono.usuario_creacion, telefono.fecha_actualizacion,
				telefono.usuario_actualizacion, telefono.accion, telefono.estado, telefono.tipo_contacto, telefono.descripcion, telefono.id_establecimiento);
			--COMMIT;
		end if;
		if seprec.isnumeric(fila.numero_telefono2) then
			telefono.tipo_contacto := 'Telefono fijo';
			telefono.descripcion := fila.numero_telefono2;

			INSERT INTO seprec.contactos (
				fecha_creacion, usuario_creacion, fecha_actualizacion, usuario_actualizacion, accion, estado, tipo_contacto, descripcion, id_establecimiento)
			VALUES (telefono.fecha_creacion, telefono.usuario_creacion, telefono.fecha_actualizacion,
				telefono.usuario_actualizacion, telefono.accion, telefono.estado, telefono.tipo_contacto, telefono.descripcion, telefono.id_establecimiento);
			--COMMIT;
		end if;
		if seprec.isnumeric(fila.numero_fax) then
			telefono.tipo_contacto := 'Fax';
			telefono.descripcion := fila.numero_fax;

			INSERT INTO seprec.contactos (
				fecha_creacion, usuario_creacion, fecha_actualizacion, usuario_actualizacion, accion, estado, tipo_contacto, descripcion, id_establecimiento)
			VALUES (telefono.fecha_creacion, telefono.usuario_creacion, telefono.fecha_actualizacion,
				telefono.usuario_actualizacion, telefono.accion, telefono.estado, telefono.tipo_contacto, telefono.descripcion, telefono.id_establecimiento);
			--COMMIT;
		end if;
		if seprec.isnumeric(fila.numero_celular) then
			telefono.tipo_contacto := 'Telefono celular';
			telefono.descripcion := fila.numero_celular;

			INSERT INTO seprec.contactos (
				fecha_creacion, usuario_creacion, fecha_actualizacion, usuario_actualizacion, accion, estado, tipo_contacto, descripcion, id_establecimiento)
			VALUES (telefono.fecha_creacion, telefono.usuario_creacion, telefono.fecha_actualizacion,
				telefono.usuario_actualizacion, telefono.accion, telefono.estado, telefono.tipo_contacto, telefono.descripcion, telefono.id_establecimiento);
			--COMMIT;
		end if;
	end loop;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.obtener_o_registrar_correo_v2(in matricula varchar, in Establecimiento int)
AS $$
declare
  correo_insert seprec.contactos%ROWTYPE;
  fila migsrc.migsrc_emp_correos%ROWTYPE;
  splitted TEXT[] := ARRAY[]::TEXT[];
  temp_correo varchar;
begin
	-- Select de filas con datos útiles
	for fila in select * from migsrc.migsrc_emp_correos where matricula_id = matricula and correo like '%@%' loop
		-- Parseo en caso de tener mas de un correo en el string
		fila.correo := REGEXP_REPLACE(fila.correo, '\@@', '@');
		fila.correo := REGEXP_REPLACE(fila.correo, '\.com-', '.com,');
		fila.correo := REGEXP_REPLACE(fila.correo, '\.com.bo-', '.com.bo,');
		fila.correo := REGEXP_REPLACE(fila.correo, '/', ',');
		fila.correo := REGEXP_REPLACE(fila.correo, ' ', ',');
		fila.correo := REGEXP_REPLACE(fila.correo, ' y ', ',');
		fila.correo := REGEXP_REPLACE(fila.correo, ' - ', ',');
		fila.correo := REGEXP_REPLACE(fila.correo, ';', ',');
		-- Separar string de producto
  		splitted := regexp_split_to_array(fila.correo, '\,');
		foreach temp_correo in array splitted loop
			temp_correo := trim(temp_correo);
			--raise notice '.... % ', temp_correo;
			
			if temp_correo != '' then
				correo_insert.fecha_creacion := coalesce (fila.fecha_creacion, now());
				correo_insert.usuario_creacion := coalesce (fila.autor_creacion, '1');
				correo_insert.fecha_actualizacion := coalesce (fila.fecha_ultima_actualizacion, now());
				correo_insert.usuario_actualizacion := fila.autor_ultima_actualizacion;
				correo_insert.accion := 'MIGRADO';
				correo_insert.estado := 'PENDIENTE';
				correo_insert.id_establecimiento := Establecimiento;
				correo_insert.tipo_contacto := 'Correo';
				correo_insert.descripcion := temp_correo::varchar(50);

				INSERT INTO seprec.contactos (
					fecha_creacion, usuario_creacion, fecha_actualizacion, usuario_actualizacion, accion, estado, tipo_contacto, descripcion, id_establecimiento)
				VALUES (correo_insert.fecha_creacion, correo_insert.usuario_creacion, correo_insert.fecha_actualizacion,
					correo_insert.usuario_actualizacion, correo_insert.accion, correo_insert.estado, correo_insert.tipo_contacto, correo_insert.descripcion, correo_insert.id_establecimiento);
				--COMMIT;
			end if;
		end loop;
  	end loop;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.obtener_o_registrar_producto_v2(in matricula varchar, in Establecimiento int)
AS $$
declare
  producto_insert seprec.productos%ROWTYPE;
  fila migsrc.migsrc_emp_productos%ROWTYPE;
  splitted TEXT[] := ARRAY[]::TEXT[];
  temp_product varchar;
begin
  	-- for fila in select * from migsrc.migsrc_emp_productos where matricula_id = matricula loop
  	for fila in select * from migsrc.migsrc_emp_productos where matricula_id = matricula and producto not like '%''''%' loop
		-- Separar string de producto
  		splitted := regexp_split_to_array(fila.producto, '\'',');
		foreach temp_product in array splitted loop
			-- temp_product := trim(leading '''' from temp_product);
			-- temp_product := REGEXP_REPLACE(temp_product, '\[+$', '');
			temp_product := translate(temp_product, '''', '');
			temp_product := translate(temp_product, '[', '');
			temp_product := translate(temp_product, ']', '');
			temp_product := trim(temp_product);
			-- raise exception '... % ', length(temp_product);
			
			producto_insert.fecha_creacion := coalesce (fila.fecha_creacion, now());
			producto_insert.usuario_creacion := coalesce (fila.autor_creacion, '1');
			producto_insert.fecha_actualizacion := coalesce (fila.fecha_ultima_actualizacion, now());
			producto_insert.usuario_actualizacion := fila.autor_ultima_actualizacion;
			producto_insert.accion := 'MIGRADO';
			producto_insert.estado := 'PENDIENTE';
			producto_insert.id_establecimiento := Establecimiento;
			producto_insert.producto := temp_product;

			INSERT INTO seprec.productos (
				fecha_creacion, usuario_creacion, fecha_actualizacion, usuario_actualizacion, accion, estado, producto, id_establecimiento)
			VALUES (producto_insert.fecha_creacion, producto_insert.usuario_creacion, producto_insert.fecha_actualizacion,
				producto_insert.usuario_actualizacion, producto_insert.accion, producto_insert.estado, producto_insert.producto, producto_insert.id_establecimiento);
			-- COMMIT;
		end loop;
  	end loop;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.migrar_direcciones_contactos_productos_v2()
as $$
declare
	establecimiento seprec.establecimientos%ROWTYPE;
	direccion migsrc.migsrc_emp_direcciones%ROWTYPE;
	correo migsrc.migsrc_emp_correos%ROWTYPE;
	telefono migsrc.migsrc_emp_telefonos%ROWTYPE;
	producto migsrc.migsrc_emp_productos%ROWTYPE;
	id_establecimiento int;
	id_direccion int;
    var text;
    var_out int;
	counter int;
begin
	--ALTER TABLE "seprec"."contactos" SET unlogged; -- desregistrar la tabla
	--ALTER TABLE "seprec"."direcciones" SET unlogged; -- desregistrar la tabla
	--ALTER TABLE "seprec"."productos" SET unlogged; -- desregistrar la tabla
	counter := 0;
	
	for establecimiento in select * from seprec.establecimientos e loop
		counter := counter + 1;
	    raise notice 'matricula: % - %', establecimiento.id, establecimiento.numero_establecimiento;
		id_establecimiento := establecimiento.id;
        
		-- Migrando direcciones
        call seprec.obtener_o_registrar_direccion_v2(establecimiento.numero_establecimiento::varchar, id_establecimiento::int, id_direccion::int);
		-- if id_direccion is not null then
		  -- migrar telefonos
		call seprec.obtener_o_registrar_telefono_v2(establecimiento.numero_establecimiento::varchar, id_establecimiento::int);
		  -- migrar correos
		call seprec.obtener_o_registrar_correo_v2(establecimiento.numero_establecimiento::varchar, id_establecimiento::int);
		-- end if;
		
		-- Migrando productos
        call seprec.obtener_o_registrar_producto_v2(establecimiento.numero_establecimiento::varchar, id_establecimiento::int);
		
		if counter = 10000 then
			COMMIT;
			raise notice 'commiting... %', counter;
			counter := 0;
		end if;
	end loop;
	--ALTER TABLE "seprec"."direcciones" SET logged; -- registrar la tabla
	--ALTER TABLE "seprec"."contactos" SET logged; -- registrar la tabla
	--ALTER TABLE "seprec"."productos" SET logged; -- registrar la tabla
END;
$$
LANGUAGE plpgsql;
