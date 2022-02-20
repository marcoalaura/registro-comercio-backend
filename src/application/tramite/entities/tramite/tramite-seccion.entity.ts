import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Tramite } from './tramite.entity';
// import { Detalle } from './detalle.entity';

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tramite_secciones', { schema: process.env.DB_SCHEMA_TRAMITE })
@Index(['idSeccionParametrica', 'idTramite'], { unique: true })
export class TramiteSeccion extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  editado: boolean;

  @Column({ name: 'id_seccion_parametrica', nullable: false })
  idSeccionParametrica: number;

  @Column({ name: 'id_tramite', nullable: false })
  idTramite: number;

  @ManyToOne(() => Tramite, (tramite) => tramite.tramiteSecciones)
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;

  //   @OneToMany(() => Detalle, (campo) => campo.tramiteSession)
  //   campos: Detalle[];
}
