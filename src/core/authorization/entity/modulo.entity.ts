import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Status } from '../../../common/constants';
import { PropiedadesDto } from '../dto/crear-modulo.dto';

@Entity('modulos', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Modulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  label: string;

  @Column({ length: 50, unique: true })
  url: string;

  @Column({ length: 50, unique: true })
  nombre: string;

  @Column({
    type: 'jsonb',
  })
  propiedades: PropiedadesDto;

  @Column({
    name: 'estado',
    nullable: false,
    length: 30,
    default: Status.ACTIVE,
  })
  estado: string;

  @OneToMany(() => Modulo, (modulo) => modulo.fidModulo)
  subModulo: Modulo[];

  @ManyToOne(() => Modulo, (modulo) => modulo.subModulo)
  @JoinColumn({ name: 'fid_modulo', referencedColumnName: 'id' })
  fidModulo: Modulo;
}
