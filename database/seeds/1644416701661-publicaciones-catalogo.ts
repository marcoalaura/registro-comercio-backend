import {MigrationInterface, QueryRunner} from "typeorm";

import { Parametrica } from 'src/application/tramite/entities/parametricas/parametrica.entity';
import { ParametricaCategoria } from 'src/application/tramite/entities/parametricas/parametrica-categoria.entity';

import { TramiteParametricaTipo, TramiteParametricaTipoCatalogo } from 'src/common/constants/index';

export class publicacionesCatalogo1644416701661 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            // instrumentos
            {
                id: 1001,
                nombre: 'Constitución de Sociedad Comercial S.R.L., Sociedad Colectiva o Sociedad en Comandita Simple',
                codigo: '1003',
                categoria: 1001,
                tipoSocietarioHabilitado: ['04', '03', '05'],
                tipoTramiteHabilitado: ['1'],
            },
            {
                id: 1002,
                nombre: 'Constitución de Sociedad Comercial S.A., Sociedad en Comandita por Acciones Constituidas por Acto Único o por Suscripción Pública de Acciones',
                codigo: '1002',
                categoria: 1001,
                tipoSocietarioHabilitado: ['07', '06'],
                tipoTramiteHabilitado: ['2'],
            },
            {
                id: 1003,
                nombre: 'Constitución de Sociedad de Economía Mixta',
                codigo: '1005',
                categoria: 1001,
                tipoSocietarioHabilitado: ['07'],
                tipoTramiteHabilitado: ['3', '4'],
            },
            {
                id: 1004,
                nombre: 'Constitución de Sociedad Constituida en el Extranjero',
                codigo: '1004',
                categoria: 1001,
                tipoSocietarioHabilitado: ['07'],
                tipoTramiteHabilitado: ['9'],
            },
            {
                id: 1005,
                nombre: 'Transformación',
                codigo: '1012',
                categoria: 1001,
                tipoSocietarioHabilitado: ['01', '07', '04'],
                tipoTramiteHabilitado: ['11'],
            },
            {
                id: 1006,
                nombre: 'Fusión de Sociedades',
                codigo: '1008',
                categoria: 1001,
                tipoSocietarioHabilitado: ['01', '07', '04'],
                tipoTramiteHabilitado: ['12'],
            },
            {
                id: 1007,
                nombre: 'Escisión',
                codigo: '1007',
                categoria: 1001,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: ['13'],
            },
            {
                id: 1008,
                nombre: 'Modificación, Aclaración y/o Complementación de la Constitución de Sociedad Comercial',
                codigo: '1009',
                categoria: 1001,
                tipoSocietarioHabilitado: ['01', '07', '04'],
                tipoTramiteHabilitado: ['14'],
            },
            {
                id: 1009,
                nombre: 'Aumento de Capital Social',
                codigo: '1001',
                categoria: 1001,
                tipoSocietarioHabilitado: ['01', '07', '04'],
                tipoTramiteHabilitado: ['15'],
            },
            {
                id: 1010,
                nombre: 'Reducción de Capital Social',
                codigo: '1010',
                categoria: 1001,
                tipoSocietarioHabilitado: ['01', '07', '04'],
                tipoTramiteHabilitado: ['16'],
            },
            {
                id: 1011,
                nombre: 'Transferencia de Cuotas de Capital',
                codigo: '1020',
                categoria: 1001,
                tipoSocietarioHabilitado: ['01', '07', '04'],
                tipoTramiteHabilitado: ['17'],
            },
            {
                id: 1012,
                nombre: 'Disolución y Liquidación de Sociedad Comercial',
                codigo: '1019',
                categoria: 1001,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: ['41', '42', '43'],
            },
            {
                id: 1013,
                nombre: 'Cierre de Sucursal o Representación Permanente de Sociedad Extranjera',
                codigo: '1013',
                categoria: 1001,
                tipoSocietarioHabilitado: ['01', '07', '04'],
                tipoTramiteHabilitado: ['44'],
            },
            // convocatorias y avisos
            {
                id: 1014,
                nombre: 'Notificación de Cambio de Dirección',
                codigo: '2002',
                categoria: 1002,
                tipoSocietarioHabilitado: ['01', '07', '04'],
                tipoTramiteHabilitado: ['10', '46'],
            },
            {
                id: 1015,
                nombre: 'Transferencia de Empresa',
                codigo: '2006',
                categoria: 1002,
                tipoSocietarioHabilitado: ['01'],
                tipoTramiteHabilitado: ['18'],
            },
            {
                id: 1016,
                nombre: 'Convocatoria a Asamblea/Junta General',
                codigo: '2001',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1017,
                nombre: 'Resultado del Sorteo de Títulos Valores',
                codigo: '2005',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1018,
                nombre: 'Reposición de Títulos Nominativos',
                codigo: '2004',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1019,
                nombre: 'Cancelación Anticipada de Títulos',
                codigo: '2000',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1020,
                nombre: 'Ofrecimiento de Acciones para Ejercicio de Derecho Preferente',
                codigo: '2007',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            /* {
                id: 1021,
                nombre: 'Resolución que Admita el Procedimiento del Concurso Preventivo o Resolución que Declare la Quiebra de una Sociedad Comercial',
                codigo: '2011',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1022,
                nombre: 'Edicto de Apertura de Procedimiento de Concurso Preventivo',
                codigo: '2008',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1023,
                nombre: 'Edicto del Auto de Quiebra',
                codigo: '2009',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1024,
                nombre: 'Reapertura de Quiebr',
                codigo: '2010',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1025,
                nombre: 'Solicitud de Rehabilitación del Quebrado',
                codigo: '2013',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
            {
                id: 1026,
                nombre: 'Resolución que Conceda la Rehabilitación del Quebrado',
                codigo: '2012',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            }, */
            {
                id: 1027,
                nombre: 'Proyecto de Distribución de Patrimonio',
                codigo: '2003',
                categoria: 1002,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: ['41', '42', '43'],
            },
            // memorias
            {
                id: 1028,
                nombre: 'Memoria Anual',
                codigo: '3000',
                categoria: 1003,
                tipoSocietarioHabilitado: ['07'],
                tipoTramiteHabilitado: null,
            },
            // balances
            {
                id: 1029,
                nombre: 'Publicación de Balance Anual para Emisión de Bonos',
                codigo: '4000',
                categoria: 1004,
                tipoSocietarioHabilitado: ['07', '04'],
                tipoTramiteHabilitado: null,
            },
        ];
        const parametricas = items.map((item) => {
            const pc = new ParametricaCategoria();
            pc.id = item.categoria;

            const p = new Parametrica();
            p.fechaCreacion = new Date();
            p.usuarioCreacion = 'Sedder';
            p.id = item.id;
            p.nombre = item.nombre;
            p.codigo = item.codigo;
            p.duracion = 0;
            p.tipo = TramiteParametricaTipo.EN_LINEA;
            p.tipoCatalogo = TramiteParametricaTipoCatalogo.PUBLICACION;
            p.version = '1';
            p.requierePago = true;
            p.requierePresentacion = false;
            p.requiereRevision = false;
            p.requierePublicacion = false;
            p.emiteCertificado = false;
            p.parametricaCategoria = pc;
            // p.api = item.api;
            p.tipoSocietarioHabilitado = item.tipoSocietarioHabilitado;
            p.tipoTramiteHabilitado = item.tipoTramiteHabilitado;
            return p;
          });
          await queryRunner.manager.save(parametricas);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
