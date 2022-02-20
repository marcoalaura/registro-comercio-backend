

CREATE OR REPLACE PROCEDURE seprec.registrar_distribuciones_capital(idVinculado NUMERIC, numeroDocumento VARCHAR, matriculaId VARCHAR) AS $$
DECLARE
	distribucion migsrc.migsrc_emp_distribuciones_capital%ROWTYPE;
BEGIN
	SELECT * INTO distribucion FROM migsrc.migsrc_emp_distribuciones_capital WHERE numero_documento = numeroDocumento AND matricula_id = matriculaId;
	IF NOT EXISTS(SELECT secuencia_id FROM migsrc.migsrc_emp_distribuciones_capital WHERE numero_documento = numeroDocumento AND matricula_id = matriculaId ) THEN
		-- RAISE NOTICE 'NO EXISTE DISTRIBUCION DE CAPITAL, DOCUMENTO %, MATRICULA %', numeroDocumento, matriculaId;
	ELSE
		-- RAISE NOTICE 'DISTRIBUCION DE CAPITAL ==> %', distribucion;

		IF rtrim(distribucion.capital_social_individual) = '' THEN
			distribucion.capital_social_individual := 0;
		END IF;

		IF rtrim(distribucion.capital_suscrito_individual) = '' THEN
			distribucion.capital_suscrito_individual := 0;
		END IF;

		IF rtrim(distribucion.capital_pagado_individual) = '' THEN
			distribucion.capital_pagado_individual := 0;
		END IF;

		IF rtrim(distribucion.numero_acciones_individual) = '' THEN
			distribucion.numero_acciones_individual := 0;
		END IF;

		IF rtrim(distribucion.participacion_porcentual_individual) = '' THEN
			distribucion.participacion_porcentual_individual := 0;
		END IF;

		INSERT INTO seprec.distribuciones_capitales (
			fecha_creacion,
			usuario_creacion,
			fecha_actualizacion,
			usuario_actualizacion,
			accion, 
			estado,
			capital_social_individual,
			capital_suscrito_individual,
			capital_pagado_individual,
			numero_acciones_individual,
			participacion_porcentual_individual,
			id_vinculado
		)
		VALUES(
			cast_to_timestamp(distribucion.fecha_creacion),
			distribucion.autor_creacion,
			cast_to_timestamp(distribucion.fecha_ultima_actualizacion),
			distribucion.autor_ultima_actualizacion,
			'MIGRACION',
			'PENDIENTE',
			distribucion.capital_social_individual,
			distribucion.capital_suscrito_individual,
			distribucion.capital_pagado_individual,
			distribucion.numero_acciones_individual,
			distribucion.participacion_porcentual_individual,
			idVinculado
		);
	END IF;
END;
$$ LANGUAGE 'plpgsql';
