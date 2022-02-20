import { Column } from 'typeorm';
import { Status } from '../constants';
import { AbstractEntity } from './abstract-entity.dto';

export abstract class AbstractEntityEmpresa extends AbstractEntity {
  @Column({ name: 'usuario_baja', nullable: true })
  usuarioBaja: string;

  @Column({ name: 'fecha_baja', nullable: true, type: 'date' })
  fechaBaja: Date;

  @Column({ name: 'accion', nullable: true })
  accion: string;

  @Column({
    name: 'estado',
    nullable: false,
    default: Status.ACTIVE,
    length: 30,
  })
  estado: string;
}
