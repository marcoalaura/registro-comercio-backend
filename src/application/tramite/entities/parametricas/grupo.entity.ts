import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Seccion } from './seccion.entity';
import { Parametrica } from './parametrica.entity';

import { Status } from 'src/common/constants/index';

@Entity('grupos', {
  schema: process.env.DB_SCHEMA_PARAMETRICA,
})
export class Grupo extends AbstractEntityEmpresa {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  orden: number;

  @Column()
  flujo: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  estado: Status;

  @Column({ name: 'documento_soporte', default: false })
  documentoSoporte: boolean;

  @Column({ name: 'aprobacion_documentos', default: false })
  aprobacionDocumentos: boolean;

  @Column({ default: false })
  pago: boolean;

  @OneToMany(() => Seccion, (seccion) => seccion.grupo)
  secciones: Seccion[];

  @ManyToOne(() => Parametrica, (catalogoTramite) => catalogoTramite.grupos)
  @JoinColumn({
    name: 'id_catalogo_tramite',
    referencedColumnName: 'id',
  })
  catalogoTramite: Parametrica;
}
