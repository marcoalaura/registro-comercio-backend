import { IsNotEmpty } from '../../../common/validation';
import { EstablecimientoDto } from './establecimiento.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CrearDenominacionDto {
  @IsNotEmpty()
  @ApiProperty()
  denominacion: string;

  @ApiProperty()
  sigla: string;

  @ApiProperty()
  estado: string;

  @ValidateNested()
  @Type(() => EstablecimientoDto)
  @ApiProperty()
  establecimiento: EstablecimientoDto;

  usuarioCreacion?: string;
}

export class ActualizarDenominacionDto {
  @ApiProperty()
  denominacion?: string;

  @ApiProperty()
  sigla?: string;

  @ApiProperty()
  estado: string;

  usuarioActualizacion: string;
}
