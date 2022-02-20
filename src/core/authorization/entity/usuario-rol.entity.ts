import { Usuario } from '../../usuario/entity/usuario.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Status } from '../../../common/constants';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';

@Entity('usuarios_roles', { schema: process.env.DB_SCHEMA_EMPRESA })
export class UsuarioRol extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'estado',
    nullable: false,
    length: 30,
    default: Status.ACTIVE,
  })
  estado: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarioRol)
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id' })
  public rol!: Rol;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioRol)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  public usuario!: Usuario;
}
