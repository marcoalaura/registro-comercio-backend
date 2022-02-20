import {
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
} from '../../../common/validation';

import { ApiProperty } from '@nestjs/swagger';
export class CrearCapitalDto {
  //
  @IsNotEmpty()
  @MaxLength(2)
  @ApiProperty()
  readonly codOrigenCapital: string;

  @IsNotEmpty()
  @MaxLength(4)
  @ApiProperty()
  readonly codPaisOrigenCapital: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly capitalSocial: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly cuotasCapitalSocial: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly capitalAutorizado: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly cuotaCapitalAutorizado: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly capitalSuscrito: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly cuotasCapitalSuscrito: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly capitalPagado: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly cuotasCapitalPagado: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly capitalAsignado: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly valorCuota: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly porcentajeAportePrivado: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly porcentajeAportePublico: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly porcentajeAporteExtranjero: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly codTipoMoneda: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly codLibroCapital: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly registroCapital: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;
}
