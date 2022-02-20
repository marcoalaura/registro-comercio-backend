import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Tramite } from './tramite.entity';
import { Factura } from './factura.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tramite_pagos', { schema: process.env.DB_SCHEMA_TRAMITE })
export class TramitePago extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'monto',
    type: 'numeric',
    precision: 20,
    scale: 5,
  })
  monto: number;

  @Column({ name: 'canal_solicitud' })
  canalSolicitud: string;

  @Column({ name: 'canal_pago' })
  canalPago: string;

  @Column('jsonb', { name: 'transaccion' })
  transaccion: Record<string, unknown>;

  // @Column({ name: 'ruta_factura' })
  // rutaFactura: string;

  @Column()
  estado: string;

  // @Column({ name: 'numero_factura' })
  // numeroFactura: string;

  @ManyToOne(() => Tramite, (tramite) => tramite.pagos)
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;

  @OneToMany(() => Factura, (factura) => factura.pago)
  facturas: Factura[];
}
