import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Seccion } from './seccion.entity';
import { Status } from 'src/common/constants/index';
import { ParPublicacion } from 'src/application/tramite/entities/parametricas/par-publicacion.entity';

@Entity('campos', {
  schema: process.env.DB_SCHEMA_PARAMETRICA,
})
export class Campo extends AbstractEntityEmpresa {
  @PrimaryColumn()
  id: number;

  @Column()
  campo: string;

  @Column()
  tipo: string;

  @Column()
  label: string;

  @Column()
  tooltip: string;

  @Column()
  orden: number;

  @Column({ nullable: true })
  iop: string;

  @Column({ nullable: true })
  desabilitado: boolean;

  @Column({ name: 'valor_defecto', nullable: true })
  valorDefecto: string;

  @Column('simple-array', { name: 'validacion', nullable: true })
  validacion: string[];

  @Column({ nullable: true })
  parametrica: string;

  @Column({ name: 'parametrica_text', nullable: true })
  parametricaText: string;

  @Column({ name: 'campo_padre', nullable: true })
  campoPadre: string;

  @Column({ name: 'campo_hijo', nullable: true })
  campoHijo: string;

  @Column({ nullable: true })
  filtro: string;

  @Column('jsonb', { name: 'max_min_fecha', nullable: true })
  maxMinFecha: Record<string, unknown>;

  @Column()
  size: number;

  @Column()
  tabla: string;

  @Column({ name: 'cantiad_max' })
  cantidadMax: number;

  @Column({ name: 'docuemnto_soporte', nullable: true })
  documentoSoporte: boolean;

  @Column({ name: 'codigo_tipo_documento', nullable: true })
  codigoTipoDocumento: string;

  @Column({ name: 'criterio_opcional', nullable: true })
  criterioOpcional: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  estado: Status;

  @Column({ name: 'id_seccion', nullable: false })
  idSeccion: number;

  @ManyToOne(() => Seccion, (seccion) => seccion.campos)
  @JoinColumn({
    name: 'id_seccion',
    referencedColumnName: 'id',
  })
  seccion: Seccion;

  @OneToMany(() => ParPublicacion, (parPublicacion) => parPublicacion.campo)
  parPublicaciones: ParPublicacion[];

  // transient
  valor: string;
}
