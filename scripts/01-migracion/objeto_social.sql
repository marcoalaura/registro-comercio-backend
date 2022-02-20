CREATE OR REPLACE PROCEDURE seprec.registrar_objeto_social_v1(idEmpresa numeric, empresa RECORD) AS $$
DECLARE
	objeto VARCHAR;
BEGIN
    SELECT objeto_social INTO objeto FROM  migsrc.migsrc_emp_objeto WHERE matricula_id = empresa.matricula;
    IF NOT EXISTS(SELECT id FROM seprec.objetos_sociales WHERE id_empresa = idEmpresa ) THEN
    	objeto := replace(objeto,'-',' ');
		objeto := replace(objeto,'.',' ');
		IF TRIM(objeto) = '' THEN
    		objeto:= NULL;
    	END IF;
		objeto := TRIM(objeto);

		INSERT INTO seprec.objetos_sociales
  		(
			fecha_creacion,
			usuario_creacion,
			fecha_actualizacion,
			usuario_actualizacion,
            accion,
			estado,
			objeto_social,
			id_empresa
        )
  		VALUES
  		(
			empresa.fecha_creacion,
			empresa.usuario_creacion,
			empresa.fecha_actualizacion,
			empresa.usuario_actualizacion,
            'MIGRADO',
			'PENDIENTE',
			objeto,
			idEmpresa
		);
    END IF;
END;
$$ LANGUAGE 'plpgsql';

----------
CREATE OR REPLACE PROCEDURE seprec.migrar_objeto_social_v1() AS $$
DECLARE
    empresa seprec.empresas%ROWTYPE;
	contador INTEGER = 0;
	tiempo timestamptz;
BEGIN
	tiempo := now();
  	raise notice 'FECHA INICIO MIGRACION OBJETO SOCIAL V1 %', tiempo;
    FOR empresa IN SELECT * FROM seprec.empresas ORDER BY id LOOP
        CALL seprec.registrar_objeto_social_v1(empresa.id, empresa);
	    contador := contador + 1 ;
	    IF contador = 10000 THEN
    	    COMMIT;
            contador := 0;
        END IF;
    END LOOP;
	raise notice 'FECHA FIN MIGRACION OBJETO SOCIAL V1 %', now() - tiempo;
	COMMIT;
END;
$$
LANGUAGE plpgsql;

---------------------------
CREATE OR REPLACE PROCEDURE seprec.registrar_objeto_social_v2(idEmpresa numeric, empresa RECORD) AS $$
DECLARE
	objeto VARCHAR;
BEGIN
    SELECT objeto_social INTO objeto FROM  migsrc.migsrc_emp_objeto WHERE matricula_id = empresa.matricula_anterior;
    objeto := replace(objeto,'-',' ');
    objeto := replace(objeto,'.',' ');
    IF TRIM(objeto) = '' THEN
        objeto:= NULL;
    END IF;
    objeto := TRIM(objeto);

    INSERT INTO seprec.objetos_sociales
    (
        fecha_creacion,
        usuario_creacion,
        fecha_actualizacion,
        usuario_actualizacion,
        accion,
        estado,
        objeto_social,
        id_empresa
    )
    VALUES
    (
        empresa.fecha_creacion,
        empresa.usuario_creacion,
        empresa.fecha_actualizacion,
        empresa.usuario_actualizacion,
        'MIGRADO',
        'PENDIENTE',
        objeto,
        idEmpresa
    );
END;
$$ LANGUAGE 'plpgsql';

----------
CREATE OR REPLACE PROCEDURE seprec.migrar_objeto_social_v2() AS $$
DECLARE
    empresa seprec.empresas%ROWTYPE;
	contador INTEGER = 0;
	tiempo timestamptz;
BEGIN
	tiempo := now();
  	RAISE NOTICE 'FECHA INICIO MIGRACION OBJETO SOCIAL V2 %', tiempo;
    FOR empresa IN SELECT * FROM seprec.empresas ORDER BY id LOOP
		RAISE NOTICE 'ID EMPRESA ---> %', empresa.id ;
    	CALL seprec.registrar_objeto_social_v2(empresa.id, empresa);
		contador := contador + 1 ;
		IF contador = 10000 THEN
        	COMMIT;
        	contador := 0;
      	END IF;
    END LOOP;
	RAISE NOTICE 'FECHA FIN MIGRACION OBJETO SOCIAL V2 %', now() - tiempo;
	COMMIT;
END;
$$
LANGUAGE plpgsql;
