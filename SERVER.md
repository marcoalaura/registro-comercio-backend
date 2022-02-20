# Instalación del servidor

## Requerimientos

Para continuar con la instalación del proyecto se necesita contar con las siguientes instalaciones ya realizadas, se recomienda revisar la documentación oficial:

1. [Postgres](https://www.postgresql.org/download/linux/debian/)
2. [Node y Npm](https://github.com/nodesource/distributions/blob/master/README.md)
3. [NVM](https://github.com/nvm-sh/nvm) Se recomienda NVM solo para ambientes de DESARROLLO.
4. [Manejador de procesos PM2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

## Requerimientos del Servidor y Software Base

Instalación realizada en Debian 10, para otros sistemas operativos puede varias los comandos.

> Es necesario que la configuración regional `locale` este correctamente configurado como `es_BO.UTF-8`.

> Es necesario que el servidor tenga correctamente configurado los [repositorios](http://repositorio.agetic.gob.bo/).

### Instalar dependencias

Instalar las aplicaciones `git`, `curl`, `wget`

```
$ sudo apt install git curl wget
```

Instalar las liberias para generación de archivos en formato pdf (wkhtmltopdf).

```
sudo apt-get install xvfb libfontconfig wkhtmltopdf
```


### Instalar NodeJS

Entorno en tiempo de ejecución.

Puede seguir una de las siguientes opciones

1. (Opcion 1) Instalar repositorio nodesource e instalar nodejs 14:

```
$ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

2. (Opcion 2) Instalar manejador de versiones para node e instalar la version 14

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
$ export NVM_DIR="$HOME/.nvm"
$ [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
$ [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

```
$ nvm install v14.16.1
```

3. Para verificar que nodejs y npm estan instalados, los siguientes comandos deben devolver las versiones de node (> 14.x.x) y npm (> 6.x.x):

```
$ node --version
$ npm --version
```

### Instalar PostgreSQL

Gestor de base datos.

```
$ sudo apt install postgresql postgresql-contrib
```

Verificar que el estilo de fecha y timezone esten correctamente configurados

```
$ sudo nano /etc/postgresql/11/main/postgresql.conf
# - Locale and Formatting -
datestyle = 'iso, dmy'
timezone = 'America/La_Paz'

$ sudo service postgresql restart
```

Crear una base datos para la aplicación

```
$ sudo su postgres

$ psql
psql (11.11 (Debian 11.11-0+deb10u1))
Type "help" for help.

postgres=# CREATE USER usuario WITH PASSWORD 'usuario';
postgres=# CREATE DATABASE seprec_db OWNER usuario LC_COLLATE 'es_BO.UTF-8' LC_CTYPE 'es_BO.UTF-8' TEMPLATE template0;

postgres=# \l
     Name     |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges
--------------+----------+----------+-------------+-------------+-----------------------
 seprec_db | usuario  | UTF8     | es_BO.UTF-8 | es_BO.UTF-8 |

```

### Instalar PM2

Manejador de procesos para entorno de producción.

```
$ npm install -g pm2
```

