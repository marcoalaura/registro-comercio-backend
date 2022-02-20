import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioRol } from '../../authorization/entity/usuario-rol.entity';
import { Persona } from './persona.entity';
import { Status } from '../../../common/constants';

@Entity('usuarios', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Usuario extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  usuario: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ name: 'ciudadania_digital', default: false })
  ciudadaniaDigital: boolean;

  @Column({ name: 'correo_electronico', nullable: true })
  correoElectronico: string;

  @Column({
    name: 'estado',
    length: 30,
    nullable: false,
    default: Status.CREATE,
  })
  estado: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  intentos: number;

  @Column({
    name: 'codigo_desbloqueo',
    length: 100,
    nullable: true,
  })
  codigoDesbloqueo: string;

  @Column({
    name: 'fecha_bloqueo',
    type: 'timestamptz',
    nullable: true,
  })
  fechaBloqueo: Date;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario, {
    cascade: true,
  })
  public usuarioRol!: UsuarioRol[];

  @ManyToOne(() => Persona, (persona) => persona.usuarios, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_persona',
    referencedColumnName: 'id',
  })
  persona: Persona;
}
