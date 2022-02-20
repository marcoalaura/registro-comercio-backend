import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Establecimiento } from './establecimiento.entity';

@Index('kardex_pkey', ['id'], { unique: true })
@Entity('kardexs', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Kardex extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column('character varying', {
    name: 'cod_tipo_documento',
    nullable: true,
    length: 4,
  })
  codTipoDocumento: string;

  @Column('character varying', { name: 'numero', nullable: true, length: 16 })
  numero: string;

  @Column('character varying', {
    name: 'codigo_sinplu',
    nullable: true,
    length: 20,
  })
  codigoSinplu: string;

  @Column('character varying', { name: 'emisor', nullable: true, length: 200 })
  emisor: string;

  @Column({
    name: 'fecha_emision',
    type: 'timestamptz',
    nullable: true,
  })
  fechaEmision: Date;

  @Column('character varying', {
    name: 'cod_municipio',
    nullable: true,
    length: 10,
  })
  codMunicipio: string;

  @Column('character varying', {
    name: 'numero_tramite',
    nullable: true,
    length: 20,
  })
  numeroTramite: string;

  @Column('character varying', {
    name: 'cod_tipo_acto',
    nullable: true,
    length: 8,
  })
  codTipoActo: string;

  @Column('character varying', {
    name: 'cod_libro_registro',
    nullable: true,
    length: 4,
  })
  codLibroRegistro: string;

  @Column('character varying', {
    name: 'numero_registro',
    nullable: true,
    length: 16,
  })
  numeroRegistro: string;

  @ManyToOne(
    () => Establecimiento,
    (establecimiento) => establecimiento.kardexs,
    { nullable: false, cascade: true },
  )
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;
}
