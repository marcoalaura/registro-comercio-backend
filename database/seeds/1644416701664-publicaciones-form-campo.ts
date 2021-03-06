import { MigrationInterface, QueryRunner } from "typeorm";

import { Campo } from "src/application/tramite/entities/parametricas/campo.entity";
import { Seccion } from "src/application/tramite/entities/parametricas/seccion.entity"; 

import { Status } from 'src/common/constants/index';
import { PlantillaCampoComun } from "src/common/constants/plantillas";

export class PublicacionesFormCampo1644416701664 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                id: 1001,
                campo: 'departamento',
                tipo: 'select',
                label: 'Departamento',
                tooltip: 'Seleccionar departamento',
                orden: 1,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: 'parametros/C08_departamentos/listado',
                filtro: null,
                maxMinFecha: null,
                size: 4,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1001
            },
            {
                id: 1002,
                campo: 'municipio',
                tipo: 'select',
                label: 'Municipio',
                tooltip: 'Seleccionar municipio',
                orden: 2,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: 'parametros/C10_municipios/listado',
                filtro: null,
                maxMinFecha: null,
                size: 4,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1001
            },
            {
                id: 1003,
                campo: 'ubicacion',
                tipo: 'text',
                label: 'Ubicaci??n (Direcci??n)',
                tooltip: 'Introduce la ubicaci??n',
                orden: 3,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required', 'caracteresEspeciales'],
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 4,
                tabla: 'test',
                cantidadMax: 200,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1001
            },
            {
                id: 1004,
                campo: 'fecha_junta',
                tipo: 'date',
                label: 'Fecha de Junta',
                tooltip: 'Seleccione la fecha de junta',
                orden: 4,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: null,
                filtro: null,
                maxMinFecha: {
                    minimo: '2022-02-01',//Debe ser al menos 8 d??as despues de la fecha de publicaci??n
                    maximo: '2022-02-25',
                },
                size: 4,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1001
            },
            {
                id: 1005,
                campo: 'hora_asamblea',
                tipo: 'time',
                label: 'Hora Asamblea',
                tooltip: 'Seleccione la hora de asamblea',
                orden: 5,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 4,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1001
            },
            {
                id: 1006,
                campo: 'tema_asamblea',
                tipo: 'text',
                label: 'Tema asamblea',
                tooltip: 'Introduce el tema de la asamblea',
                orden: 6,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 4,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1001
            },
            {
                id: 1007,
                campo: 'caracter_asamblea',
                tipo: 'text',
                label: 'Car??cter asamblea',
                tooltip: 'Introduce el car??cter de la asamblea',
                orden: 7,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 4,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1001
            },
            // Campos para formulario [SORTEO DE TITULO Y VALORES]
            {
                id: 1011,
                campo: 'alerta_fecha_pago',
                tipo: 'alert',
                label: 'La fecha de pago por sorteo tiene que ser dentro de los pr??ximos 15 d??as siguientes despu??s de la fecha de publicaci??n.',
                tooltip: '',
                orden: 1,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: null,
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 12,
                tabla: 'test',
                cantidadMax: 100,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1003
            },
            {
                id: 1012,
                campo: 'nombre_emision',
                tipo: 'text',
                label: 'Nombre de la emisi??n',
                tooltip: 'Nombre de la emisi??n',
                orden: 2,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 6,
                tabla: 'test',
                cantidadMax: 100,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1003
            },
            {
                id: 1013,
                campo: 'serie',
                tipo: 'text',
                label: 'Serie',
                tooltip: 'Serie',
                orden: 3,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 6,
                tabla: 'test',
                cantidadMax: 30,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1003
            },
            {
                id: 1014,
                campo: 'numero_emision',
                tipo: 'text',
                label: 'N??mero de la emisi??n',
                tooltip: 'N??mero de la emisi??n',
                orden: 4,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 6,
                tabla: 'test',
                cantidadMax: 30,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1003
            },
            {
                id: 1015,
                campo: 'fecha_pago_sorteo',
                tipo: 'date',
                label: 'Fecha del Pago por sorteo',
                tooltip: 'Fecha del Pago por sorteo',
                orden: 5,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: ['required'],
                parametrica: null,
                filtro: null,
                maxMinFecha: {
                    minimo: '2022-01-01',// Debe ser al menos 15 d??as mayor a la fecha de publicaci??n
                },
                size: 6,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1003
            },
            {
                id: 1016,
                campo: PlantillaCampoComun.RESUMEN,
                tipo: 'hidden',
                label: 'La empresa {denominacion} con Matr??cula de Comercio: {nro_matricula}, anuncia la amortizaci??n mediante sorteo de la emisi??n de bonos {nombre_emision}, con serie: {serie} y n??mero de emisi??n: {numero_emision}, ser?? realizada en fecha {fecha_pago_sorteo}.',
                tooltip: '',
                orden: 1,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: null,
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 12,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1004
            },
            {
                id: 1017,
                campo: PlantillaCampoComun.NRO_MATRICULA,
                tipo: 'hidden',
                label: 'N??mero de matr??cula',
                tooltip: '',
                orden: 1,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: null,
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 12,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1004
            },
            {
                id: 1018,
                campo: PlantillaCampoComun.DENOMINACION,
                tipo: 'hidden',
                label: 'Denominaci??n/Raz??n Social',
                tooltip: '',
                orden: 1,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: null,
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 12,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1004
            },
            {
                id: 1019,
                campo: PlantillaCampoComun.TIPO_SOCIETARIO,
                tipo: 'hidden',
                label: 'Tipo Societario',
                tooltip: '',
                orden: 1,
                iop: null,
                desabilitado: false,
                valorDefecto: null,
                validacion: null,
                parametrica: null,
                filtro: null,
                maxMinFecha: null,
                size: 12,
                tabla: 'test',
                cantidadMax: 1,
                documentoSoporte: false,
                codigoTipoDocumento: null,
                criterioOpcional: null,
                seccion: 1004
            },
        ];
        const data = items.map((item) => {
            const campo = new Campo();
            campo.fechaCreacion = new Date();
            campo.usuarioCreacion = 'SEEDER';
            campo.estado = Status.ACTIVE;
            campo.campo = item.campo;
            campo.tipo = item.tipo;
            campo.label = item.label;
            campo.tooltip = item.tooltip;
            campo.orden = item.orden;
            campo.iop = item.iop;
            campo.desabilitado = item.desabilitado;
            campo.valorDefecto = item.valorDefecto;
            campo.validacion = item.validacion;
            campo.parametrica = item.parametrica;
            campo.filtro = item.filtro;
            campo.maxMinFecha = item.maxMinFecha;
            campo.size = item.size;
            campo.tabla = item.tabla;
            campo.cantidadMax = item.cantidadMax;
            campo.documentoSoporte = item.documentoSoporte;
            campo.codigoTipoDocumento = item.codigoTipoDocumento;
            campo.criterioOpcional = item.criterioOpcional;
            campo.id = item.id;
            const seccion = new Seccion(); seccion.id = item.seccion;
            campo.seccion = seccion;
            return campo;
        });
        await queryRunner.manager.save(data);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
