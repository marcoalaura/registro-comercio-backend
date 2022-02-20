import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TramitePago } from './tramite-pago.entity';

@Entity('facturas', { schema: process.env.DB_SCHEMA_TRAMITE })
export class Factura extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'monto_total',
    type: 'numeric',
    precision: 20,
    scale: 5,
  })
  montoTotal: number;

  @Column({ name: 'cuf', nullable: true })
  cuf: string;

  @Column({ name: 'numero_factura', nullable: true })
  numeroFactura: string;

  @Column({ name: 'url_factura', nullable: true })
  urlFactura: string;

  @Column({ name: 'codigo_seguimiento' })
  codigoSeguimiento: string;

  @Column()
  estado: string;

  @Column({ name: 'fecha_emision' })
  fechaEmision: Date;

  @Column({ nullable: true })
  observacion: string;

  @ManyToOne(() => TramitePago, (pago) => pago.facturas)
  @JoinColumn({
    name: 'id_pago',
    referencedColumnName: 'id',
  })
  pago: TramitePago;
}
