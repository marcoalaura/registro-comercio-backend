import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Establecimiento } from './establecimiento.entity';

import { ObjetoSocial } from './objeto_social.entity';
import { Capital } from './capital.entity';
import { InformacionFinanciera } from './informacion_financiera.entity';
import { HabilitacionExcepcion } from './habilitacion_excepcion.entity';
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import { Publicacion } from 'src/application/publicacion/entities/publicacion.entity';

@Index('empresa_pkey', ['id'], { unique: true })
@Entity('empresas', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Empresa extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'nit', length: 12, nullable: true })
  nit: string;

  @Column({ name: 'matricula', length: 12, nullable: true })
  matricula: string;

  @Column({ name: 'matricula_anterior', length: 12, nullable: true })
  matriculaAnterior: string;

  @Column({ name: 'razon_social', length: 506, nullable: false })
  razonSocial: string;

  @Column({
    name: 'cod_tipo_razon_social',
    length: 2,
    nullable: false,
    default: '1',
  })
  codTipoRazonSocial: string;

  @Column({ length: 50, nullable: true })
  sigla: string;

  @Column({ name: 'cod_tipo_unidad_economica', length: 2, nullable: false })
  codTipoUnidadEconomica: string;

  @Column({ name: 'cod_tipo_persona', length: 2, nullable: true })
  codTipoPersona: string;

  @Column({ name: 'cod_pais_origen', length: 4, nullable: false })
  codPaisOrigen: string;

  @Column({ name: 'ambito_accion', length: 2, nullable: true })
  ambitoAccion: string;

  @Column({
    name: 'mes_cierre_gestion',
    type: 'integer',
    nullable: true,
  })
  mesCierreGestion: number;

  @Column({ name: 'pagina_web', length: 100, nullable: true })
  paginaWeb: string;

  @Column({ type: 'integer' })
  vigencia: number;

  @Column({
    name: 'fecha_vigencia',
    type: 'timestamptz',
    nullable: true,
  })
  fechaVigencia: Date;

  @Column({ name: 'duracion_sociedad', type: 'integer' })
  duracionSociedad: number;

  @Column({
    name: 'cod_tipo_constitucion_acciones',
    length: 1,
    nullable: false,
  })
  codTipoConstitucionAcciones: string;

  @Column({ name: 'numero_senarec', length: 12, nullable: true })
  numeroSenarec: string;

  @Column({
    name: 'fecha_inscripcion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaInscripcion: Date;

  @Column({
    name: 'fecha_habilitacion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaHabilitacion: Date;

  @Column({
    name: 'fecha_cancelacion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaCancelacion: Date;

  @Column({
    name: 'fecha_ultima_actualizacion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaUltimaActualizacion: Date;

  @Column({
    name: 'ultimo_anio_actualizacion',
    type: 'integer',
    nullable: true,
  })
  ultimoAnioActualizacion: number;

  @Column({ name: 'cod_estado_actualizacion', length: 2 })
  codEstadoActualizacion: string;

  @Column({ name: 'escenario', length: 5, nullable: true })
  escenario: string;

  @Column({ name: 'observacion', length: 255, nullable: true })
  observacion: string;

  @OneToMany(
    () => Establecimiento,
    (establecimiento) => establecimiento.empresa,
  )
  establecimientos: Establecimiento[];

  @OneToMany(() => ObjetoSocial, (objeto_social) => objeto_social.empresa)
  objetos_sociales: ObjetoSocial[];

  @OneToMany(() => Capital, (capital) => capital.empresa)
  capitales: Capital[];

  @OneToMany(
    () => InformacionFinanciera,
    (informacion_financiera) => informacion_financiera.empresa,
  )
  informaciones_financieras: InformacionFinanciera[];

  @OneToMany(
    () => HabilitacionExcepcion,
    (HabilitacionExcepcion) => HabilitacionExcepcion.empresa,
  )
  habilitacionesExcepciones: HabilitacionExcepcion[];

  @OneToMany(() => Tramite, (tramite) => tramite.empresa)
  tramites: Tramite[];

  @OneToMany(() => Publicacion, (publicacion) => publicacion.empresa)
  publicaciones: Publicacion[];
}
