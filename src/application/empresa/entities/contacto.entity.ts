import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import { Persona } from 'src/core/usuario/entity/persona.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Direccion } from './direccion.entity';
import { Establecimiento } from './establecimiento.entity';

@Index('contacto_pkey', ['id'], { unique: true })
@Entity('contactos', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Contacto extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column('character varying', {
    name: 'tipo_contacto', // CELULAR, TELEFONO, CORREO
    nullable: false,
    length: 20,
  })
  tipoContacto: string;

  @Column('jsonb', { name: 'descripcion', nullable: true })
  descripcion: Record<string, unknown>;

  // transient
  @Column({ name: 'id_persona', nullable: true })
  idPersona: number;

  // transient
  @Column({ name: 'id_establecimiento', nullable: true })
  idEstablecimiento: number;

  @ManyToOne(() => Persona, (persona) => persona.contactos, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_persona',
    referencedColumnName: 'id',
  })
  persona: Persona;

  // @ManyToOne(() => Direccion, (direccion) => direccion.contactos, {
  //   nullable: true,
  //   cascade: true,
  // })
  // @JoinColumn({
  //   name: 'id_direccion',
  //   referencedColumnName: 'id',
  // })
  // direccion: Direccion;

  @ManyToOne(
    () => Establecimiento,
    (establecimiento) => establecimiento.contactos,
    {
      nullable: true,
      cascade: true,
    },
  )
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;
}
