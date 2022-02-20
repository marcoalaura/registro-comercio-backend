import { MigrationInterface, QueryRunner } from "typeorm";

import { ParametricaCategoria } from 'src/application/tramite/entities/parametricas/parametrica-categoria.entity'

import { Status, TramiteParametricaTipoCatalogo } from 'src/common/constants/index';

export class tramitesParametricasCategorias1642178154378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                id: 1,
                nombre: 'ACTUALIZACIÓN DE MATRICULA',
                orden: 1,
            },
            {
                id: 2,
                nombre: 'ACTIVIDADES DE MODIFICACIÓN',
                orden: 2
            },
            {
                id: 3,
                nombre: 'FIN DE ACTIVIDADES',
                orden: 3
            },
            {
                id: 4,
                nombre: 'CAMBIOS OPERATIVOS',
                orden: 4
            },
            {
                id: 5,
                nombre: 'CERTIFICADOS',
                orden: 5
            },
            {
                id: 6,
                nombre: 'INSCRIPCIÓN',
                orden: 6
            }
        ];
        const tramitesParametricasCategorias = items.map((item) => {
            const pc = new ParametricaCategoria();
            pc.fechaCreacion = new Date();
            pc.usuarioCreacion = 'SEEDER';
            pc.tipoCatalogo = TramiteParametricaTipoCatalogo.TRAMITE;
            pc.estado = Status.ACTIVE;
            pc.nombre = item.nombre;
            pc.orden = item.orden;
            pc.id = item.id;
            return pc;
        });
        await queryRunner.manager.save(tramitesParametricasCategorias);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
