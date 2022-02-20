import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntityEmpresa } from '../../../common/dto/abstract-entity-empresa.dto';
import { Empresa } from './empresa.entity';

@Index('informacion_financiera_pkey', ['id'], { unique: true })
@Entity('informaciones_financieras', { schema: process.env.DB_SCHEMA_EMPRESA })
export class InformacionFinanciera extends AbstractEntityEmpresa {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'gestion', nullable: false })
  gestion: number;

  @Column({
    name: 'activos_corrientes',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  activosCorrientes: number;

  @Column({
    name: 'activos_fijos',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  activosFijos: number;

  @Column({
    name: 'valoracion_activos',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  valoracionActivos: number;

  @Column({
    name: 'otros_activos',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  otrosActivos: number;

  @Column({
    name: 'activos_brutos',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  activosBrutos: number;

  @Column({
    name: 'activos_netos',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  activosNetos: number;

  @Column({
    name: 'pasivos_corrientes',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  pasivosCorrientes: number;

  @Column({
    name: 'obligaciones_largo_plazo',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  obligacionesLargoPlazo: number;

  @Column({
    name: 'total_pasivos',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  totalPasivos: number;

  @Column({
    name: 'patrimonio_liquido',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  patrimonioLiquido: number;

  @Column({
    name: 'pasivo_mas_patrimonio',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  pasivoMasPatrimonio: number;

  @Column({
    name: 'ventas_netas',
    type: 'decimal',
    precision: 20,
    scale: 5,
  })
  ventasNetas: number;

  @Column({
    name: 'costo_ventas',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  costoVentas: number;

  @Column({
    name: 'utilidad_operacional',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  utilidadOperacional: number;

  @Column({
    name: 'utilidad_bruta',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  utilidadBruta: number;

  @Column({ name: 'cod_tipo_moneda', length: 3 })
  codTipoMoneda: string;

  @Column({ name: 'fecha_balance', nullable: true })
  fechaBalance: Date;

  @Column({ name: 'gestion_balance', nullable: true })
  gestionBalance: number;

  @Column({ name: 'mes_cierre_gestion', nullable: true })
  mesCierreGestion: number;

  @Column('character varying', {
    name: 'libro_registro_balance',
    length: 2,
  })
  libroRegistroBalance: string;

  @Column('character varying', {
    name: 'numero_registro_balance',
    length: 8,
  })
  numeroRegistroBalance: string;

  @Column({
    name: 'activo_disponible',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  activoDisponible: number;

  @Column({
    name: 'activo_exigible',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  activoExigible: number;

  @Column({
    name: 'activo_realizable',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  activoRealizable: number;

  @Column({
    name: 'otros_activos_corrientes',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  otrosActivosCorrientes: number;

  @Column({
    name: 'activos_no_corrientes',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  activosNoCorrientes: number;

  @Column({
    name: 'pasivos_no_corrientes',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  pasivosNoCorrientes: number;

  @Column({
    name: 'patrimonio',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  patrimonio: number;

  @Column({
    name: 'resultado_inscripcion',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  resultadoInscripcion: number;

  @Column({
    name: 'total_ingresos',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  totalIngresos: number;

  @Column({
    name: 'total_gastos',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  totalGastos: number;

  @Column({
    name: 'total_gastos_operativos',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  totalGastosOperativos: number;

  @Column({
    name: 'capital',
    type: 'decimal',
    precision: 20,
  })
  capital: number;

  @Column({ name: 'fecha_inicio_balance', nullable: true })
  fechaInicioBalance: Date;

  @Column({ name: 'fecha_fin_balance', nullable: true })
  fechaFinBalance: Date;

  // Relación con la empresa
  @ManyToOne(() => Empresa, (empresa) => empresa.informaciones_financieras, {
    cascade: true,
  })
  @JoinColumn({
    name: 'id_empresa',
    referencedColumnName: 'id',
  })
  empresa: Empresa;
}
