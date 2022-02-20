import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
} from '../../../common/validation';

import { ApiProperty } from '@nestjs/swagger';

export class CrearInformacionFinancieraDto {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly gestion: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly activosCorrientes: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly activosFijos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly valoracionActivos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly otrosActivos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly activosBrutos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly activosNetos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly pasivosCorrientes: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly obligacionesLargoPlazo: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly totalPasivos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly patrimonioLiquido: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly pasivoMasPatrimonio: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly ventasNetas: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly costoVentas: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly utilidadOperacional: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly utilidadBruta: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly codTipoMoneda: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly fechaBalance: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly gestionBalance: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly mesCierreGestion: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly libroRegistroBalance: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly numeroRegistroBalance: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly activoDisponible: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly activoExigible: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly activoRealizable: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly otrosActivosCorrientes: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly activosNoCorrientes: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly pasivosNoCorrientes: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly patrimonio: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly resultadoInscripcion: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly totalIngresos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly totalGastos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly totalGastosOperativos: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly capital: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly fechaInicioBalance: Date;

  @IsNotEmpty()
  @ApiProperty()
  readonly fechaFinBalance: Date;

  @IsOptional()
  @IsString()
  usuarioCreacion: string;
}
