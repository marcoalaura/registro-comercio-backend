import { AbstractEntityEmpresa } from 'src/common/dto/abstract-entity-empresa.dto';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Establecimiento } from './establecimiento.entity';

@Index('actividad_economica_pkey', ['id'], { unique: true })
@Entity('actividades_economicas', { schema: process.env.DB_SCHEMA_EMPRESA })
export class ActividadEconomica extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'cod_gran_actividad', length: 2, nullable: true })
  codGranActividad: string;

  @Column({ name: 'cod_tipo_actividad', length: 1, nullable: true })
  codTipoActividad: string;

  @Column({ name: 'cod_tipo_clasificador', length: 10, nullable: false })
  codTipoClasificador: string;

  @Column({ name: 'cod_actividad', length: 5, nullable: false })
  codActividad: string;

  @Column({ name: 'actividad_principal', default: false })
  actividadPrincipal: boolean;

  @ManyToOne(
    () => Establecimiento,
    (establecimiento) => establecimiento.actividadesEconomicas,
    {
      nullable: true,
      cascade: true,
    },
  )
  @JoinColumn({
    name: 'id_establecimiento',
    referencedColumnName: 'id',
  })
  establecimiento: Establecimiento;
}
