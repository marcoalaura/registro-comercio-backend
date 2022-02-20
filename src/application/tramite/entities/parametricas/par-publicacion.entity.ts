import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Parametrica } from './parametrica.entity';
import { Campo } from './campo.entity';

import { Status } from 'src/common/constants/index';

@Entity('par_publicaciones', {
  schema: process.env.DB_SCHEMA_PARAMETRICA,
})
export class ParPublicacion extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documento: string;

  @Column()
  grupo: string;

  @Column()
  dependiente: boolean;

  @Column({
    type: 'enum',
    enum: Status,
  })
  estado: Status;

  @ManyToOne(
    () => Parametrica,
    (catalogoTramite) => catalogoTramite.parPublicaciones,
  )
  @JoinColumn({
    name: 'id_catalogo_tramite',
    referencedColumnName: 'id',
  })
  catalogoTramite: Parametrica;

  @ManyToOne(() => Campo, (campo) => campo.parPublicaciones)
  @JoinColumn({
    name: 'id_campo',
    referencedColumnName: 'id',
  })
  campo: Campo;
}
