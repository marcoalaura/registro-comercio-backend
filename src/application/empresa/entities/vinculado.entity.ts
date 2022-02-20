import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DistribucionCapital } from './distribucion_capital.entity';
import { Establecimiento } from './establecimiento.entity';
import { PersonaJuridica } from './persona_juridica.entity';
import { Persona } from '../../../core/usuario/entity/persona.entity';

@Index('vinculado_pkey', ['id'], { unique: true })
@Entity('vinculados', { schema: process.env.DB_SCHEMA_EMPRESA })
export class Vinculado extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  // cod_tipo_vinculo
  @Column('character varying', {
    name: 'cod_tipo_vinculo',
    nullable: false,
    length: 4,
  })
  codTipoVinculo: string;

  // cod_cargo
  @Column('character varying', {
    name: 'cod_cargo',
    nullable: true,
    length: 4,
  })
  cod_cargo: string;

  // TODO se podria cambiar a cod_tipo_documento_designacion
  @Column('character varying', {
    name: 'cod_libro_designacion',
    nullable: false,
    length: 2,
  })
  codLibroDesignacion: string;

  // TODO se podria cambiar a numero_documento_designacion
  @Column('character varying', {
    name: 'registro_designacion',
    nullable: true,
    length: 8,
  })
  registroDesignacion: string;

  // TODO se podria cambiar a fecha_designacion
  @Column('character varying', {
    name: 'fecha_vinculacion',
    nullable: false,
  })
  fechaVinculacion: Date;

  // TODO se podria cambiar a cod_control_revocatoria
  @Column('character varying', {
    name: 'cod_control_revocado',
    nullable: true,
    length: 1,
  })
  codControlRevocado: string;

  // TODO se podria cambiar a cod_tipo_documento_revocatoria
  @Column('character varying', {
    name: 'cod_libro_revocatoria',
    nullable: true,
    length: 2,
  })
  codLibroRevocatoria: string;

  // TODO se podria cambiar a numero_documento_revocatoria
  @Column('character varying', {
    name: 'registro_revocatoria',
    nullable: true,
    length: 8,
  })
  registroRevocatoria: string;

  // fecha_revocatoria
  @Column('character varying', {
    name: 'fecha_revocatoria',
    nullable: true,
  })
  fechaRevocatoria: Date;

  // Establecimiento many-to-one
  @ManyToOne(
    () => Establecimiento,
    (establecimiento) => establecimiento.vinculados,
    {
      nullable: false,
      cascade: true,
    },
  )
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;

  @ManyToOne(() => Persona, (persona) => persona.vinculados, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_persona',
    referencedColumnName: 'id',
  })
  persona: Persona;

  @ManyToOne(
    () => PersonaJuridica,
    (personaJuridica) => personaJuridica.vinculados,
    {
      nullable: true,
      cascade: true,
    },
  )
  @JoinColumn({
    name: 'id_persona_juridica',
    referencedColumnName: 'id',
  })
  personaJuridica: PersonaJuridica;

  @OneToMany(
    () => DistribucionCapital,
    (DistribucionCapital) => DistribucionCapital.vinculado,
  )
  distribucionesCapitales: DistribucionCapital[];
}
