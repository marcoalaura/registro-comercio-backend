import {MigrationInterface, QueryRunner} from "typeorm";
import { TramiteEstado, TipoTramite } from '../../src/common/constants/index';
import { Usuario } from 'src/core/usuario/entity/usuario.entity';
import { Empresa } from 'src/application/empresa/entities/empresa.entity';
import { Establecimiento } from 'src/application/empresa/entities/establecimiento.entity';
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import { Parametrica } from 'src/application/tramite/entities/parametricas/parametrica.entity';

export class tramites1642182407925 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const items = [
            {
                datos_contacto: {
                    'nombre' : 'pedro',
                    'celular': '71418410'
                },
                estado: TramiteEstado.CONCLUIDO,
                fechaConclusion: new Date(),
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 1
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.CONCLUIDO,
                fechaConclusion: new Date(),
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 2
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.ASIGNADO,
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 3
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.ELIMINADO,
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 3
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.PAGADO,
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 4
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.ELIMINADO,
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 4
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.SOLICITUD,
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 6
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.SOLICITUD,
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 7
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.OBSERVADO,
                fechaObservacion: new Date(),
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 1
            },
            {
                datos_contacto: {
                    'nombre' : 'pedro1',
                    'celular': '71418410'
                },
                estado: TramiteEstado.OBSERVADO,
                fechaObservacion: new Date(),
                establecimiento: 1,
                empresa: 1,
                propietario: 4,
                catalogoTramite: 3
            },
        ];
        let i = 0;
        const usuarios = items.map((item) => {
            i++;
            const u = new Usuario();
            u.id = item.propietario;

            const e = new Empresa();
            e.id = item.empresa;

            const e2 = new Establecimiento();
            e2.id = item.establecimiento;

            const tp = new Parametrica();
            tp.id = item.catalogoTramite;

            const t = new Tramite();
            t.fechaCreacion = new Date();
            t.usuarioCreacion = 'SEEDER';
            t.version = '1';
            t.codigo = `${i}-2021`;
            t.tipoTramite = TipoTramite.TRAMITE;
            t.fechaSolicitud = new Date();
            t.fechaConclusion = item.fechaConclusion || null;
            t.fechaObservacion = item.fechaObservacion || null;
            // t.datosContacto = item.datos_contacto;
            t.estado = item.estado;
            t.empresa = e;
            t.establecimiento  = e2;
            t.usuarioPropietario = u;
            t.parametrica = tp;
            return t;
          });
          await queryRunner.manager.save(usuarios);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
