import { MigrationInterface, QueryRunner } from "typeorm";
import { Persona } from 'src/core/usuario/entity/persona.entity';
import { Establecimiento } from 'src/application/empresa/entities/establecimiento.entity';
import { Vinculado } from 'src/application/empresa/entities/vinculado.entity';
import { Empresa } from 'src/application/empresa/entities/empresa.entity';
import { ObjetoSocial } from 'src/application/empresa/entities/objeto_social.entity';
import { Status } from 'src/common/constants'
import { Direccion } from "src/application/empresa/entities/direccion.entity";

export class empresaEstablecimientoVinculado1642094458753 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const e = new Empresa();
    e.id = 1;
    e.usuarioCreacion = "AC1";
    e.accion = "SEEDERS";
    e.estado = Status.ACTIVE;
    e.nit = '00003939541';
    e.matricula = '00003939541';
    e.matriculaAnterior = '00001289';
    e.razonSocial = 'DICON';
    e.codTipoUnidadEconomica = 'AA';
    e.codTipoPersona = '01';
    e.codPaisOrigen = '0097';
    e.mesCierreGestion = 4;
    e.paginaWeb = 'S/N';
    e.vigencia = 0;
    e.duracionSociedad = 0;
    e.codTipoConstitucionAcciones = '0';
    e.numeroSenarec = '02-032496-03';
    e.fechaInscripcion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    e.fechaHabilitacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    e.fechaUltimaActualizacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    e.ultimoAnioActualizacion = 2020;
    e.codEstadoActualizacion = '0';
    e.escenario = '1A';

    const p = new Persona();
    p.id = 4;

    const e2 = new Establecimiento();
    e2.fechaCreacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    e2.usuarioCreacion = 'AN0';
    e2.accion = 'SEEDER';
    e2.estado = Status.ACTIVE;
    e2.codTipoEstablecimiento = '2';
    e2.numeroEstablecimiento = '405267';
    e2.id = 1;
    e2.nombreEstablecimiento = 'Nombre del est 1',
    e2.empresa = e;
    e2.establecimiento = e2;

    const e3 = new Direccion();
    e3.codTipoDireccion = '01';
    e3.codDepartamento = '06';
    e3.codProvincia = '0601';
    e3.codMunicipio = '060101';
    e3.codTipoSubdivisionGeografica = '2';
    e3.nombreSubdivisionGeografica = 'sadf';
    e3.codTipoVia = '2';
    e3.nombreVia = 'nombbbb';
    e3.numeroDomicilio = '316';
    e3.codTipoAmbiente = '2',
    e3.latitud = '-21.597108239035713',
    e3.longitud = '-64.68750000000001',
    e3.direccionReferencial = 'direccion adssdf asdf asdf',
    e3.manzana = 'manzana1';
    e3.establecimiento = e2;
    e3.fechaCreacion = new Date();
    e3.usuarioCreacion = '078';

    const v = new Vinculado();
    v.fechaCreacion = new Date();
    v.usuarioCreacion = '078';
    v.estado = Status.ACTIVE;
    v.codTipoVinculo = '2170'
    v.cod_cargo = '2170';
    v.codLibroDesignacion = '81';
    v.registroDesignacion = '00048974'
    v.fechaVinculacion = new Date();
    v.codControlRevocado = '0';
    v.establecimiento = e2;
    v.persona = p;

    const os = new ObjetoSocial();
    os.fechaCreacion = new Date();
    os.usuarioCreacion = 'SEEDER';
    os.objetoSocial = 'Objeto social 1 empresa 1';
    os.accion = 'accion';
    os.estado = Status.ACTIVE;
    os.empresa = e;

    const os1 = new ObjetoSocial();
    os1.fechaCreacion = new Date();
    os1.usuarioCreacion = 'SEEDER';
    os1.objetoSocial = 'Objeto social 2 empresa 1';
    os1.accion = 'accion';
    os1.estado = Status.INACTIVE;
    os1.empresa = e;

    await queryRunner.manager.save(e3);
    await queryRunner.manager.save(v);
    await queryRunner.manager.save(os);
    await queryRunner.manager.save(os1);

    const ee = new Empresa();
    ee.id = 1;
    ee.usuarioCreacion = "AC1";
    ee.accion = "SEEDERS";
    ee.estado = Status.ACTIVE;
    ee.nit = '0000585151';
    ee.matricula = '00005541523';
    ee.matriculaAnterior = '';
    ee.razonSocial = 'INTY';
    ee.codTipoUnidadEconomica = 'AA';
    ee.codTipoPersona = '01';
    ee.codPaisOrigen = '0097';
    ee.mesCierreGestion = 3;
    ee.paginaWeb = 'WWW.INTI.COM';
    ee.vigencia = 0;
    ee.duracionSociedad = 0;
    ee.codTipoConstitucionAcciones = '0';
    ee.numeroSenarec = '02-044444-04';
    ee.fechaInscripcion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    ee.fechaHabilitacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    ee.fechaUltimaActualizacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    ee.ultimoAnioActualizacion = 2020;
    ee.codEstadoActualizacion = '0';
    ee.escenario = '1A';

    const pp = new Persona();
    pp.id = 4;

    const ee2 = new Establecimiento();
    ee2.fechaCreacion = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    ee2.usuarioCreacion = 'AN0';
    ee2.accion = 'SEEDER';
    ee2.estado = Status.ACTIVE;
    ee2.codTipoEstablecimiento = '3';
    ee2.numeroEstablecimiento = '4059999';
    ee2.id = 1;
    ee2.nombreEstablecimiento = 'Nombre del est 2',
    ee2.empresa = ee;
    ee2.establecimiento = ee2;

    const vv = new Vinculado();
    vv.fechaCreacion = new Date();
    vv.usuarioCreacion = '078';
    vv.estado = Status.ACTIVE;
    vv.codTipoVinculo = '2170'
    vv.cod_cargo = '2170';
    vv.codLibroDesignacion = '81';
    vv.registroDesignacion = '00048974'
    vv.fechaVinculacion = new Date();
    vv.codControlRevocado = '0';
    vv.establecimiento = ee2;
    vv.persona = pp;

    const osos = new ObjetoSocial();
    osos.fechaCreacion = new Date();
    osos.usuarioCreacion = 'SEEDER';
    osos.objetoSocial = 'Objeto social 1 empresa 2';
    osos.accion = 'accion';
    osos.estado = Status.ACTIVE;
    osos.empresa = ee;

    await queryRunner.manager.save(vv);
    await queryRunner.manager.save(osos);
  }
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
