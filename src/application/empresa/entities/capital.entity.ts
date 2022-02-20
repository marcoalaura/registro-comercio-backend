import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { AbstractEntityEmpresa } from '../../../common/dto/abstract-entity-empresa.dto';
import { Empresa } from './empresa.entity';
import { CapitalDistribucionCapital } from './capital_distribucion_capital.entity';

@Index('capital_pkey', ['id'], { unique: true })
@Entity('capitales', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Capital extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column('character varying', {
    name: 'cod_origen_capital',
    length: 2,
  })
  codOrigenCapital: string;

  @Column('character varying', {
    name: 'cod_pais_origen_capital',
    length: 4,
  })
  codPaisOrigenCapital: string;

  @Column({
    name: 'capital_social',
    type: 'numeric',
    precision: 20,
    scale: 5,
  })
  capitalSocial: number;

  @Column({
    name: 'cuotas_capital_social',
    type: 'decimal',
    precision: 17,
    scale: 2,
    nullable: true,
    default: 0.0,
  })
  cuotasCapitalSocial: number;

  @Column({
    name: 'capital_autorizado',
    type: 'decimal',
    precision: 20,
    scale: 5,
    nullable: true,
    default: 0.0,
  })
  capitalAutorizado: number;

  @Column({
    name: 'cuota_capital_autorizado',
    type: 'decimal',
    precision: 17,
    scale: 2,
    nullable: true,
    default: 0.0,
  })
  cuotaCapitalAutorizado: number;

  @Column({
    name: 'capital_suscrito',
    type: 'decimal',
    precision: 20,
    scale: 5,
    nullable: true,
    default: 0.0,
  })
  capitalSuscrito: number;

  @Column({
    name: 'cuotas_capital_suscrito',
    type: 'decimal',
    precision: 17,
    scale: 2,
    nullable: true,
    default: 0.0,
  })
  cuotasCapitalSuscrito: number;

  @Column({
    name: 'capital_pagado',
    type: 'decimal',
    precision: 20,
    scale: 5,
    nullable: true,
    default: 0.0,
  })
  capitalPagado: number;

  @Column({
    name: 'cuotas_capital_pagado',
    type: 'decimal',
    precision: 17,
    scale: 2,
    nullable: true,
    default: 0.0,
  })
  cuotasCapitalPagado: number;

  @Column({
    name: 'capital_asignado',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    default: 0.0,
  })
  capitalAsignado: number;

  @Column({
    name: 'valor_cuota',
    type: 'decimal',
    precision: 20,
    scale: 5,
    nullable: true,
    default: 0.0,
  })
  valorCuota: number;

  @Column({
    name: 'porcentaje_aporte_privado',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  porcentajeAportePrivado: number;

  @Column({
    name: 'porcentaje_aporte_publico',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  porcentajeAportePublico: number;

  @Column({
    name: 'porcentaje_aporte_extranjero',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  porcentajeAporteExtranjero: number;

  @Column('character varying', {
    name: 'cod_tipo_moneda',
    length: 3,
    nullable: true,
  })
  codTipoMoneda: string;

  @Column('character varying', {
    name: 'cod_libro_capital',
    length: 2,
    nullable: true,
  })
  codLibroCapital: string;

  @Column('character varying', {
    name: 'registro_capital',
    length: 8,
    nullable: true,
  })
  registroCapital: string;

  // Relación con la empresa
  @ManyToOne(() => Empresa, (empresa) => empresa.capitales, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_empresa',
    referencedColumnName: 'id',
  })
  empresa: Empresa;

  // Relación con capital distribucion_capital
  @OneToMany(
    () => CapitalDistribucionCapital,
    (capitalDistribucionCapital) => capitalDistribucionCapital.capital,
  )
  capital_distribucion_capital: CapitalDistribucionCapital[];
}
