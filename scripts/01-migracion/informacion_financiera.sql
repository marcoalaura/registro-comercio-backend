CREATE OR REPLACE PROCEDURE seprec.registrar_informacion_financiera_v1(idEmpresa NUMERIC, matriculaId VARCHAR) AS $$
DECLARE
	financieras migsrc.migsrc_emp_informacion_financiera%ROWTYPE;
BEGIN
	SET datestyle = dmy;
	FOR financieras IN SELECT * FROM migsrc.migsrc_emp_informacion_financiera WHERE matricula_id = matriculaId LOOP

		RAISE NOTICE '2 %', financieras.gestion_datos;
		IF rtrim(financieras.gestion_datos) = '' THEN
			financieras.gestion_datos := 0;
		END IF;

		RAISE NOTICE '3 %', financieras.gestion_datos;
		IF rtrim(financieras.gestion_datos) LIKE 'I%' THEN
			financieras.gestion_datos := replace(financieras.gestion_datos,'I','2');
		END IF;

		RAISE NOTICE '4 %', financieras.gestion_datos;
		IF NOT seprec.isnumeric(financieras.gestion_datos) THEN
			financieras.gestion_datos := 0;
		END IF;

		RAISE NOTICE '5 %', financieras.activos_corrientes;
		IF rtrim(financieras.activos_corrientes) = '' THEN
			financieras.activos_corrientes := 0;
		END IF;

		IF rtrim(financieras.activos_fijos) = '' THEN
			financieras.activos_fijos := 0;
		END IF;

		IF rtrim(financieras.valoracion_activos) = '' THEN
			financieras.valoracion_activos := 0;
		END IF;

		IF rtrim(financieras.otros_activos) = '' THEN
			financieras.otros_activos := 0;
		END IF;

		IF rtrim(financieras.activos_brutos) = '' THEN
			financieras.activos_brutos := 0;
		END IF;

		IF rtrim(financieras.activos_netos) = '' THEN
			financieras.activos_netos := 0;
		END IF;

		IF rtrim(financieras.pasivos_corrientes) = '' THEN
			financieras.pasivos_corrientes := 0;
		END IF;

		IF rtrim(financieras.obligaciones_largo_plazo) = '' THEN
			financieras.obligaciones_largo_plazo := 0;
		END IF;

		IF rtrim(financieras.total_pasivos) = '' THEN
			financieras.total_pasivos := 0;
		END IF;

		IF rtrim(financieras.patrimonio_liquido) = '' THEN
			financieras.patrimonio_liquido := 0;
		END IF;

		IF rtrim(financieras.pasivo_mas_patrimonio) = '' THEN
			financieras.pasivo_mas_patrimonio := 0;
		END IF;

		IF rtrim(financieras.ventas_netas) = '' THEN
			financieras.ventas_netas := 0;
		END IF;

		IF rtrim(financieras.costo_ventas) = '' THEN
			financieras.costo_ventas := 0;
		END IF;

		IF rtrim(financieras.utilidad_operacional) = '' THEN
			financieras.utilidad_operacional := 0;
		END IF;

		IF rtrim(financieras.utilidad_bruta) = '' THEN
			financieras.utilidad_bruta := 0;
		END IF;

		IF rtrim(financieras.moneda_datos) = '' THEN
			financieras.moneda_datos := 0;
		END IF;

		IF rtrim(financieras.gestion_balance) = '' THEN
			financieras.gestion_balance := 0;
		END IF;

		IF rtrim(financieras.gestion_balance) like 'I%' THEN
			financieras.gestion_balance := replace(financieras.gestion_balance,'I','2');
		END IF;

		IF not seprec.isnumeric(financieras.gestion_balance) THEN
			financieras.gestion_balance := 0;
		END IF;

		IF rtrim(financieras.activo_disponible) = '' THEN
			financieras.activo_disponible := 0;
		END IF;

		IF rtrim(financieras.activo_exigible) = '' THEN
			financieras.activo_exigible := 0;
		END IF;

		IF rtrim(financieras.activo_realizable) = '' THEN
			financieras.activo_realizable := 0;
		END IF;

		IF rtrim(financieras.otros_activos_corriente) = '' THEN
			financieras.otros_activos_corriente := 0;
		END IF;

		IF rtrim(financieras.activos_no_corrientes) = '' THEN
			financieras.activos_no_corrientes := 0;
		END IF;

		IF rtrim(financieras.pasivos_no_corrientes) = '' THEN
			financieras.pasivos_no_corrientes := 0;
		END IF;

		IF rtrim(financieras.patrimonio) = '' THEN
			financieras.patrimonio := 0;
		END IF;

		IF rtrim(financieras.resultado_inscripcion) = '' THEN
			financieras.resultado_inscripcion := 0;
		END IF;

		IF rtrim(financieras.total_ingresos) = '' THEN
			financieras.total_ingresos := 0;
		END IF;

		IF rtrim(financieras.total_gastos) = '' THEN
			financieras.total_gastos := 0;
		END IF;

		IF rtrim(financieras.total_gastos_operativos) = '' THEN
			financieras.total_gastos_operativos := 0;
		END IF;

		IF rtrim(financieras.capital) = '' THEN
			financieras.capital := 0;
		END IF;

		INSERT INTO seprec.informaciones_financieras (
			fecha_creacion,
			usuario_creacion,
			fecha_actualizacion,
			usuario_actualizacion,
			accion,
			estado,
			gestion,
			activos_corrientes,
			activos_fijos,
			valoracion_activos,
			otros_activos,
			activos_brutos,
			activos_netos,
			pasivos_corrientes,
			obligaciones_largo_plazo,
			total_pasivos,
			patrimonio_liquido,
			pasivo_mas_patrimonio,
			ventas_netas,
			costo_ventas,
			utilidad_operacional,
			utilidad_bruta,
			cod_tipo_moneda,
			fecha_balance,
			gestion_balance,
			mes_cierre_gestion,
			libro_registro_balance,
			numero_registro_balance,
			activo_disponible,
			activo_exigible,
			activo_realizable,
			otros_activos_corrientes,
			activos_no_corrientes,
			pasivos_no_corrientes,
			patrimonio,
			resultado_inscripcion,
			total_ingresos,
			total_gastos,
			total_gastos_operativos,
			capital,
			fecha_inicio_balance,
			fecha_fin_balance,
			id_empresa
		)
		VALUES(
			coalesce (financieras.fecha_creacion, now()),
			financieras.autor_creacion,
			financieras.fecha_ultima_actualizacion,
			financieras.autor_ultima_actualizacion,
			'MIGRACION',
			'PENDIENTE',
			financieras.gestion_datos::numeric,
			financieras.activos_corrientes::numeric,
			financieras.activos_fijos::numeric,
			financieras.valoracion_activos::numeric,
			financieras.otros_activos::numeric,
			financieras.activos_brutos::numeric,
			financieras.activos_netos::numeric,
			financieras.pasivos_corrientes::numeric,
			financieras.obligaciones_largo_plazo::numeric,
			financieras.total_pasivos::numeric,
			financieras.patrimonio_liquido::numeric,
			financieras.pasivo_mas_patrimonio::numeric,
			financieras.ventas_netas::numeric,
			financieras.costo_ventas::numeric,
			financieras.utilidad_operacional::numeric,
			financieras.utilidad_bruta::numeric,
			financieras.moneda_datos,
			financieras.fecha_balance,
			financieras.gestion_balance::numeric,
			coalesce (extract(MONTH FROM financieras.fecha_cierre), 0),
			financieras.libro_registro_balance,
			financieras.numero_registro_balance,
			financieras.activo_disponible::numeric,
			financieras.activo_exigible::numeric,
			financieras.activo_realizable::numeric,
			financieras.otros_activos_corriente::numeric,
			financieras.activos_no_corrientes::numeric,
			financieras.pasivos_no_corrientes::numeric,
			financieras.patrimonio::numeric,
			financieras.resultado_inscripcion::numeric,
			financieras.total_ingresos::numeric,
			financieras.total_gastos::numeric,
			financieras.total_gastos_operativos::numeric,
			financieras.capital::numeric,
			financieras.fecha_inicio_balance,
			financieras.fecha_fin_balance,
			idEmpresa
		);
  	END LOOP;
