CREATE OR REPLACE PROCEDURE seprec.marcado_casos_unipersonales()
AS $$
declare
	id_empresa int;
    id_establecimiento int;
    matricula varchar;
    contador int := 0;
begin
	-- Caso 1A 
    update seprec.empresas set escenario='1A' where id in (select distinct e.id as id_empresa
														     from seprec.empresas e inner join seprec.establecimientos es on e.id = es.id_empresa
														 		    			    inner join SEPREC.vinculados v on es.id = v.id_establecimiento 
														    where es.cod_tipo_establecimiento = '1'
															  and e.cod_tipo_persona = '01'
															  and e.estado = 'PENDIENTE'
															  and v.id_persona in (select id_persona
																				    from (select id_persona,
																								 tipo_documento,
																								 nro_documento,
																								 count (1) as cantidad
																						    from (select distinct e.id as id_empresa,
																										 es.id as id_establecimiento,
																										 e.matricula_anterior,
																										 p.id as id_persona,
																										 p.tipo_documento,
																										 p.nro_documento
																								    from seprec.empresas e inner join seprec.establecimientos es on e.id = es.id_empresa
																											               inner join SEPREC.vinculados v on es.id = v.id_establecimiento 
																														   inner join seprec.personas p on p.id = v.id_persona 
																								   where es.cod_tipo_establecimiento = '1'
																									 and e.cod_tipo_persona = '01'
																									 and e.estado = 'PENDIENTE'
																									 and v.cod_tipo_vinculo in ('3130','3131','2172','2176','2170')) t
																							    group by id_persona, tipo_documento, nro_documento
																							    order by count(1) desc) t2
																				   where cantidad = 1));
   
    -- Caso 1B
	update seprec.empresas set escenario='1B' where id in (select distinct e.id as id_empresa
															 from seprec.empresas e inner join seprec.establecimientos es on e.id = es.id_empresa
																					inner join SEPREC.vinculados v on es.id = v.id_establecimiento 
															where es.cod_tipo_establecimiento = '1'
															  and e.cod_tipo_persona = '01'
															  and e.estado = 'PENDIENTE'
															  and v.id_persona in (select id_persona
																					 from (select id_persona,
																								  tipo_documento,
																								  nro_documento,
																								  count (1) as cantidad
																							 from (select distinct e.id as id_empresa,
																										  es.id as id_establecimiento,
																										  e.matricula_anterior,
																										  p.id as id_persona,
																										  p.tipo_documento,
																										  p.nro_documento
																									 from seprec.empresas e inner join seprec.establecimientos es on e.id = es.id_empresa
																															inner join SEPREC.vinculados v on es.id = v.id_establecimiento 
																															inner join seprec.personas p on p.id = v.id_persona 
																									where es.cod_tipo_establecimiento = '1'
																									  and e.cod_tipo_persona = '01'
																									  and e.estado = 'PENDIENTE'
																									  and v.cod_tipo_vinculo in ('3130','3131','2172','2176','2170')) t
																								 group by id_persona, tipo_documento, nro_documento
																								 order by count(1) desc) t2
																					where cantidad > 1));
END;
$$
LANGUAGE plpgsql;
