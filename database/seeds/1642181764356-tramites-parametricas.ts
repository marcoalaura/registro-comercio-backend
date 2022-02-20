import {MigrationInterface, QueryRunner} from "typeorm";

import { Parametrica } from 'src/application/tramite/entities/parametricas/parametrica.entity';
import { ParametricaCategoria } from 'src/application/tramite/entities/parametricas/parametrica-categoria.entity';

import { TramiteParametricaTipo, TramiteParametricaTipoCatalogo } from 'src/common/constants/index';

export class tramitesParametricas1642181764356 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                id: 1,
                nombre: 'Inscripción de Comerciante Individual o Empresa Unipersonal',
                codigo: '5',
                costo: 5,
                duracion: 48,
                dato: {},
                categoria: 6,
                requierPago: true,
                requierePresentacion: true,
                requiereRevision: true,
                requierePublicacion: true,
                emiteCertificado: true,
                api: '/tramites/inscripcion/individual-unipersonal',
                rutaFront: 'InscripcionIndividualUnipersonal',
            },
            {
                id: 2,
                nombre: 'Actualización de Matrícula de Comercio',
                codigo: '10',
                costo: 10,
                duracion: 10,
                dato: {},
                categoria: 1,
                requierPago: true,
                requierePresentacion: true,
                requiereRevision: true,
                requierePublicacion: true,
                emiteCertificado: true,
                requiereRegistrarEditarSeccion: false,
                rutaFront: 'Formularios',
            },
            {
                id: 3,
                nombre: 'Aumento de Capital',
                codigo: '15',
                costo: 5,
                duracion: 0,
                dato: {},
                categoria: 2,
                requierPago: true,
                requierePresentacion: true,
                requiereRevision: true,
                requierePublicacion: true,
                emiteCertificado: true
            },
            {
                id: 4,
                nombre: 'Disminución de Capital',
                codigo: '16',
                costo: 5,
                duracion: 0,
                dato: {},
                categoria: 2,
                requierPago: true,
                requierePresentacion: true,
                requiereRevision: true,
                requierePublicacion: true,
                emiteCertificado: true
            },
            {
                id: 5,
                nombre: 'Apertura de sucursal de sociedad comercial y empresa unipersonal constituidas en Bolivia / Apertura de agencia de entidad financiera',
                codigo: '19',
                costo: 100,
                duracion: 48,
                dato: {},
                categoria: 2,
                requierPago: true,
                requierePresentacion: true,
                requiereRevision: true,
                requierePublicacion: true,
                emiteCertificado: true
            },
            {
                id: 6,
                nombre: 'Cancelación de matrícula de comercio de empresa unipsersonal o comerciante individual',
                codigo: '40',
                costo: 10,
                duracion: 10,
                dato: {},
                categoria: 3,
                requierPago: true,
                requierePresentacion: true,
                requiereRevision: true,
                requierePublicacion: true,
                emiteCertificado: true
            },
            {
                id: 7,
                nombre: 'Cambios operativos de sociedad comercial o empresa unipersona',
                codigo: '41',
                costo: 0,
                duracion: 10,
                dato: {},
                categoria: 4,
                requierPago: true,
                requierePresentacion: true,
                requiereRevision: true,
                requierePublicacion: true,
                emiteCertificado: true,
                rutaFront: 'FormularioPlegable',
                preRutaFront: 'SeleccionaEstablecimiento',
                requiereRegistrarEditarSeccion: true,
                metodoObtenerInformacion: 'obtenerInformacionDireccionContacto'
            },
            {
                id: 8,
                nombre: 'Certificado de registro de documento',
                codigo: '51',
                costo: 10,
                duracion: 10,
                dato: {},
                categoria: 5,
                requierPago: true,
                requierePresentacion: true,
                requiereRevision: true,
                requierePublicacion: true,
                emiteCertificado: true
            }
        ];
        const parametricas = items.map((item) => {
            const pc = new ParametricaCategoria();
            pc.id = item.categoria;

            const p = new Parametrica();
            p.fechaCreacion = new Date();
            p.usuarioCreacion = 'Sedder';
            p.nombre = item.nombre;
            p.codigo = item.codigo;
            //p.costo = item.costo;
            //p.dato = item.dato;
            p.duracion = item.duracion;
            //p.dato = item.dato;
            p.tipo = TramiteParametricaTipo.EN_LINEA;
            p.tipoCatalogo = TramiteParametricaTipoCatalogo.TRAMITE;
            p.version = '1';
            p.requierePago = item.requierPago;
            p.requierePresentacion = item.requierePresentacion;
            p.requiereRevision = item.requiereRevision;
            p.requierePublicacion = item.requierePublicacion;
            p.emiteCertificado = item.emiteCertificado;
            p.requiereRegistrarEditarSeccion = item.requiereRegistrarEditarSeccion;
            p.metodoObtenerInformacion = item.metodoObtenerInformacion;
            p.parametricaCategoria = pc;
            p.api = item.api;
            p.id = item.id;
            p.rutaFront = item.rutaFront ? item.rutaFront : null;
            p.preRutaFront = item.preRutaFront ? item.preRutaFront : null;
            return p;
          });
          await queryRunner.manager.save(parametricas);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
