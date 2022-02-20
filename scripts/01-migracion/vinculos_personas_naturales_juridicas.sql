CREATE OR REPLACE PROCEDURE seprec.obtener_o_registrar_persona_natural(in tipo_doc varchar, in numero_doc varchar, inout id_persona int)
AS $$
declare
  persona seprec.personas%ROWTYPE;
  persona_migracion migsrc.migsrc_emp_naturales_juridicas%ROWTYPE;
begin
	select *
	  into persona
      from seprec.personas p
     where p.nro_documento = numero_doc
       and p.tipo_documento = tipo_doc;	
	if persona.id is null then
		select * 
    	  into persona_migracion
	      from migsrc.migsrc_emp_naturales_juridicas menj
	     where menj.numero_documento = numero_doc
	       and menj.tipo_documento = tipo_doc 
	  order by menj.fecha_ultima_actualizacion desc limit 1;
	    persona.fecha_creacion := coalesce (persona_migracion.fecha_creacion, now());
	    persona.usuario_creacion := coalesce (persona_migracion.autor_creacion, '1');
	    persona.fecha_actualizacion := coalesce (persona_migracion.fecha_ultima_actualizacion, now());
	    persona.usuario_actualizacion := persona_migracion.autor_ultima_actualizacion;
	    persona.accion := 'MIGRACION';
	    persona.estado := 'PENDIENTE';
	    persona.nombre_completo := persona_migracion.razon_social;
	    persona.nombres := persona_migracion.nombre_completo;
	    persona.primer_apellido := persona_migracion.apellido_paterno;
	    persona.segundo_apellido := persona_migracion.apellido2;
	    persona.tipo_documento := tipo_doc;
	    persona.nro_documento := numero_doc;
	    --persona.fecha_nacimiento
	    --persona.telefono
	    persona.genero := persona_migracion.genero;
	    --persona.observacion
	    persona.cod_pais :=persona_migracion.pais_origen;
		INSERT INTO seprec.personas
		           (fecha_creacion,
		            usuario_creacion,
		            fecha_actualizacion,
		            usuario_actualizacion,
		            accion,
		            estado,
		            nombre_completo,
		            nombres,
		            primer_apellido,
		            segundo_apellido,
		            tipo_documento,
		            nro_documento,
		            genero,
		            cod_pais)
	         VALUES(persona.fecha_creacion,
	         	    persona.usuario_creacion,
	         	    persona.fecha_actualizacion,
	         	    persona.usuario_actualizacion,
	         	    persona.accion,
	         	    persona.estado,
	         	    persona.nombre_completo,
	                persona.nombres,
	                persona.primer_apellido,
	                persona.segundo_apellido,
	                persona.tipo_documento,
	                persona.nro_documento,
	                persona.genero,
	  	            persona.cod_pais)
	         RETURNING id into id_persona;
	else
		id_persona := persona.id;
	end if;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.obtener_o_registrar_persona_juridica(in tipo_doc varchar, in numero_doc varchar, inout id_persona int)
AS $$
declare
  persona_juridica seprec.personas_juridicas %ROWTYPE;
  persona_migracion migsrc.migsrc_emp_naturales_juridicas%ROWTYPE;
