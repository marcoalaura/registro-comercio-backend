import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Tramite } from './tramite.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tramite_publicaciones', { schema: process.env.DB_SCHEMA_TRAMITE })
export class TramitePublicacion extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column()
  nombre: string;

  @Column()
  estado: string;

  @ManyToOne(() => Tramite, (tramite) => tramite.publicaciones)
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;
}
