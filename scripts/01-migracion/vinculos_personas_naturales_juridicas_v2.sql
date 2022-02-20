CREATE OR REPLACE PROCEDURE seprec.registrar_personas_natural()
AS $$
declare
  tiempo timestamptz;
  contador int := 0;
  persona seprec.personas%ROWTYPE;
  persona_migracion migsrc.migsrc_emp_naturales_juridicas%ROWTYPE;
begin
  tiempo := now();
  raise notice 'PERSONAS NATURALES'; 
  raise notice 'FECHA INICIO MIGRACION %', tiempo;
  for persona_migracion in select menj.*
                             from migsrc.migsrc_emp_representantes_legales merl inner join migsrc.migsrc_emp_naturales_juridicas menj 
                               on merl.tipo_documento_id = menj.tipo_documento 
                              and merl.numero_documento = menj.numero_documento
                              and tipo_documento_id in ('1', '3', '4', '6','7','8') loop
    contador := contador + 1;
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
	    persona.tipo_documento := persona_migracion.tipo_documento;
	    persona.nro_documento := persona_migracion.numero_documento;
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
	  	            persona.cod_pais);
    if contador % 10000 = 0 then
      raise notice 'Escribiendo % - %', contador, now();
      commit;
    end if;
  end loop;
  commit;
  raise notice 'FECHA FIN MIGRACION %', now() - tiempo;
  --raise notice 'existe';
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.registrar_personas_juridicas()
AS $$
declare
  tiempo timestamptz;
  contador int := 0;
  persona_juridica seprec.personas_juridicas%ROWTYPE;
  persona_migracion migsrc.migsrc_emp_naturales_juridicas%ROWTYPE;
begin
  tiempo := now();
  raise notice 'PERSONAS JURIDICAS';
  raise notice 'FECHA INICIO MIGRACION %', tiempo;
  for persona_migracion in select menj.*
                             from migsrc.migsrc_emp_representantes_legales merl inner join migsrc.migsrc_emp_naturales_juridicas menj 
                               on merl.tipo_documento_id = menj.tipo_documento 
                              and merl.numero_documento = menj.numero_documento
                              and tipo_documento_id in ('2', '9', 'A', 'M','N') loop
    contador := contador + 1;
        persona_juridica.fecha_creacion := coalesce (persona_migracion.fecha_creacion, now());
		persona_juridica.usuario_creacion := coalesce (persona_migracion.autor_creacion, '1');
		persona_juridica.fecha_actualizacion := coalesce (persona_migracion.fecha_ultima_actualizacion, now());
		persona_juridica.usuario_actualizacion := persona_migracion.autor_ultima_actualizacion;
		persona_juridica.accion := 'MIGRACION';
		persona_juridica.estado := 'PENDIENTE';	
	    persona_juridica.cod_tipo_documento := persona_migracion.tipo_documento;
	    persona_juridica.numero_documento := persona_migracion.numero_documento; 
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
	               persona_juridica.cod_pais);
    if contador % 10000 = 0 then
      raise notice 'Escribiendo % - %', contador, now();
      commit;
    end if;
  end loop;
  commit;
  raise notice 'FECHA FIN MIGRACION %', now() - tiempo;
  --raise notice 'existe';
END;
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
    tipo_persona_natural boolean;
	representate_legal migsrc.migsrc_emp_representantes_legales%ROWTYPE;
	vinculados seprec.vinculados%ROWTYPE;
	id_establecimiento int;
    id_vinculo int := null;
    id_persona int;
    contador int := 0;
    var text;
    var_out int;
begin
	tiempo := now();
	raise notice 'VINCULADOS';
    raise notice 'FECHA INICIO MIGRACION %', tiempo;
	for representate_legal in select * 
                                from migsrc.migsrc_emp_representantes_legales merl
                               where tipo_documento_id in   ('1', '3', '4', '6','7','8','2', '9', 'A', 'M','N') loop
   	    contador := contador + 1; 
   	    id_persona := null;
   	    select id
          into id_establecimiento
          from seprec.establecimientos e
         where e.numero_establecimiento = representate_legal.matricula_id;
		if representate_legal.tipo_documento_id in ('1', '3', '4', '6','7','8') then
			  select id
	            into id_persona
	            from seprec.personas p
	           where p.tipo_documento = representate_legal.tipo_documento_id
	             and p.nro_documento = representate_legal.numero_documento
	        order by p.fecha_actualizacion desc, id desc
	           limit 1;
	        tipo_persona_natural := true;
		elsif representate_legal.tipo_documento_id in ('2', '9', 'A', 'M','N') then
		      select id
	            into id_persona
	            from seprec.personas_juridicas pj 
	           where pj.cod_tipo_documento = representate_legal.tipo_documento_id
	             and pj.numero_documento = representate_legal.numero_documento
	        order by pj.fecha_actualizacion desc, id desc
	           limit 1; 
	        tipo_persona_natural := false;
		end if;
        if id_establecimiento is not null and id_persona is not null then
          --raise notice '% - % - %', contador, id_establecimiento, id_persona;
          vinculados.fecha_creacion := coalesce(representate_legal.fecha_creacion, now()); 	
		  vinculados.usuario_creacion := representate_legal.autor_creacion;
		  vinculados.accion := 'MIGRACION';
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
		  if tipo_persona_natural then
		  	vinculados.id_persona := id_persona;  
		    vinculados.id_persona_juridica := null;
		  else
		    vinculados.id_persona := null;
		  	vinculados.id_persona_juridica := id_persona;
		  end if;
		  call seprec.registrar_vinculado(vinculados);
        end if;
	    if contador % 10000 = 0 then
	     raise notice 'Escribiendo vinculados % - %', contador, now();
		 commit;
	    end if;
	end loop;
    commit;
    raise notice 'FECHA FIN MIGRACION %', now() - tiempo;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE seprec.registrar_vinculados_personas_juridicos_v2()
AS $$
BEGIN
	call seprec.registrar_personas_natural();
	call seprec.registrar_personas_juridicas();
	call seprec.migrar_representantes_legales();
END ;
$$
LANGUAGE plpgsql;