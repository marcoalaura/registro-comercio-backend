import { MigrationInterface, QueryRunner } from "typeorm";

import { Grupo } from "src/application/tramite/entities/parametricas/grupo.entity";
import { Parametrica } from "src/application/tramite/entities/parametricas/parametrica.entity";

import { Status } from 'src/common/constants/index';

export class Grupo1643292407927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                id: 1,
                nombre: 'Datos de la empresa',
                descripcion: 'Datos de la empresa',
                flujo: 'PRIMERO',
                orden: 1,
                documentoSoporte: false,
                aprobacionDocumentos: false,
                pago: false,
                catalogoTramite: 2
            },
            {
                id: 2,
                nombre: 'Datos del propietario',
                descripcion: 'Datos del propietario',
                flujo: 'MEDIO',
                orden: 2,
                documentoSoporte: false,
                aprobacionDocumentos: false,
                pago: false,
                catalogoTramite: 2
            },
            {
                id: 3,
                nombre: 'Documentos soporte',
                descripcion: 'Documentos soporte',
                flujo: 'MEDIO',
                orden: 3,
                documentoSoporte: true,
                aprobacionDocumentos: false,
                pago: false,
                catalogoTramite: 2
            },
            {
                id: 4,
                nombre: 'Revision y aprobacion',
                descripcion: 'Revision y aprobacion',
                flujo: 'MEDIO',
                orden: 4,
                documentoSoporte: false,
                aprobacionDocumentos: true,
                pago: false,
                catalogoTramite: 2
            },
            {
                id: 5,
                nombre: 'Solicitar pago',
                descripcion: 'Solicitar pago',
                flujo: 'ULTIMO',
                orden: 5,
                documentoSoporte: false,
                aprobacionDocumentos: false,
                pago: true,
                catalogoTramite: 2
            },
            {
                id: 71,
                nombre: 'Registro de datos',
                descripcion: 'Los campos marcados con (*) son de llenado obligatorio',
                flujo: 'PRIMERO',
                orden: 1,
                documentoSoporte: false,
                aprobacionDocumentos: false,
                pago: false,
                catalogoTramite: 7
            },
            {
                id: 72,
                nombre: 'Revisión y aprobación',
                descripcion: 'Verificar los cambios efectuados',
                flujo: 'MEDIO',
                orden: 2,
                documentoSoporte: false,
                aprobacionDocumentos: true,
                pago: false,
                catalogoTramite: 7
            },
            {
                id: 73,
                nombre: 'Pago de solicitud',
                descripcion: 'Para procesar el trámite se requiere el siguiente pago',
                flujo: 'ULTIMO',
                orden: 3,
                documentoSoporte: false,
                aprobacionDocumentos: false,
                pago: true,
                catalogoTramite: 7
            }
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
