import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';

export class CrearProductoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly producto: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;
}

export class ActualizarProductoDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly producto: string;

  @IsOptional()
  @IsString()
  usuarioActualizacion: string;

  @IsOptional()
  @IsString()
  estado: string;
}
