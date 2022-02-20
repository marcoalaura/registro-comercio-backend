import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Status } from '../../common/constants';

@Entity('parametros', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Parametro {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO confirmar si campo codigo debería ser "unique", no funciona con clasificadores
  @Column({ length: 15 })
  codigo: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 50 })
  grupo: string;

  @Column({ length: 255 })
  descripcion: string;

  @Column({
    name: 'estado',
    nullable: false,
    length: 30,
    default: Status.ACTIVE,
  })
  estado: string;
}
