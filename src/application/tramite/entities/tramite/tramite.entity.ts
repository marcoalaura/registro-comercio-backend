import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';

import { Parametrica } from '../parametricas/parametrica.entity';
import { Detalle } from './detalle.entity';
import { Documento } from './documento.entity';
import { Bitacora } from './bitacora.entity';
import { Empresa } from '../../../empresa/entities/empresa.entity';
import { Establecimiento } from '../../../empresa/entities/establecimiento.entity';
import { Usuario } from 'src/core/usuario/entity/usuario.entity';
import { TramiteDocumentoEmitido } from './tramite-documento-emitido.entity';
import { TramiteLiquidacion } from './tramite-liquidacion.entity';
import { TramitePago } from './tramite-pago.entity';
// import { TramitePublicacion } from './tramite-publicacion.entity';
import { Observacion } from './observacion.entity';
import { TramitePublicacion } from './tramite-publicacion.entity';
import { TipoTramite, TramiteEstado } from 'src/common/constants/index';
import { TramiteSeccion } from './tramite-seccion.entity';
import * as dayjs from 'dayjs';

import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Publicacion } from 'src/application/publicacion/entities/publicacion.entity';

@Entity('tramites', { schema: process.env.DB_SCHEMA_TRAMITE })
@Unique(['codigo', 'tipoTramite'])
export class Tramite extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: string;

  @Column()
  codigo: string;

  @Column({ name: 'nombre', nullable: true })
  nombre: string;

  @Column({ name: 'fecha_solicitud' })
  fechaSolicitud: Date;

  @Column({ name: 'fecha_publicacion', nullable: true })
  fechaPublicacion: Date;

  @Column({ name: 'fecha_conclusion', nullable: true })
  fechaConclusion: Date;

  @Column({ name: 'fecha_observacion', nullable: true })
  fechaObservacion: Date;

  @Column({ name: 'fecha_reingreso', nullable: true })
  fechaReingreso: Date;

  @Column({ name: 'fecha_aprobacion', nullable: true })
  fechaAprobacion: Date;

  @Column({ name: 'fecha_inscrito', nullable: true })
  fechaInscrito: Date;

  @Column({ name: 'codigo_blockchain', nullable: true })
  codigoBlockchain: string;

  @Column({ name: 'ruta_pdf', nullable: true })
  rutaPdf: string;

  // @Column('jsonb', { name: 'datos_contacto' })
  // datosContacto: Record<string, unknown>;

  @Column({ name: 'tipo_tramite', default: TipoTramite.TRAMITE })
  tipoTramite: number;

  @Column({
    type: 'enum',
    enum: TramiteEstado,
  })
  estado: TramiteEstado;

  @Column({ default: 1 })
  paso: number;

  // transient
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;

  // transient
  @Column({ name: 'id_establecimiento', nullable: true })
  idEstablecimiento: number;

  // transient
  @Column({ name: 'id_catalogo_tramite', nullable: false })
  idParametrica: number;

  // transient
  @Column({ name: 'id_usuario_propietario', nullable: false })
  idUsuarioPropietario: number;

  // transient
  @Column({ name: 'id_usuario_funcionario', nullable: true })
  idUsuarioFuncionario: number;

  @ManyToOne(() => Parametrica, (parametrica) => parametrica.tramites, {
    nullable: true,
  })
  @JoinColumn({
    name: 'id_catalogo_tramite',
    referencedColumnName: 'id',
  })
  parametrica: Parametrica; // catalogo tramite

  @OneToMany(() => Detalle, (detalle) => detalle.tramite)
  detalles: Detalle[]; // tramite detalle

  @OneToMany(() => Documento, (documento) => documento.tramite)
  documentos: Documento[]; // tramite documentos soporte

  @OneToMany(() => Bitacora, (bitacora) => bitacora.tramite)
  bitacoras: Bitacora[];

  @ManyToOne(() => Empresa, (empresa) => empresa.tramites, { nullable: true })
  @JoinColumn({
    name: 'id_empresa',
    referencedColumnName: 'id',
  })
  empresa: Empresa;

  @ManyToOne(
    () => Establecimiento,
    (establecimiento) => establecimiento.tramites,
    { nullable: true },
  )
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;

  @ManyToOne(() => Usuario)
  @JoinColumn({
    name: 'id_usuario_propietario',
    referencedColumnName: 'id',
  })
  usuarioPropietario: Usuario;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({
    name: 'id_usuario_funcionario',
    referencedColumnName: 'id',
  })
  usuarioFuncionario: Usuario;

  @OneToMany(
    () => TramiteDocumentoEmitido,
    (documentoEmitido) => documentoEmitido.tramite,
  )
  documentosEmitidos: TramiteDocumentoEmitido[];

  @OneToMany(() => TramitePublicacion, (publicacion) => publicacion.tramite)
  publicacionTramites: TramitePublicacion[];

  @OneToMany(() => TramiteLiquidacion, (liquidacion) => liquidacion.tramite)
  liquidaciones: TramiteLiquidacion[];

  @OneToMany(() => TramitePago, (pago) => pago.tramite)
  pagos: TramitePago[];

  @OneToMany(() => Observacion, (observacion) => observacion.tramite)
  observaciones: Observacion[];

  @OneToMany(() => TramiteSeccion, (seccion) => seccion.tramite)
  tramiteSecciones: TramiteSeccion[];

  @OneToMany(() => Publicacion, (publicacion) => publicacion.tramite)
  publicaciones: Publicacion[];

  // Computed fechaSolicitudFormato
  fechaSolicitudFormato: string;
  @AfterLoad()
  setFechaSolicitudFormato() {
    if (this.fechaSolicitud) {
      const fechaSol = dayjs(this.fechaSolicitud);
      this.fechaSolicitudFormato = fechaSol.isValid()
        ? fechaSol.format('DD/MM/YYYY')
        : undefined;
    }
  }

  // Computed fechaObservacionFormato
  fechaObservacionFormato: string;
  @AfterLoad()
  setFechaObservacionFormato() {
    if (this.fechaObservacion) {
      const fechaObs = dayjs(this.fechaObservacion);
      this.fechaObservacionFormato = fechaObs.isValid()
        ? fechaObs.format('DD/MM/YYYY')
        : undefined;
    }
  }

  // Computed fechaConclusionFormato
  fechaConclusionFormato: string;
  @AfterLoad()
  setFechaConclusionFormato() {
    if (this.fechaConclusion) {
      const fechaObs = dayjs(this.fechaConclusion);
      this.fechaConclusionFormato = fechaObs.isValid()
        ? fechaObs.format('DD/MM/YYYY')
        : undefined;
    }
  }

  // Computed fechaReingresoFormato
  fechaReingresoFormato: string;
  @AfterLoad()
  setFechaReingresoFormato() {
    if (this.fechaReingreso) {
      const fechaObs = dayjs(this.fechaReingreso);
      this.fechaReingresoFormato = fechaObs.isValid()
        ? fechaObs.format('DD/MM/YYYY')
        : undefined;
    }
  }

  // Computed fechaInscritoFormato
  fechaInscritoFormato: string;
  @AfterLoad()
  setFechaInscritoFormato() {
    if (this.fechaInscrito) {
      const fechaObs = dayjs(this.fechaInscrito);
      this.fechaInscritoFormato = fechaObs.isValid()
        ? fechaObs.format('DD/MM/YYYY')
        : undefined;
    }
  }
}
