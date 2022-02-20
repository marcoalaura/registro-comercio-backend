import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsNumber,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';

export class CrearContactoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly tipoContacto: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  readonly descripcion: any;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;
}

export class ActualizarContactoDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly tipoContacto: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  readonly descripcion: any;

  @IsOptional()
  @IsString()
  usuarioActualizacion: string;

  @IsOptional()
  @IsString()
  estado: string;
}
