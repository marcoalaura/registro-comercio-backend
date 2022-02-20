import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';

export class CrearDireccionDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoDireccion: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codDepartamento: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codProvincia: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codMunicipio: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoSubdivisionGeografica: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly nombreSubdivisionGeografica: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoVia: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly nombreVia: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly numeroDomicilio: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly manzana: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly uv: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly edificio: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly piso: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoAmbiente: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly numeroNombreAmbiente: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly direccionReferencial: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly latitud: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly longitud: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;
}

export class ActualizarDireccionDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoDireccion: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codDepartamento: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codProvincia: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codMunicipio: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoSubdivisionGeografica: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly nombreSubdivisionGeografica: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoVia: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly nombreVia: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly numeroDomicilio: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly manzana: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly uv: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly edificio: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly piso: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoAmbiente: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly numeroNombreAmbiente: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly direccionReferencial: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly latitud: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly longitud: string;

  @IsOptional()
  @IsString()
  usuarioActualizacion: string;

  @IsOptional()
  @IsString()
  estado: string;
}
