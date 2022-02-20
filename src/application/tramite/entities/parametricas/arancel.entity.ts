import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Parametrica } from './parametrica.entity';

import { Status } from 'src/common/constants/index';

@Entity('aranceles', {
  schema: process.env.DB_SCHEMA_PARAMETRICA,
})
export class Arancel extends AbstractEntityEmpresa {
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
  tipo: string;

  @Column({ name: 'funcion_dependiente', nullable: true })
  funcionDependiente: string;

  @Column({ name: 'codigo_tipo_societario', nullable: true })
  codigoTipoSocietario: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  estado: Status;

  @ManyToOne(() => Parametrica, (catalogoTramite) => catalogoTramite.aranceles)
  @JoinColumn({
    name: 'id_catalogo_tramite',
    referencedColumnName: 'id',
  })
  catalogoTramite: Parametrica;
}
