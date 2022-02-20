CREATE OR REPLACE PROCEDURE seprec.registrar_capital_v1(idEmpresa NUMERIC, matriculaId VARCHAR) AS $$
DECLARE
	capitales migsrc.migsrc_emp_capital%ROWTYPE;
BEGIN
    SET datestyle = dmy;
	FOR capitales IN SELECT * FROM migsrc.migsrc_emp_capital WHERE matricula_id = matriculaId LOOP
        IF NOT EXISTS(
            SELECT id FROM seprec.capitales
            WHERE id_empresa = idEmpresa
            AND registro_capital = capitales.numero_registro_capital
        ) THEN
            IF rtrim(capitales.valor_cuota) = '' THEN
                capitales.valor_cuota := 0;
            END IF;

            IF rtrim(capitales.cuotas_capital_social) = '' THEN
                capitales.cuotas_capital_social := 0;
            END IF;

            IF rtrim(capitales.capital_autorizado) = '' THEN
                capitales.capital_autorizado := 0;
            END IF;

            IF rtrim(capitales.cuotas_capital_autorizado) = '' THEN
                capitales.cuotas_capital_autorizado := 0;
            END IF;

            IF rtrim(capitales.capital_suscrito) = '' THEN
                capitales.capital_suscrito := 0;
            END IF;

            IF rtrim(capitales.cuotas_capital_suscrito) = '' THEN
                capitales.cuotas_capital_suscrito := 0;
            END IF;

            IF rtrim(capitales.capital_pagado) = '' THEN
                capitales.capital_pagado := 0;
            END IF;

            IF rtrim(capitales.cuotas_capit) = '' THEN
                capitales.cuotas_capit := 0;
            END IF;

            IF rtrim(capitales.capital_asignado) = '' THEN
                capitales.capital_asignado := 0;
            END IF;

            IF rtrim(capitales.valor_cuota) = '' THEN
                capitales.valor_cuota := 0;
            END IF;

            IF capitales.porcentaje_aporte_privado::NUMERIC = 100 THEN
                capitales.origen_capital := 'P';
            END IF;

            IF capitales.porcentaje_aporte_publico::NUMERIC = 100 THEN
                capitales.origen_capital := 'N';
            END IF;

            IF capitales.porcentaje_aporte_extranjero::NUMERIC = 100 THEN
                capitales.origen_capital := 'E';
            END IF;

            IF capitales.porcentaje_aporte_privado::NUMERIC > 0 and (capitales.porcentaje_aporte_publico::NUMERIC > 0 or capitales.porcentaje_aporte_extranjero::NUMERIC > 0 ) THEN
                capitales.origen_capital := 'M';
            END IF;

            INSERT INTO seprec.capitales(
				fecha_creacion,
				usuario_creacion,
				fecha_actualizacion,
				usuario_actualizacion,
				accion,
				estado,
				cod_origen_capital,
				cod_pais_origen_capital,
				capital_social,
				cuotas_capital_social,
				capital_autorizado,
				cuota_capital_autorizado,
				capital_suscrito,
				cuotas_capital_suscrito,
				capital_pagado,
				cuotas_capital_pagado,
				capital_asignado,
				valor_cuota,
				porcentaje_aporte_privado,
				porcentaje_aporte_publico,
				porcentaje_aporte_extranjero,
				cod_tipo_moneda,
				cod_libro_capital,
				registro_capital,
				id_empresa
			)
  			VALUES(
				capitales.fecha_creacion,
				capitales.autor_creacion,
				capitales.fecha_ultima_actualizacion,
				capitales.autor_ultima_actualizacion,
				'MIGRACION',
				'PENDIENTE',
				capitales.origen_capital,
				'BO',
				capitales.capital_social::NUMERIC,
				capitales.cuotas_capital_social::NUMERIC,
				capitales.capital_autorizado::NUMERIC,
				capitales.cuotas_capital_autorizado::NUMERIC,
				capitales.capital_suscrito::NUMERIC,
				capitales.cuotas_capital_suscrito::NUMERIC,
				capitales.capital_pagado::NUMERIC,
				capitales.cuotas_capit::NUMERIC,
				capitales.capital_asignado::NUMERIC,
				capitales.valor_cuota::NUMERIC,
				capitales.porcentaje_aporte_privado::NUMERIC,
				capitales.porcentaje_aporte_publico::NUMERIC,
				capitales.porcentaje_aporte_extranjero::NUMERIC,
				capitales.moneda,
				capitales.libro_capital,
				capitales.numero_registro_capital,
				idEmpresa
			);
        END IF;
  	END LOOP;
END;
$$
LANGUAGE 'plpgsql';

-----------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE seprec.migrar_capital_v1() AS $$
DECLARE
    empresa seprec.empresas%ROWTYPE;
    contador INTEGER = 0;
    tiempo timestamptz;
BEGIN
    tiempo := now();
  	raise notice 'FECHA INICIO MIGRACION CAPITAL %', tiempo;
    FOR empresa IN SELECT * FROM seprec.empresas ORDER BY id LOOP
        CALL seprec.registrar_capital_v1(empresa.id, empresa.matricula_anterior);
        contador := contador + 1 ;
		IF contador = 10000 THEN
			COMMIT;
        	contador := 0;
      	END IF;
    END LOOP;
    raise notice 'FECHA FIN MIGRACION CAPITAL %', now() - tiempo;
    COMMIT;
