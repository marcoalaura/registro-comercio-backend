import { MigrationInterface, QueryRunner } from "typeorm";

import { Seccion } from "src/application/tramite/entities/parametricas/seccion.entity"; 

import { Status } from 'src/common/constants/index';
import { Grupo } from "src/application/tramite/entities/parametricas/grupo.entity";

export class PublicacionesFormSeccion1644416701663 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                id: 1001,
                nombre: 'Datos de la convocatoria',
                descripcion: '',
                orden: 1,
                grupo: 1001
            },
            {
                id: 1002,
                nombre: 'Vista previa de la publicación',
                descripcion: '',
                orden: 2,
                grupo: 1001
            },
            {
                id: 1003,
                nombre: 'Datos del sorteo',
                descripcion: '',
                orden: 1,
                grupo: 1002
            },
            {
                id: 1004,
                nombre: 'Vista previa de la publicación',
                descripcion: '',
                orden: 2,
                grupo: 1002
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
