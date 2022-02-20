import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

import { Parametrica } from './parametrica.entity';

import {
  Status,
  TramiteParametricaTipoCatalogo,
} from 'src/common/constants/index';

@Entity('categorias', {
  schema: process.env.DB_SCHEMA_PARAMETRICA,
})
export class ParametricaCategoria extends AbstractEntityEmpresa {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  estado: Status;

  @Column({
    name: 'tipo_catalogo',
    type: 'enum',
    enum: TramiteParametricaTipoCatalogo,
    default: TramiteParametricaTipoCatalogo.TRAMITE,
  })
  tipoCatalogo: TramiteParametricaTipoCatalogo;

  @Column()
  orden: number;

  @OneToMany(() => Parametrica, (parametrica) => parametrica)
  parametricas: Parametrica[];
}