END;
$$
LANGUAGE 'plpgsql';

--------------------------------------------------
CREATE OR REPLACE PROCEDURE seprec.migrar_informacion_financiera_v1() AS $$
DECLARE
    empresa seprec.empresas%ROWTYPE;
	contador INTEGER = 0;
    tiempo timestamptz;
BEGIN
	tiempo := now();
  	raise notice 'FECHA INICIO MIGRACION INFORMACION FINANCIERA V1 %', tiempo;
    FOR empresa IN SELECT * FROM seprec.empresas ORDER BY id LOOP
				CALL seprec.registrar_informacion_financiera_v1(empresa.id, empresa.matricula_anterior);
		contador := contador + 1 ;
		IF contador = 10000 THEN
        	COMMIT;
        	contador := 0;
      	END IF;
    END LOOP;
	  raise notice 'FECHA FIN MIGRACION INFORMACION FINANCIERA V1 %', now() - tiempo;
    COMMIT;
END;
$$
LANGUAGE plpgsql;

-------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE seprec.registrar_informacion_financiera_v2(idEmpresa NUMERIC, matriculaId VARCHAR) AS $$
DECLARE
	financieras migsrc.migsrc_emp_informacion_financiera%ROWTYPE;
BEGIN
	SET datestyle = dmy;
	FOR financieras IN SELECT * FROM migsrc.migsrc_emp_informacion_financiera WHERE matricula_id = matriculaId LOOP

		IF rtrim(financieras.gestion_datos) = '' THEN
			financieras.gestion_datos := 0;
		END IF;

		IF rtrim(financieras.gestion_datos) LIKE 'I%' THEN
			financieras.gestion_datos := replace(financieras.gestion_datos,'I','2');
		END IF;

		IF NOT seprec.isnumeric(financieras.gestion_datos) THEN
			financieras.gestion_datos := 0;
		END IF;

		IF rtrim(financieras.activos_corrientes) = '' THEN
			financieras.activos_corrientes := 0;
		END IF;

		IF rtrim(financieras.activos_fijos) = '' THEN
			financieras.activos_fijos := 0;
		END IF;

		IF rtrim(financieras.valoracion_activos) = '' THEN
			financieras.valoracion_activos := 0;
		END IF;

		IF rtrim(financieras.otros_activos) = '' THEN
			financieras.otros_activos := 0;
		END IF;

		IF rtrim(financieras.activos_brutos) = '' THEN
			financieras.activos_brutos := 0;
		END IF;

		IF rtrim(financieras.activos_netos) = '' THEN
			financieras.activos_netos := 0;
		END IF;

		IF rtrim(financieras.pasivos_corrientes) = '' THEN
			financieras.pasivos_corrientes := 0;
		END IF;

		IF rtrim(financieras.obligaciones_largo_plazo) = '' THEN
			financieras.obligaciones_largo_plazo := 0;
		END IF;

		IF rtrim(financieras.total_pasivos) = '' THEN
			financieras.total_pasivos := 0;
		END IF;

		IF rtrim(financieras.patrimonio_liquido) = '' THEN
			financieras.patrimonio_liquido := 0;
		END IF;

		IF rtrim(financieras.pasivo_mas_patrimonio) = '' THEN
			financieras.pasivo_mas_patrimonio := 0;
		END IF;

		IF rtrim(financieras.ventas_netas) = '' THEN
			financieras.ventas_netas := 0;
		END IF;

		IF rtrim(financieras.costo_ventas) = '' THEN
			financieras.costo_ventas := 0;
		END IF;

		IF rtrim(financieras.utilidad_operacional) = '' THEN
			financieras.utilidad_operacional := 0;
		END IF;

		IF rtrim(financieras.utilidad_bruta) = '' THEN
			financieras.utilidad_bruta := 0;
		END IF;

		IF rtrim(financieras.moneda_datos) = '' THEN
			financieras.moneda_datos := 0;
		END IF;

		IF rtrim(financieras.gestion_balance) = '' THEN
			financieras.gestion_balance := 0;
		END IF;

		IF rtrim(financieras.gestion_balance) like 'I%' THEN
			financieras.gestion_balance := replace(financieras.gestion_balance,'I','2');
		END IF;

		IF not seprec.isnumeric(financieras.gestion_balance) THEN
			financieras.gestion_balance := 0;
		END IF;

		IF rtrim(financieras.activo_disponible) = '' THEN
			financieras.activo_disponible := 0;
		END IF;

		IF rtrim(financieras.activo_exigible) = '' THEN
			financieras.activo_exigible := 0;
		END IF;

		IF rtrim(financieras.activo_realizable) = '' THEN
			financieras.activo_realizable := 0;
		END IF;

		IF rtrim(financieras.otros_activos_corriente) = '' THEN
			financieras.otros_activos_corriente := 0;
		END IF;

		IF rtrim(financieras.activos_no_corrientes) = '' THEN
			financieras.activos_no_corrientes := 0;
		END IF;

		IF rtrim(financieras.pasivos_no_corrientes) = '' THEN
			financieras.pasivos_no_corrientes := 0;
		END IF;

		IF rtrim(financieras.patrimonio) = '' THEN
			financieras.patrimonio := 0;
		END IF;

		IF rtrim(financieras.resultado_inscripcion) = '' THEN
			financieras.resultado_inscripcion := 0;
		END IF;

		IF rtrim(financieras.total_ingresos) = '' THEN
			financieras.total_ingresos := 0;
		END IF;

		IF rtrim(financieras.total_gastos) = '' THEN
			financieras.total_gastos := 0;
		END IF;

		IF rtrim(financieras.total_gastos_operativos) = '' THEN
			financieras.total_gastos_operativos := 0;
		END IF;

		IF rtrim(financieras.capital) = '' THEN
			financieras.capital := 0;
		END IF;

		INSERT INTO seprec.informaciones_financieras (
			fecha_creacion,
			usuario_creacion,
			fecha_actualizacion,
			usuario_actualizacion,
			accion,
			estado,
			gestion,
			activos_corrientes,
			activos_fijos,
			valoracion_activos,
			otros_activos,
			activos_brutos,
			activos_netos,
			pasivos_corrientes,
			obligaciones_largo_plazo,
			total_pasivos,
			patrimonio_liquido,
			pasivo_mas_patrimonio,
			ventas_netas,
			costo_ventas,
			utilidad_operacional,
			utilidad_bruta,
			cod_tipo_moneda,
			fecha_balance,
			gestion_balance,
			mes_cierre_gestion,
			libro_registro_balance,
			numero_registro_balance,
			activo_disponible,
			activo_exigible,
			activo_realizable,
			otros_activos_corrientes,
			activos_no_corrientes,
			pasivos_no_corrientes,
			patrimonio,
			resultado_inscripcion,
			total_ingresos,
			total_gastos,
			total_gastos_operativos,
			capital,
			fecha_inicio_balance,
			fecha_fin_balance,
			id_empresa
		)
		VALUES(
			coalesce (financieras.fecha_creacion, now()),
			financieras.autor_creacion,
			financieras.fecha_ultima_actualizacion,
			financieras.autor_ultima_actualizacion,
			'MIGRACION',
			'PENDIENTE',
			financieras.gestion_datos::numeric,
			financieras.activos_corrientes::numeric,
			financieras.activos_fijos::numeric,
			financieras.valoracion_activos::numeric,
			financieras.otros_activos::numeric,
			financieras.activos_brutos::numeric,
			financieras.activos_netos::numeric,
			financieras.pasivos_corrientes::numeric,
			financieras.obligaciones_largo_plazo::numeric,
			financieras.total_pasivos::numeric,
			financieras.patrimonio_liquido::numeric,
			financieras.pasivo_mas_patrimonio::numeric,
			financieras.ventas_netas::numeric,
			financieras.costo_ventas::numeric,
			financieras.utilidad_operacional::numeric,
			financieras.utilidad_bruta::numeric,
			financieras.moneda_datos,
			financieras.fecha_balance,
			financieras.gestion_balance::numeric,
			coalesce (extract(MONTH FROM financieras.fecha_cierre), 0),
			financieras.libro_registro_balance,
			financieras.numero_registro_balance,
			financieras.activo_disponible::numeric,
			financieras.activo_exigible::numeric,
			financieras.activo_realizable::numeric,
			financieras.otros_activos_corriente::numeric,
			financieras.activos_no_corrientes::numeric,
			financieras.pasivos_no_corrientes::numeric,
			financieras.patrimonio::numeric,
			financieras.resultado_inscripcion::numeric,
			financieras.total_ingresos::numeric,
			financieras.total_gastos::numeric,
			financieras.total_gastos_operativos::numeric,
			financieras.capital::numeric,
			financieras.fecha_inicio_balance,
			financieras.fecha_fin_balance,
			idEmpresa
		);
  	END LOOP;
END;
$$
LANGUAGE 'plpgsql';

--------------------------------------------------
CREATE OR REPLACE PROCEDURE seprec.migrar_informacion_financiera_v2() AS $$
DECLARE
    empresa seprec.empresas%ROWTYPE;
	contador INTEGER = 0;
    tiempo timestamptz;
BEGIN
	tiempo := now();
  	RAISE NOTICE 'FECHA INICIO MIGRACION INFORMACION FINANCIERA V2 %', tiempo;
    FOR empresa IN SELECT * FROM seprec.empresas ORDER BY id LOOP
		RAISE NOTICE 'ID EMPRESA ---> % - MATRICULA ---> % ', empresa.id, empresa.matricula_anterior;
		CALL seprec.registrar_informacion_financiera_v2(empresa.id, empresa.matricula_anterior);
		contador := contador + 1 ;
		IF contador = 10000 THEN
        	COMMIT;
        	contador := 0;
      	END IF;
    END LOOP;
	RAISE NOTICE 'FECHA FIN MIGRACION INFORMACION FINANCIERA V2 %', now() - tiempo;
    COMMIT;
END;
$$
LANGUAGE plpgsql;