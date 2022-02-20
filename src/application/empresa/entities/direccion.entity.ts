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

@Index('direccion_pkey', ['id'], { unique: true })
@Entity('direcciones', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Direccion extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column('character varying', {
    name: 'cod_tipo_direccion',
    nullable: false,
    length: 10,
  })
  codTipoDireccion: string;

  @Column('character varying', {
    name: 'cod_departamento',
    nullable: false,
    length: 2,
  })
  codDepartamento: string;

  @Column('character varying', {
    name: 'cod_provincia',
    nullable: false,
    length: 4,
  })
  codProvincia: string;

  @Column('character varying', {
    name: 'cod_municipio',
    nullable: false,
    length: 6,
  })
  codMunicipio: string;

  @Column('text', { name: 'cod_tipo_subdivision_geografica', nullable: false })
  codTipoSubdivisionGeografica: string;

  @Column('character varying', {
    name: 'nombre_subdivision_geografica',
    nullable: false,
    length: 50,
  })
  nombreSubdivisionGeografica: string;

  @Column('character varying', {
    name: 'cod_tipo_via',
    nullable: false,
    length: 2,
  })
  codTipoVia: string;

  @Column('character varying', {
    name: 'nombre_via',
    nullable: false,
    length: 255,
  })
  nombreVia: string;

  @Column('character varying', {
    name: 'numero_domicilio',
    nullable: false,
    length: 15,
  })
  numeroDomicilio: string;

  @Column('character varying', { name: 'manzana', nullable: true, length: 15 })
  manzana: string;

  @Column('character varying', { name: 'uv', nullable: true, length: 15 })
  uv: string;

  @Column('character varying', {
    name: 'edificio',
    nullable: true,
    length: 255,
  })
  edificio: string;

  @Column('character varying', { name: 'piso', nullable: true, length: 15 })
  piso: string;

  @Column('character varying', {
    name: 'cod_tipo_ambiente',
    nullable: true,
    length: 10,
  })
  codTipoAmbiente: string;

  @Column('text', { name: 'numero_nombre_ambiente', nullable: true })
  numeroNombreAmbiente: string;

  @Column('character varying', {
    name: 'direccion_referencial',
    nullable: true,
    length: 100,
  })
  direccionReferencial: string;

  @Column('character varying', { name: 'latitud', nullable: true, length: 20 })
  latitud: string;

  @Column('character varying', {
    name: 'longitud',
    nullable: true,
    length: 20,
  })
  longitud: string;

  // @OneToMany(() => Contacto, (contacto) => contacto.direccion)
  // contactos: Contacto[];

  @ManyToOne(
    () => Establecimiento,
    (establecimiento) => establecimiento.direcciones,
    { nullable: false, cascade: true },
  )
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;
}