begin
	select *
	  into persona_juridica
      from seprec.personas_juridicas p
     where p.numero_documento = numero_doc 
       and p.cod_tipo_documento = tipo_doc;	
	if persona_juridica.id is null then
	    select * 
    	  into persona_migracion
	      from migsrc.migsrc_emp_naturales_juridicas menj
	     where menj.numero_documento = numero_doc
	       and menj.tipo_documento = tipo_doc 
	  order by menj.fecha_ultima_actualizacion desc limit 1;
      if persona_migracion.numero_documento is not null then
        persona_juridica.fecha_creacion := coalesce (persona_migracion.fecha_creacion, now());
		persona_juridica.usuario_creacion := coalesce (persona_migracion.autor_creacion, '1');
		persona_juridica.fecha_actualizacion := coalesce (persona_migracion.fecha_ultima_actualizacion, now());
		persona_juridica.usuario_actualizacion := persona_migracion.autor_ultima_actualizacion;
		persona_juridica.accion := 'MIGRACION';
		persona_juridica.estado := 'PENDIENTE';	
	    persona_juridica.cod_tipo_documento := tipo_doc;
	    persona_juridica.numero_documento := numero_doc;
	    --matricula := 
	    persona_juridica.razon_social := persona_migracion.razon_social;
	    persona_juridica.cod_pais := persona_migracion.pais_origen;
		INSERT INTO seprec.personas_juridicas
			      (fecha_creacion,
			       usuario_creacion,
			       fecha_actualizacion,
			       usuario_actualizacion,
			       accion,
			       estado,
			       cod_tipo_documento,
			       numero_documento,
			       --matricula,
			       razon_social,
			       cod_pais)
	        VALUES(persona_juridica.fecha_creacion,
		           persona_juridica.usuario_creacion,
		           persona_juridica.fecha_actualizacion,
		           persona_juridica.usuario_actualizacion,
		           persona_juridica.accion,
		           persona_juridica.estado,	
	               persona_juridica.cod_tipo_documento,
	               persona_juridica.numero_documento,
	               --matricula := 
	               persona_juridica.razon_social,
	               persona_juridica.cod_pais)
	               RETURNING id into id_persona;
      end if;  
	else
	  id_persona := persona_juridica.id;
	end if;
END ;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE seprec.registrar_vinculado(in vinculados RECORD)
AS $$
BEGIN
	INSERT INTO seprec.vinculados
			   (fecha_creacion, usuario_creacion,cod_tipo_vinculo, cod_cargo, cod_libro_designacion, registro_designacion, fecha_vinculacion, cod_control_revocado, cod_libro_revocatoria, registro_revocatoria, fecha_revocatoria, id_establecimiento, id_persona, id_persona_juridica)
		 VALUES(vinculados.fecha_creacion, vinculados.usuario_creacion, vinculados.cod_tipo_vinculo, vinculados.cod_cargo, vinculados.cod_libro_designacion, vinculados.registro_designacion, vinculados.fecha_vinculacion, vinculados.cod_control_revocado, vinculados.cod_libro_revocatoria, vinculados.registro_revocatoria, vinculados.fecha_revocatoria, vinculados.id_establecimiento, vinculados.id_persona, vinculados.id_persona_juridica);
END ;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.migrar_representantes_legales()
as $$
declare 
    tiempo timestamptz;
	representate_legal migsrc.migsrc_emp_representantes_legales%ROWTYPE;
	vinculados seprec.vinculados%ROWTYPE;
	id_establecimiento int;
    id_vinculo int;
    id_persona_natural int;
    id_persona_juridica int;
    contador int := 0;
    var text;
    var_out int;
