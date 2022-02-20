import { MigrationInterface, QueryRunner } from 'typeorm';
import { Empresa } from '../../src/application/empresa/entities/empresa.entity';
import { Establecimiento } from '../../src/application/empresa/entities/establecimiento.entity';
import { Vinculado } from '../../src/application/empresa/entities/vinculado.entity';
import { Persona } from '../../src/core/usuario/entity/persona.entity';
import { HttpService } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { parse } from 'path';

dotenv.config();

const http = new HttpService();

export class habilitacionAutomatica1640804991401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let indice = 0;
    let respuesta = null;

    // Para sociedades comerciales con el escenario 1A
    const sociedadesComerciales = await queryRunner.manager
      .createQueryBuilder()
      .select('*')
      .from(Empresa, 'empresas')
      .where(
        'escenario = :a1 and cod_tipo_persona <> :codUnipersonales and estado = :estado',
        { a1: '1A', codUnipersonales: '01', estado: 'PENDIENTE' },
      )
    //   .limit(1000)
      .execute();
    for await (const empresa of sociedadesComerciales) {
      indice = indice + 1;
      console.log(indice, '----------------');
      const data = {
        MatriculaComercio: empresa.matricula_anterior,
        NIT: empresa.matricula,
        RazonSocial: empresa.razon_social,
      };
      console.log(data);
      respuesta = await http
        .post(process.env.URL_SIN_VERIFICACION_NIT_PERSONA_JURIDICA, data)
        .toPromise();
      if (respuesta.data && parseInt(respuesta.data.estado) === 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Empresa)
          .set({ nit: empresa.matricula, estado: 'ACTIVO' })
          .where('id = :id', {
            id: empresa.id,
          })
          .execute();
      } else if (respuesta.data && parseInt(respuesta.data.estado) === 4) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Empresa)
          .set({ escenario: '2', observacion: respuesta.data.mensaje })
          .where('id = :id', {
            id: empresa.id,
          })
          .execute();
      } else {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Empresa)
          .set({ escenario: '3', observacion: respuesta.data.mensaje })
          .where('id = :id', {
            id: empresa.id,
          })
          .execute();
      }
    }

    // Para Unipersonales con el escenario 1A
    const unipersonales1A = await queryRunner.manager
      .createQueryBuilder()
      .select(
        'distinct e.id, e.matricula_anterior, v.id_persona, p.tipo_documento, p.nro_documento, p.nombres, p.primer_apellido, p.segundo_apellido',
      )
      .from(Empresa, 'e')
      .innerJoin(Establecimiento, 'es', 'e.id = es.id_empresa')
      .innerJoin(Vinculado, 'v', 'es.id = v.id_establecimiento')
      .innerJoin(Persona, 'p', 'v.id_persona = p.id')
      .where(
        'e.escenario = :a1 and e.cod_tipo_persona = :codUnipersonales and e.estado = :estado',
        { a1: '1A', codUnipersonales: '01', estado: 'PENDIENTE' },
      )
    //   .limit(1000)
      .execute();
    for await (const empresa of unipersonales1A) {
      indice = indice + 1;
      console.log(indice, '----------------');
      const data = {
        TipoDocumentoId: empresa.tipo_documento,
        NumeroDocumentoId: empresa.nro_documento,
        Complemento: '',
        Nombres: empresa.nombres,
        PrimerApellido: empresa.primer_apellido,
        SegundoApellido: empresa.segundo_apellido,
      };
      console.log(data);
      respuesta = await http
        .post(process.env.URL_SIN_VERIFICACION_NIT_EMPRESA_UNIPERSONAL, data)
        .toPromise();
      console.log(respuesta.data);
      if (respuesta.data && parseInt(respuesta.data.estado) === 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Empresa)
          .set({
            nit: respuesta.data.datos.nit.slice(0, 11),
            matricula: respuesta.data.datos.nit.slice(0, 11),
            // razonSocial: respuesta.data.datos.razonSocial,
            estado: 'ACTIVO',
          })
          .where('id = :id', {
            id: empresa.id,
          })
          .execute();
      } else if (respuesta.data && parseInt(respuesta.data.estado) === 1) {
        respuesta = await http
          .post(process.env.URL_SIN_RESERVA_NIT_EMPRESA_UNIPERSONAL, data)
          .toPromise();
        if (respuesta.data && parseInt(respuesta.data.estado) === 0) {
          await queryRunner.manager
            .createQueryBuilder()
            .update(Empresa)
            .set({
              nit: respuesta.data.datos.nitReservado.slice(0, 11),
              matricula: respuesta.data.datos.nitReservado.slice(0, 11),
              // razonSocial: respuesta.data.datos.razonSocial,
              estado: 'ACTIVO',
            })
            .where('id = :id', {
              id: empresa.id,
            })
            .execute();
        } else {
          await queryRunner.manager
            .createQueryBuilder()
            .update(Empresa)
            .set({ escenario: '3', observacion: respuesta.data.mensaje })
            .where('id = :id', {
              id: empresa.id,
            })
            .execute();
        }
        console.log(respuesta.data);
      }
    }

    // Para Unipersonales con el escenario 1B
    const unipersonales1B = await queryRunner.manager
      .createQueryBuilder()
      .select(
        'distinct e.id, e.matricula_anterior, v.id_persona, p.tipo_documento, p.nro_documento, p.nombres, p.primer_apellido, p.segundo_apellido',
      )
      .from(Empresa, 'e')
      .innerJoin(Establecimiento, 'es', 'e.id = es.id_empresa')
      .innerJoin(Vinculado, 'v', 'es.id = v.id_establecimiento')
      .innerJoin(Persona, 'p', 'v.id_persona = p.id')
      .where(
        'e.escenario = :a1 and e.cod_tipo_persona = :codUnipersonales and e.estado = :estado',
        { a1: '1B', codUnipersonales: '01', estado: 'PENDIENTE' },
      )
    //   .limit(1000)
      .execute();
    for await (const empresa of unipersonales1B) {
      indice = indice + 1;
      console.log(indice, '----------------');
      const data = {
        TipoDocumentoId: empresa.tipo_documento,
        NumeroDocumentoId: empresa.nro_documento,
        Complemento: '',
        Nombres: empresa.nombres,
        PrimerApellido: empresa.primer_apellido,
        SegundoApellido: empresa.segundo_apellido,
      };
      console.log(empresa);
      console.log(data);
      respuesta = await http
        .post(process.env.URL_SIN_VERIFICACION_NIT_EMPRESA_UNIPERSONAL, data)
        .toPromise();
      console.log(respuesta.data);
      if (respuesta.data && parseInt(respuesta.data.estado) === 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Empresa)
          .set({
            nit: respuesta.data.datos.nit.slice(0, 11),
            matricula: empresa.matricula_anterior,
            // razonSocial: respuesta.data.datos.razonSocial,
            estado: 'ACTIVO',
          })
          .where('id = :id', {
            id: empresa.id,
          })
          .execute();
      } else if (respuesta.data && parseInt(respuesta.data.estado) === 1) {
        respuesta = await http
          .post(process.env.URL_SIN_RESERVA_NIT_EMPRESA_UNIPERSONAL, data)
          .toPromise();
        if (respuesta.data && parseInt(respuesta.data.estado) === 0) {
          await queryRunner.manager
            .createQueryBuilder()
            .update(Empresa)
            .set({
              nit: respuesta.data.datos.nitReservado.slice(0, 11),
              matricula: empresa.matricula_anterior,
              // razonSocial: respuesta.data.datos.razonSocial,
              estado: 'ACTIVO',
            })
            .where('id = :id', {
              id: empresa.id,
            })
            .execute();
        } else {
          await queryRunner.manager
            .createQueryBuilder()
            .update(Empresa)
            .set({ escenario: '3', observacion: respuesta.data.mensaje })
            .where('id = :id', {
              id: empresa.id,
            })
            .execute();
        }
        console.log(respuesta.data);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
