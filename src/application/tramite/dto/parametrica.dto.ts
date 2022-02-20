import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from '../../../common/validation';
import { IsBoolean, IsNotEmptyObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Tramite } from '../entities/tramite/tramite.entity';

export class ParametricaDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tipo: string;

  @IsString()
  @ApiProperty()
  readonly version: string;

  @IsBoolean()
  @ApiProperty()
  requierePago?: boolean = true;

  @IsBoolean()
  @ApiProperty()
  requierePresentacion?: boolean = true;

  @IsBoolean()
  @ApiProperty()
  requiereRevision?: boolean = true;

  @IsBoolean()
  @ApiProperty()
  requierePublicacion?: boolean = false;

  @IsBoolean()
  @ApiProperty()
  emiteCertificado?: boolean = false;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  costo: number;

  @IsNumber()
  @ApiProperty()
  duracion: number;

  @ApiProperty()
  usoQr: Record<string, unknown>;

  @IsString()
  @IsOptional()
  @ApiProperty()
  api: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  ruta: string;

  @IsNotEmptyObject()
  @ApiProperty()
  dato: Record<string, unknown>;

  @ApiProperty()
  tramites: Array<Tramite>;
}
