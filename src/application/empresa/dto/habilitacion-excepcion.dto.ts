import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from '../../../common/validation';

import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmpresaDto } from './empresa.dto';

export class CrearHabilitacionExcepcionDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly motivo: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  fechaExcepcion: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;

  @ValidateNested()
  @Type(() => EmpresaDto)
  @ApiProperty()
  empresa: EmpresaDto;
}

export class ActualizarHabilitacionExcepcionDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly motivo: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  fechaExcepcion: Date;

  @IsOptional()
  @IsString()
  usuarioActualizacion: string;

  @IsOptional()
  @IsString()
  estado: string;
}
