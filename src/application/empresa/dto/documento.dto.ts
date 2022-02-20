import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class CrearDocumentoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly codTipoDocumento: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly numero: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly codigoSinplu: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly emisor: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  readonly fechaEmision: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly codMunicipio: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly numeroTramite: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;
}

export class ActualizarDocumentoDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codTipoDocumento: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly numero: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codigoSinplu: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly emisor: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  readonly fechaEmision: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly codMunicipio: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly numeroTramite: string;

  @IsOptional()
  @IsString()
  usuarioActualizacion: string;

  @IsOptional()
  @IsString()
  estado: string;
}