END;
$$
LANGUAGE plpgsql;

---------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE seprec.registrar_capital_v2(idEmpresa NUMERIC, matriculaId VARCHAR) AS $$
DECLARE
	capitales migsrc.migsrc_emp_capital%ROWTYPE;
BEGIN
    SET datestyle = dmy;
	FOR capitales IN SELECT * FROM migsrc.migsrc_emp_capital WHERE matricula_id = matriculaId LOOP

		IF rtrim(capitales.valor_cuota) = '' THEN
			capitales.valor_cuota := 0;
		END IF;

		IF rtrim(capitales.cuotas_capital_social) = '' THEN
			capitales.cuotas_capital_social := 0;
		END IF;

		IF rtrim(capitales.capital_autorizado) = '' THEN
			capitales.capital_autorizado := 0;
		END IF;

		IF rtrim(capitales.cuotas_capital_autorizado) = '' THEN
			capitales.cuotas_capital_autorizado := 0;
		END IF;

		IF rtrim(capitales.capital_suscrito) = '' THEN
			capitales.capital_suscrito := 0;
		END IF;

		IF rtrim(capitales.cuotas_capital_suscrito) = '' THEN
			capitales.cuotas_capital_suscrito := 0;
		END IF;

		IF rtrim(capitales.capital_pagado) = '' THEN
			capitales.capital_pagado := 0;
		END IF;

		IF rtrim(capitales.cuotas_capit) = '' THEN
			capitales.cuotas_capit := 0;
		END IF;

		IF rtrim(capitales.capital_asignado) = '' THEN
			capitales.capital_asignado := 0;
		END IF;

		IF rtrim(capitales.valor_cuota) = '' THEN
			capitales.valor_cuota := 0;
		END IF;

		IF capitales.porcentaje_aporte_privado::NUMERIC = 100 THEN
			capitales.origen_capital := 'P';
		END IF;

		IF capitales.porcentaje_aporte_publico::NUMERIC = 100 THEN
			capitales.origen_capital := 'N';
		END IF;

		IF capitales.porcentaje_aporte_extranjero::NUMERIC = 100 THEN
			capitales.origen_capital := 'E';
		END IF;

		IF capitales.porcentaje_aporte_privado::NUMERIC > 0 and (capitales.porcentaje_aporte_publico::NUMERIC > 0 or capitales.porcentaje_aporte_extranjero::NUMERIC > 0 ) THEN
			capitales.origen_capital := 'M';
		END IF;

		INSERT INTO seprec.capitales(
			fecha_creacion,
			usuario_creacion,
			fecha_actualizacion,
			usuario_actualizacion,
			accion,
			estado,
			cod_origen_capital,
			cod_pais_origen_capital,
			capital_social,
			cuotas_capital_social,
			capital_autorizado,
			cuota_capital_autorizado,
			capital_suscrito,
			cuotas_capital_suscrito,
			capital_pagado,
			cuotas_capital_pagado,
			capital_asignado,
			valor_cuota,
			porcentaje_aporte_privado,
			porcentaje_aporte_publico,
			porcentaje_aporte_extranjero,
			cod_tipo_moneda,
			cod_libro_capital,
			registro_capital,
			id_empresa
		)
		VALUES(
			capitales.fecha_creacion,
			capitales.autor_creacion,
			capitales.fecha_ultima_actualizacion,
			capitales.autor_ultima_actualizacion,
			'MIGRACION',
			'PENDIENTE',
			capitales.origen_capital,
			'BO',
			capitales.capital_social::NUMERIC,
			capitales.cuotas_capital_social::NUMERIC,
			capitales.capital_autorizado::NUMERIC,
			capitales.cuotas_capital_autorizado::NUMERIC,
			capitales.capital_suscrito::NUMERIC,
			capitales.cuotas_capital_suscrito::NUMERIC,
			capitales.capital_pagado::NUMERIC,
			capitales.cuotas_capit::NUMERIC,
			capitales.capital_asignado::NUMERIC,
			capitales.valor_cuota::NUMERIC,
			capitales.porcentaje_aporte_privado::NUMERIC,
			capitales.porcentaje_aporte_publico::NUMERIC,
			capitales.porcentaje_aporte_extranjero::NUMERIC,
			capitales.moneda,
			capitales.libro_capital,
			capitales.numero_registro_capital,
			idEmpresa
		);

  	END LOOP;
END;
$$
LANGUAGE 'plpgsql';

-----------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE seprec.migrar_capital_v2() AS $$
DECLARE
    empresa seprec.empresas%ROWTYPE;
    contador INTEGER = 0;
    tiempo timestamptz;
BEGIN
    tiempo := now();
  	RAISE NOTICE 'FECHA INICIO MIGRACION CAPITAL V2 %', tiempo;
    FOR empresa IN SELECT * FROM seprec.empresas ORDER BY id LOOP
		RAISE NOTICE 'ID EMPRESA ---> % - MATRICULA ---> % ', empresa.id, empresa.matricula_anterior;
        CALL seprec.registrar_capital_v2(empresa.id, empresa.matricula_anterior);
        contador := contador + 1 ;
		IF contador = 10000 THEN
			COMMIT;
        	contador := 0;
      	END IF;
    END LOOP;
    RAISE NOTICE 'FECHA FIN MIGRACION CAPITAL V2 %', now() - tiempo;
    COMMIT;
END;
$$
LANGUAGE plpgsql;
