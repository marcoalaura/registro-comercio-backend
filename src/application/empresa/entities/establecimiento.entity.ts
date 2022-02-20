import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { ActividadEconomica } from './actividad-economica.entity';
import { Denominacion } from './denominacion.entity';
import { Empresa } from './empresa.entity';
import { Kardex } from './kardex.entity';
import { Direccion } from './direccion.entity';
import { Producto } from './producto.entity';
import { Vinculado } from './vinculado.entity';
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import { Contacto } from './contacto.entity';

@Index('establecimiento_pkey', ['id'], { unique: true })
@Entity('establecimientos', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Establecimiento extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'cod_tipo_establecimiento', length: 2, nullable: false })
  codTipoEstablecimiento: string;

  @Column('character varying', {
    name: 'numero_establecimiento',
    nullable: true,
    length: 15,
  })
  numeroEstablecimiento: string;

  @Column('character varying', {
    name: 'nombre_establecimiento',
    nullable: true,
    length: 150,
  })
  nombreEstablecimiento: string;

  @OneToMany(() => Denominacion, (denominacion) => denominacion.establecimiento)
  denominaciones: Denominacion[];

  @OneToMany(
    () => ActividadEconomica,
    (actividadEconomica) => actividadEconomica.establecimiento,
  )
  actividadesEconomicas: ActividadEconomica[];

  @ManyToOne(() => Empresa, (empresa) => empresa.establecimientos, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_empresa',
    referencedColumnName: 'id',
  })
  empresa: Empresa;

  // Relación con establecimiento padre
  @OneToMany(() => Establecimiento, (hijo) => hijo.establecimiento)
  establecimientos: Establecimiento[];

  @ManyToOne(() => Establecimiento, (padre) => padre.establecimientos, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;

  @OneToMany(() => Kardex, (kardex) => kardex.establecimiento)
  kardexs: Kardex[];

  @OneToMany(() => Contacto, (contacto) => contacto.establecimiento)
  contactos: Contacto[];

  @OneToMany(() => Direccion, (direccion) => direccion.establecimiento)
  direcciones: Direccion[];

  @OneToMany(() => Producto, (producto) => producto.establecimiento)
  productos: Producto[];

  @OneToMany(() => Vinculado, (vinculado) => vinculado.establecimiento)
  vinculados: Vinculado[];

  @OneToMany(() => Tramite, (tramite) => tramite.establecimiento)
  tramites: Tramite[];
}
