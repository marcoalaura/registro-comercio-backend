import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Establecimiento } from './establecimiento.entity';

@Index('producto_pkey', ['id'], { unique: true })
@Entity('productos', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Producto extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'producto',
    nullable: false,
    type: 'text',
  })
  producto: string;

  @ManyToOne(
    () => Establecimiento,
    (establecimiento) => establecimiento.productos,
    { nullable: false, cascade: true },
  )
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;
}
