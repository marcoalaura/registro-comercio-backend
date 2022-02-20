import { MigrationInterface, QueryRunner } from "typeorm";
import { Parametrica } from 'src/application/tramite/entities/parametricas/parametrica.entity';
import { Contacto } from "src/application/empresa/entities/contacto.entity";
import { Status } from 'src/common/constants'

export class Contactos1645022782862 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        tipoContacto: 'TELEFONO',
        descripcion: {
          telefono1: '78945612',
          telefono2: null,
          telefono3: '2225588'
        },
        idPersona: null,
        idEstablecimiento: 1,
        estado: Status.ACTIVE,
      },
      {
        tipoContacto: 'CORREO',
        descripcion: {
          email: 'algo@algo.com',
        },
        idPersona: null,
        idEstablecimiento: 1,
        estado: Status.ACTIVE,
      },
    ];
    const newItems = items.map((item) => {
      const e = new Contacto();
      e.tipoContacto = item.tipoContacto;
      e.descripcion = item.descripcion;
      e.idPersona = item.idPersona;
      e.idEstablecimiento = item.idEstablecimiento;
      e.estado = item.estado;
      e.fechaCreacion = new Date();
      e.usuarioCreacion = 'SEEDER';
      return e;
    });
    await queryRunner.manager.save(newItems);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
