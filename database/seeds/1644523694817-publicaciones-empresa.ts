import { Empresa } from "src/application/empresa/entities/empresa.entity";
import { Status } from "src/common/constants";
import {MigrationInterface, QueryRunner} from "typeorm";

export class publicacionesEmpresa1644523694817 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const e = new Empresa();
        e.id = 3;
        e.usuarioCreacion = "AC1";
        e.accion = "SEEDERS";
        e.estado = Status.ACTIVE;
        e.nit = '0000585180';
        e.matricula = '00005541580';
        e.razonSocial = 'PLAY';
        e.codTipoUnidadEconomica = 'AA';
        e.codTipoPersona = '07';
        e.codPaisOrigen = '0097';
        e.vigencia = 0;
        e.duracionSociedad = 0;
        e.codTipoConstitucionAcciones = '0';
        e.fechaInscripcion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
        e.fechaHabilitacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
        e.fechaUltimaActualizacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
        e.codEstadoActualizacion = '0';
    
        await queryRunner.manager.save(e);
        
        const e1 = new Empresa();
        e1.id = 4;
        e1.usuarioCreacion = "AC1";
        e1.accion = "SEEDERS";
        e1.estado = Status.ACTIVE;
        e1.nit = '0000585181';
        e1.matricula = '00005541581';
        e1.razonSocial = 'PLAY2';
        e1.codTipoUnidadEconomica = 'AA';
        e1.codTipoPersona = '04';
        e1.codPaisOrigen = '0097';
        e1.vigencia = 0;
        e1.duracionSociedad = 0;
        e1.codTipoConstitucionAcciones = '0';
        e1.fechaInscripcion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
        e1.fechaHabilitacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
        e1.fechaUltimaActualizacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
        e1.codEstadoActualizacion = '0';
    
        await queryRunner.manager.save(e1);

        // const pp = new Persona();
        // pp.id = 4;
    
        // const ee2 = new Establecimiento();
        // ee2.fechaCreacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
        // ee2.usuarioCreacion = 'AN0';
        // ee2.accion = 'SEEDER';
        // ee2.estado = 'PENDIENTE';
        // ee2.codTipoEstablecimiento = '3';
        // ee2.numeroEstablecimiento = '4059999';
        // ee2.id = 1;
        // ee2.empresa = ee;
        // ee2.establecimiento = ee2;
    
        // const vv = new Vinculado();
        // vv.fechaCreacion = new Date();
        // vv.usuarioCreacion = '078';
        // vv.estado = Status.ACTIVE;
        // vv.codTipoVinculo = '2170'
        // vv.cod_cargo = '2170';
        // vv.codLibroDesignacion = '81';
        // vv.registroDesignacion = '00048974'
        // vv.fechaVinculacion = new Date();
        // vv.codControlRevocado = '0';
        // vv.establecimiento = ee2;
        // vv.persona = pp;
    
        // const osos = new ObjetoSocial();
        // osos.fechaCreacion = new Date();
        // osos.usuarioCreacion = 'SEEDER';
        // osos.objetoSocial = 'Objeto social 1 empresa 2';
        // osos.accion = 'accion';
        // osos.estado = Status.ACTIVE;
        // osos.empresa = ee;
    
        // await queryRunner.manager.save(vv);
        // await queryRunner.manager.save(osos);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
