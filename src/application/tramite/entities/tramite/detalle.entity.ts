import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Tramite } from './tramite.entity';
import { Observacion } from './observacion.entity';
// import { TramiteSeccion } from './tramite-seccion.entity';

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tramite_detalles', { schema: process.env.DB_SCHEMA_TRAMITE })
@Index(['campo', 'idTramite'], { unique: true })
export class Detalle extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  campo: string;

  @Column({ nullable: true })
  valor: string;

  @Column('jsonb', { name: 'valor_complejo', nullable: true })
  valorComplejo: Record<string, unknown>;

  @Column()
  tipo: string;

  @Column()
  tabla: string;

  @Column({ name: 'id_tramite', nullable: false })
  idTramite: number;

  @Column({ name: 'seccion', nullable: true })
  seccion: number;

  @ManyToOne(() => Tramite, (tramite) => tramite.detalles)
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;

  // @ManyToOne(() => TramiteSeccion, (seccion) => seccion.campos)
  // @JoinColumn({
  //   name: 'id_seccion',
  //   referencedColumnName: 'id',
  // })
  // tramiteSession: TramiteSeccion;

  @OneToMany(() => Observacion, (observacion) => observacion.detalle)
  observaciones: Observacion[];
}
