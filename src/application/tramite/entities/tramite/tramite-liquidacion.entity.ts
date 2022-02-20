import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Tramite } from './tramite.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tramite_liquidaciones', { schema: process.env.DB_SCHEMA_TRAMITE })
export class TramiteLiquidacion extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'monto',
    type: 'numeric',
    precision: 20,
    scale: 5,
  })
  monto: number;

  @Column()
  descripcion: string;

  @Column()
  estado: string;

  @ManyToOne(() => Tramite, (tramite) => tramite.documentosEmitidos)
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;
}
