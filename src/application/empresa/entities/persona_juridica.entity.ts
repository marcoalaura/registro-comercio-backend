import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vinculado } from './vinculado.entity';

@Index('persona_juridica_pkey', ['id'], { unique: true })
@Entity('personas_juridicas', { schema: process.env.DB_SCHEMA_EMPRESA })
export class PersonaJuridica extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  // cod_tipo_documento
  @Column('character varying', {
    name: 'cod_tipo_documento',
    nullable: false,
    length: 1,
  })
  codTipodocumento: string;

  // numero_documento
  @Column('character varying', {
    name: 'numero_documento',
    nullable: false,
    length: 11,
  })
  numeroDocumento: string;

  // TODO verificar la logica de este campo
  // matricula
  @Column('character varying', {
    name: 'matricula',
    nullable: true,
    length: 12,
  })
  matricula: string;

  // razon_social
  @Column('character varying', {
    name: 'razon_social',
    nullable: false,
    length: 512,
  })
  razonSocial: string;

  // cod_pais
  @Column('character varying', {
    name: 'cod_pais',
    nullable: false,
    length: 4,
  })
  codPais: string;

  // vinculado
  @OneToMany(() => Vinculado, (vinculado) => vinculado.personaJuridica)
  vinculados: Vinculado[];
}
