import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntityEmpresa } from '../../../common/dto/abstract-entity-empresa.dto';
import { Capital } from './capital.entity';
import { DistribucionCapital } from './distribucion_capital.entity';

@Index('capital_distribucion_capital_pkey', ['id'], { unique: true })
@Entity('capitales_distribuciones_capitales', {
  schema: process.env.DB_SCHEMA_EMPRESA,
})
export class CapitalDistribucionCapital extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  // Relación con capital
  @ManyToOne(() => Capital, (capital) => capital.capital_distribucion_capital, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_capital',
    referencedColumnName: 'id',
  })
  capital: Capital;

  // Relación con distribucion_capital
  @ManyToOne(
    () => DistribucionCapital,
    (distribucionCapital) => distribucionCapital.capital_distribucion_capital,
    {
      nullable: false,
      cascade: true,
    },
  )
  @JoinColumn({
    name: 'id_distribucion_capital',
    referencedColumnName: 'id',
  })
  distribucionCapital: DistribucionCapital;
}
