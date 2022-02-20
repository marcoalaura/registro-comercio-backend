import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Tramite } from './tramite.entity';
import { Usuario } from '../../../../core/usuario/entity/usuario.entity';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tramite_bitacoras', { schema: process.env.DB_SCHEMA_TRAMITE })
export class Bitacora extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operacion: string;

  @CreateDateColumn()
  fecha: Date;

  @Column()
  estado: string;

  @Column({ name: 'id_tramite', nullable: false })
  idTramite: number;

  @Column({ name: 'id_usuario', nullable: false })
  idUsuario: number;

  // Computed fechaMiliSegundos
  fechaMiliSegundos: number;
  @AfterLoad()
  setFechaMiliSegundos() {
    this.fechaMiliSegundos = this.fecha.getTime();
  }

  @ManyToOne(() => Tramite, (tramite) => tramite.bitacoras)
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;

  @ManyToOne(() => Usuario, (tramite) => tramite.usuario)
  @JoinColumn({
    name: 'id_usuario',
    referencedColumnName: 'id',
  })
  usuario: Usuario;
}
