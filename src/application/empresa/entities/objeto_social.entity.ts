import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { AbstractEntityEmpresa } from '../../../common/dto/abstract-entity-empresa.dto';
import { Empresa } from './empresa.entity';

@Index('objeto_social_pkey', ['id'], { unique: true })
@Entity('objetos_sociales', { schema: process.env.DB_SCHEMA_EMPRESA })
export class ObjetoSocial extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({
    name: 'objeto_social',
    nullable: true,
    type: 'text',
  })
  objetoSocial: string;

  // Relación con la empresa
  @ManyToOne(() => Empresa, (empresa) => empresa.objetos_sociales, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_empresa',
    referencedColumnName: 'id',
  })
  empresa: Empresa;
}