begin
	tiempo := now();
    raise notice 'FECHA INICIO MIGRACION %', tiempo;
	for representate_legal in select * from migsrc.migsrc_emp_representantes_legales merl loop
   	    contador := contador + 1; 
	    --raise notice '% - matricula: % - %', contador, representate_legal.matricula_id, representate_legal.tipo_documento_id;
	    if contador =  10000 then
	        raise notice 'Escribiendo -%', now();
	    	commit;
	        contador := 0;
	    end if;
		if representate_legal.tipo_documento_id in ('1', '3', '4', '6','7','8') then
			select v.id
			  into id_vinculo
  			  from seprec.vinculados v inner join seprec.establecimientos e on v.id_establecimiento = e.id
                                       inner join seprec.personas p on v.id_persona = p.id
             where e.numero_establecimiento = representate_legal.matricula_id
               and p.tipo_documento = representate_legal.tipo_documento_id
               and p.nro_documento = representate_legal.numero_documento
               and v.cod_tipo_vinculo = representate_legal.vinculo
               and v.cod_cargo = representate_legal.cargo;
          if id_vinculo is null then
            select id
              into id_establecimiento
              from seprec.establecimientos e
             where e.numero_establecimiento = representate_legal.matricula_id;
            --obtenemos datos de la persona         
            call seprec.obtener_o_registrar_persona_natural(representate_legal.tipo_documento_id, representate_legal.numero_documento, id_persona_natural);		
            if id_establecimiento is not null and id_persona_natural is not null then
			  -- macheo de datos
			  vinculados.fecha_creacion := coalesce(representate_legal.fecha_creacion, now()); 	
		      vinculados.usuario_creacion := representate_legal.autor_creacion;
		      vinculados.estado := 'PENDIENTE';
		      vinculados.cod_tipo_vinculo := representate_legal.vinculo;
		      vinculados.cod_cargo := representate_legal.cargo;
		      vinculados.cod_libro_designacion := representate_legal.libro_id;
		      vinculados.registro_designacion := representate_legal.registro_id;
		      vinculados.fecha_vinculacion := coalesce(representate_legal.fecha_creacion, now());
	      	  vinculados.cod_control_revocado := representate_legal.control_revocado;
		      vinculados.cod_libro_revocatoria := representate_legal.libro_revocatori;
		      vinculados.registro_revocatoria := representate_legal.numero_revocatoria;
		      --vinculados.fecha_revocatoria;
		      vinculados.id_establecimiento := id_establecimiento;
		      vinculados.id_persona := id_persona_natural;
		      --vinculados.id_persona_juridica := null;
			  call seprec.registrar_vinculado(vinculados);
            end if;
            id_persona_natural := null;
          end if;
		elsif representate_legal.tipo_documento_id in ('2', '9', 'A', 'M','N') then
			select v.id
			  into id_vinculo
  			  from seprec.vinculados v inner join seprec.establecimientos e on v.id_establecimiento = e.id
                                       inner join seprec.personas_juridicas p on v.id_persona_juridica = p.id
             where e.numero_establecimiento = representate_legal.matricula_id
               and p.cod_tipo_documento = representate_legal.tipo_documento_id
               and p.numero_documento = representate_legal.numero_documento
               and v.cod_tipo_vinculo = representate_legal.vinculo
               and v.cod_cargo = representate_legal.cargo;
          if id_vinculo is null then
            select id
              into id_establecimiento
              from seprec.establecimientos e
             where e.numero_establecimiento = representate_legal.matricula_id;
            call seprec.obtener_o_registrar_persona_juridica(representate_legal.tipo_documento_id, representate_legal.numero_documento, id_persona_juridica);
            if id_establecimiento is not null and id_persona_juridica is not null then
			  -- macheo de datos
			  vinculados.fecha_creacion := coalesce(representate_legal.fecha_creacion, now()); 	
		      vinculados.usuario_creacion := coalesce(representate_legal.autor_creacion, '1');
		      vinculados.estado := 'PENDIENTE';
		      vinculados.cod_tipo_vinculo := representate_legal.vinculo;
		      vinculados.cod_cargo := representate_legal.cargo;
		      vinculados.cod_libro_designacion := representate_legal.libro_id;
		      vinculados.registro_designacion := representate_legal.registro_id;
		      vinculados.fecha_vinculacion := coalesce(representate_legal.fecha_creacion, now());
	      	  vinculados.cod_control_revocado := representate_legal.control_revocado;
		      vinculados.cod_libro_revocatoria := representate_legal.libro_revocatori;
		      vinculados.registro_revocatoria := representate_legal.numero_revocatoria;
		      --vinculados.fecha_revocatoria;
		      vinculados.id_establecimiento := id_establecimiento;
		      vinculados.id_persona_juridica := id_persona_juridica;
			  call seprec.registrar_vinculado(vinculados);
            end if;
            id_persona_juridica := null;
          end if;
	    end if;
	end loop;
    commit;
    raise notice 'FECHA FIN MIGRACION %', now() - tiempo;
END;
$$
LANGUAGE plpgsql;