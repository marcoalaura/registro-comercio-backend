import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from '../../../common/validation';

import { ApiProperty } from '@nestjs/swagger';

export class CrearObjetoSocialDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly objetoSocial: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;
}

export class ActualizarObjetoSocialDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly objetoSocial: string;

  @IsOptional()
  @IsString()
  usuarioActualizacion: string;

  @IsOptional()
  @IsString()
  estado: string;
}
