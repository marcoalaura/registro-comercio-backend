# GUIA MARCADO DE CASOS Y HABILITACIÓN AUTOMATICA CASOS 1A Y 1B

## 1 Crear los procedimiento para marcar empresas unipersonales casos 1A o 1B

```bash
cd scripts/02-marcado-casos-unipersonales
```

## 2 Crear los procedimiento para marcar empresas unipersonales casos 1A o 1B

```bash
marcado_casos_unipersonales.sql
```
comando ejemplo de ejecución
```bash
psql -h localhost -U postgres -W -d seprec_db -f marcado_casos_unipersonales.sql
```

## 3 Ejecutar Procedimientos para marcar a los unipersonales dentro de la consola de base de datos.

```sql
call seprec.marcado_casos_unipersonales();
```

---
**NOTA**

Para está versión de habilitación de empresas se esta usando servicios fake del **SERVICIO DE IMPUESTOS NACIONALES - SIN** debe verficar si este servicio fake esta levantado, para levantarlo ver el siguiente [enlace](../../fake-services/README.md).

---

## 4 Ejecutar el script de marcado para empresas que son sociedades comerciales y la habilitación automática para los casos 1A y 1B

```bash
npm run seeds:run-marcado-habilitacion
```