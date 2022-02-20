import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Status, TipoDocumento } from '../../../common/constants';
import { Contacto } from 'src/application/empresa/entities/contacto.entity';
import { Vinculado } from 'src/application/empresa/entities/vinculado.entity';
import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';

@Entity('personas', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Persona extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1000, nullable: true })
  nombre_completo: string;

  @Column({ length: 100, nullable: true })
  nombres: string;

  @Column({ name: 'primer_apellido', length: 100, nullable: true })
  primerApellido: string;

  @Column({ name: 'segundo_apellido', length: 100, nullable: true })
  segundoApellido: string;

  @Column({
    name: 'tipo_documento',
    length: '15',
    nullable: false,
    default: TipoDocumento.CI,
  })
  tipoDocumento: string;

  @Column({ name: 'tipo_documento_otro', length: 50, nullable: true })
  tipoDocumentoOtro: string;

  @Column({ name: 'nro_documento', length: 50 })
  nroDocumento: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: string;

  @Column({ length: 50, nullable: true })
  telefono: string;

  @Column({ name: 'genero', length: 30, nullable: true })
  genero: string;

  @Column({ length: 255, nullable: true })
  observacion: string;

  @Column({
    name: 'estado',
    length: 30,
    nullable: false,
    default: Status.ACTIVE,
  })
  estado: string;

  @Column('character varying', {
    name: 'cod_pais',
    nullable: true,
    length: 4,
  })
  codPais: string;

  @OneToMany(() => Usuario, (usuario) => usuario.persona)
  usuarios: Usuario[];

  @OneToMany(() => Contacto, (contacto) => contacto.persona)
  contactos: Contacto[];

  @OneToMany(() => Vinculado, (vinculado) => vinculado.persona)
  vinculados: Vinculado[];
}
