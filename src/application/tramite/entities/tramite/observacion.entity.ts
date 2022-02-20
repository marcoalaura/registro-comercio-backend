import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Detalle } from './detalle.entity';
import { Documento } from './documento.entity';
import { Tramite } from './tramite.entity';
import { ObservacionEstado } from 'src/common/constants/index';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('tramite_observaciones', { schema: process.env.DB_SCHEMA_TRAMITE })
export class Observacion extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  observacion: string;

  @Column({
    type: 'enum',
    enum: ObservacionEstado,
  })
  estado: ObservacionEstado;

  @Column({ name: 'valor_observado', nullable: true })
  valorObservado: string;

  // @OneToOne(() => Detalle, { nullable: true })
  @ManyToOne(() => Detalle, (campo) => campo.observaciones)
  @JoinColumn({
    name: 'id_tramite_detalle',
    referencedColumnName: 'id',
  })
  detalle: Detalle;

  // @OneToOne(() => Documento, { nullable: true })
  @ManyToOne(() => Documento, (documento) => documento.observaciones)
  @JoinColumn({
    name: 'id_tramite_documento',
    referencedColumnName: 'id',
  })
  documento: Documento;

  @ManyToOne(() => Tramite, { nullable: true })
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;
}
