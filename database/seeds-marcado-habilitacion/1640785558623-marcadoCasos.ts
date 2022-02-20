import { MigrationInterface, QueryRunner } from 'typeorm';
import { Empresa } from '../../src/application/empresa/entities/empresa.entity';
import { HttpService } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

const http = new HttpService();

export class marcadoCasos1640785558623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const empresas = await queryRunner.manager
      .createQueryBuilder()
      .select('*')
      .from(Empresa, 'empresas')
      .where('escenario is null and cod_tipo_persona <> :codUnipersonal', {
        codUnipersonal: '01',
      })
    //   .limit(100)
      .execute();
    let indice = 0;
    for await (const empresa of empresas) {
      indice = indice + 1;
      console.log(indice, '----------------');
      const data = {
        MatriculaComercio: empresa.matricula_anterior,
        NIT: empresa.matricula,
        RazonSocial: empresa.razon_social,
      };
      console.log(data);
      const respuesta = await http
        .post(process.env.URL_SIN_VERIFICACION_NIT_PERSONA_JURIDICA, data)
        .toPromise();
      console.log(respuesta.data);
      if (respuesta.data && parseInt(respuesta.data.estado) === 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Empresa)
          .set({ escenario: '1A' })
          .where('id = :id', {
            id: empresa.id,
          })
          .execute();
      } else if (respuesta.data && parseInt(respuesta.data.estado) === 4) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Empresa)
          .set({ escenario: '2', observacion: respuesta.data.mensaje})
          .where('id = :id', {
            id: empresa.id,
          })
          .execute();
      } else {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Empresa)
          .set({ escenario: '3', observacion: respuesta.data.mensaje})
          .where('id = :id', {
            id: empresa.id,
          })
          .execute();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
