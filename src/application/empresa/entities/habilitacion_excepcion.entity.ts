import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Empresa } from './empresa.entity';

@Index('habilitacion_excepcion_pkey', ['id'], { unique: true })
@Entity('habilitaciones_excepciones', { schema: process.env.DB_SCHEMA_EMPRESA })
export class HabilitacionExcepcion extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'fecha_excepcion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaExcepcion: Date;

  @Column({ name: 'motivo', nullable: true })
  motivo: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.habilitacionesExcepciones, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_empresa',
    referencedColumnName: 'id',
  })
  empresa: Empresa;
}
