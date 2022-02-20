import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Tramite } from './tramite.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Observacion } from './observacion.entity';
import { Status } from 'src/common/constants';

@Entity('tramite_documentos_soporte', { schema: process.env.DB_SCHEMA_TRAMITE })
@Index(['campo', 'idTramite'], { unique: true })
export class Documento extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  campo: string;

  @Column()
  tipo: string;

  @Column({ name: 'nro_documento' })
  nroDocumento: string;

  @Column()
  emisor: string;

  @CreateDateColumn({ type: 'date', name: 'fecha_emision' })
  fechaEmision: Date;

  @Column()
  nombre: string;

  @Column()
  hash: string;

  @Column()
  ruta: string;

  @Column({ name: 'ruta_kardex', nullable: true })
  rutaKardex: string;

  @Column('jsonb', { name: 'detalle', nullable: true })
  detalle: Record<string, unknown>;

  @Column({ default: Status.ACTIVE })
  estado: string;

  @Column({ name: 'id_tramite', nullable: false })
  idTramite: number;

  @ManyToOne(() => Tramite, (tramite) => tramite.documentos)
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;

  @OneToMany(() => Observacion, (observacion) => observacion.documento)
  observaciones: Observacion[];
}
