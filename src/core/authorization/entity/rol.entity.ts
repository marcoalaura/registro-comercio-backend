import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioRol } from './usuario-rol.entity';
import { Status } from '../../../common/constants';

@Entity('roles', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  rol: string;

  @Column({
    name: 'estado',
    nullable: false,
    length: 30,
    default: Status.ACTIVE,
  })
  estado: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  public usuarioRol!: UsuarioRol[];
}
