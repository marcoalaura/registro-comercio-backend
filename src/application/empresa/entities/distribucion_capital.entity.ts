import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Vinculado } from './vinculado.entity';
import { CapitalDistribucionCapital } from './capital_distribucion_capital.entity';

@Index('distribucion_capital_pkey', ['id'], { unique: true })
@Entity('distribuciones_capitales', { schema: process.env.DB_SCHEMA_EMPRESA })
export class DistribucionCapital extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  // capital_social_individual
  @Column({
    name: 'capital_social_individual',
    type: 'decimal',
    precision: 17,
    scale: 5,
    default: 0.0,
    nullable: false,
  })
  capitalSocialIndividual: number;

  // capital_suscrito_individual
  @Column({
    name: 'capital_suscrito_individual',
    type: 'decimal',
    precision: 17,
    scale: 5,
    default: 0.0,
    nullable: false,
  })
  capitalSuscritoIndividual: number;

  // capital_pagado_individual
  @Column({
    name: 'capital_pagado_individual',
    type: 'decimal',
    precision: 17,
    scale: 5,
    default: 0.0,
    nullable: false,
  })
  capitalPagadoIndividual: number;

  // numero_acciones_individual
  @Column({
    name: 'numero_acciones_individual',
    type: 'decimal',
    precision: 17,
    scale: 5,
    default: 0.0,
    nullable: false,
  })
  numeroAccionesIndividual: number;

  // participacion_porcentual_individual
  @Column({
    name: 'participacion_porcentual_individual',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0.0,
    nullable: false,
  })
  participacionPorcentualIndividual: number;

  // Vinculado
  @ManyToOne(
    () => Vinculado,
    (vinculado) => vinculado.distribucionesCapitales,
    {
      nullable: false,
      cascade: true,
    },
  )
  @JoinColumn({
    name: 'id_vinculado',
    referencedColumnName: 'id',
  })
  vinculado: Vinculado;

  // Relación con capital distribucion_capital
  @OneToMany(
    () => CapitalDistribucionCapital,
    (capitalDistribucionCapital) =>
      capitalDistribucionCapital.distribucionCapital,
  )
  capital_distribucion_capital: CapitalDistribucionCapital[];
}
