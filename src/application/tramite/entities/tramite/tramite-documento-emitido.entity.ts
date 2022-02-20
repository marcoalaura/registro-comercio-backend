import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Tramite } from './tramite.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tramite_documentos_emitidos', {
  schema: process.env.DB_SCHEMA_TRAMITE,
})
export class TramiteDocumentoEmitido extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  ruta: string;

  @Column('jsonb', { name: 'uso_qr' })
  usoQr: Record<string, unknown>;

  @Column()
  estado: string;

  @ManyToOne(() => Tramite, (tramite) => tramite.documentosEmitidos)
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;
}
