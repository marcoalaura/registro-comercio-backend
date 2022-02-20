import { MigrationInterface, QueryRunner } from "typeorm";

import { Seccion } from "src/application/tramite/entities/parametricas/seccion.entity"; 

import { Status } from 'src/common/constants/index';
import { Grupo } from "src/application/tramite/entities/parametricas/grupo.entity";

export class Seccion1643292407928 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                id: 1,
                nombre: 'datos generales de la empresa',
                descripcion: 'datos generales de la empresa',
                orden: 1,
                grupo: 1
            },
            {
                id: 2,
                nombre: 'actividades economicas',
                descripcion: 'actividades economicas',
                orden: 2,
                grupo: 1
            },
            {
                id: 3,
                nombre: 'datos de identificacion',
                descripcion: 'datos de identificacion',
                orden: 1,
                grupo: 2
            },
            {
                id: 4,
                nombre: 'datos personales',
                descripcion: 'datos personales',
                orden: 2,
                grupo: 2
            },
            {
                id: 5,
                nombre: 'cargado de docuemtnos',
                descripcion: 'cargado de docuemtnos',
                orden: 2,
                grupo: 3
            },

            {
                id: 71,
                nombre: 'CAMBIO DE CORREO ELECTRÓNICO',
                descripcion: '',
                orden: 1,
                grupo: 71
            },
            {
                id: 72,
                nombre: 'CAMBIO DE TELÉFONO',
                descripcion: '',
                orden: 2,
                grupo: 71
            },
            {
                id: 73,
                nombre: 'CAMBIO DE DIRECCIÓN',
                descripcion: 'La realización del cambio operativo de dirección dará curso a la publicación del Registro de Comercio ',
                orden: 3,
                grupo: 71
            },
        ];
        const data = items.map((item) => {
            const e = new Seccion();
            e.fechaCreacion = new Date();
            e.usuarioCreacion = 'SEEDER'
            e.estado = Status.ACTIVE;
            e.nombre = item.nombre;
            e.orden = item.orden;
            e.descripcion = item.descripcion;
            e.id = item.id;
            const g = new Grupo(); g.id = item.grupo;
            e.grupo = g;
            return e;
        });
        await queryRunner.manager.save(data);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
