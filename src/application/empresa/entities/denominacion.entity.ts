import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Establecimiento } from './establecimiento.entity';

@Index('denominacion_pkey', ['id'], { unique: true })
@Entity('denominaciones', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Denominacion extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ length: 506, nullable: false })
  denominacion: string;

  @Column({ length: 50, nullable: true })
  sigla: string;

  @ManyToOne(
    () => Establecimiento,
    (establecimiento) => establecimiento.denominaciones,
    {
      nullable: true,
      cascade: true,
    },
  )
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;
}
