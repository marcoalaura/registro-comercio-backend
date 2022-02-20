# Guia para el Marcado de Casos V0.1.0 (solo unipersonales)


## 1 Crear los procedimientos

```bash
marcado_casos_unipersonales.sql
```
comando ejemplo de ejecución
```bash
psql -h localhost -U postgres -W -d seprec_db -f marcado_casos_unipersonales.sql
```

## 2 Ejecutar Procedimientos para marcar a los unipersonales

```sql
call seprec.marcado_casos_unipersonales();
```