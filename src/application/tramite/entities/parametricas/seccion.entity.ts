import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Grupo } from './grupo.entity';
import { Campo } from './campo.entity';

import { Status } from 'src/common/constants/index';

@Entity('secciones', {
  schema: process.env.DB_SCHEMA_PARAMETRICA,
})
export class Seccion extends AbstractEntityEmpresa {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  orden: number;

  @Column({
    type: 'enum',
    enum: Status,
  })
  estado: Status;

  @ManyToOne(() => Grupo, (grupo) => grupo.secciones)
  @JoinColumn({
    name: 'id_grupo',
    referencedColumnName: 'id',
  })
  grupo: Grupo;

  @OneToMany(() => Campo, (campo) => campo.seccion)
  campos: Campo[];
}
