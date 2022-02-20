import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('clasificador_pkey', ['id'], { unique: true })
@Entity('clasificadores', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Clasificador extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'tipo',
    nullable: true,
    type: 'character varying',
    length: 15,
  })
  tipo: string;

  @Column({
    name: 'codigo',
    nullable: false,
    type: 'character varying',
    length: 15,
  })
  codigo: string;

  @Column({
    name: 'descripcion',
    nullable: false,
    type: 'character varying',
    length: 512,
  })
  descripcion: string;

  @OneToMany(() => Clasificador, (hijo) => hijo.clasificador)
  clasificadores: Clasificador[];

  @ManyToOne(() => Clasificador, (hijo) => hijo.clasificadores, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_clasificador',
    referencedColumnName: 'id',
  })
  clasificador: Clasificador;
}
