import { MigrationInterface, QueryRunner } from "typeorm";

import { Grupo } from "src/application/tramite/entities/parametricas/grupo.entity";
import { Parametrica } from "src/application/tramite/entities/parametricas/parametrica.entity";

import { Status } from 'src/common/constants/index';

export class PublicacionesFormGrupo1644416701662 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                id: 1001,
                nombre: 'Convocatoria a Asamblea',
                descripcion: 'descripción de convocatoria a asamblea',
                flujo: 'UNICO',
                orden: 1,
                documentoSoporte: false,
                aprobacionDocumentos: false,
                pago: true,
                catalogoTramite: 1016
            },
            {
                id: 1002,
                nombre: 'Resultado del Sorteo de Títulos Valores',
                descripcion: 'En esta sección podrás publicar el resultado de sorteo de títulos y valores',
                flujo: 'UNICO',
                orden: 1,
                documentoSoporte: false,
                aprobacionDocumentos: false,
                pago: true,
                catalogoTramite: 1017
            },
        ];
        const data = items.map((item) => {
            const e = new Grupo();
            e.fechaCreacion = new Date();
            e.usuarioCreacion = 'SEEDER'
            e.estado = Status.ACTIVE;
            e.nombre = item.nombre;
            e.orden = item.orden;
            e.flujo = item.flujo;
            e.documentoSoporte = item.documentoSoporte;
            e.aprobacionDocumentos = item.aprobacionDocumentos;
            e.pago = item.pago;
            e.descripcion = item.descripcion;
            const ct = new Parametrica(); ct.id = item.catalogoTramite;
            e.catalogoTramite = ct;
            e.id = item.id;
            return e;
        });
        await queryRunner.manager.save(data);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
