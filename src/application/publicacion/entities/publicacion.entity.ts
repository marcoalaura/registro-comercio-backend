import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Parametrica } from 'src/application/tramite/entities/parametricas/parametrica.entity';
import { Empresa } from 'src/application/empresa/entities/empresa.entity';
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';

@Entity('publicaciones', { schema: process.env.DB_SCHEMA_PUBLICACION })
export class Publicacion extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column({ name: 'titulo', nullable: false })
  titulo: string;

  @Column({ name: 'resumen', nullable: false })
  resumen: string;

  @Column({ name: 'fecha_solicitud', nullable: false })
  fechaSolicitud: Date;

  @Column({ name: 'fecha_publicacion', nullable: false })
  fechaPublicacion: Date;

  @Column({ name: 'nombre_archivo', nullable: true })
  nombreArchivo: string;

  @Column({ name: 'estado' })
  estado: number;

  @Column({ name: 'matricula', length: 12 })
  matricula: string;

  @Column({ name: 'razon_social', length: 506 })
  razonSocial: string;

  // transient
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;

  // transient
  @Column({ name: 'id_catalogo_tramite', nullable: true })
  idCatalogoTramite: number;

  // transient
  @Column({ name: 'id_tramite', nullable: true })
  idTramite: number;

  @ManyToOne(
    () => Parametrica,
    (catalogoTramite) => catalogoTramite.publicaciones,
    {
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'id_catalogo_tramite',
    referencedColumnName: 'id',
  })
  catalogoTramite: Parametrica;

  @ManyToOne(() => Empresa, (empresa) => empresa.publicaciones, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_empresa',
    referencedColumnName: 'id',
  })
  empresa: Empresa;

  @ManyToOne(() => Tramite, (tramite) => tramite.publicaciones, {
    nullable: true,
  })
  @JoinColumn({
    name: 'id_tramite',
    referencedColumnName: 'id',
  })
  tramite: Tramite;
}
