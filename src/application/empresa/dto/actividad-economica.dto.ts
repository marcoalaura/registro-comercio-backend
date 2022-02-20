import { IsNotEmpty } from '../../../common/validation';
import { EstablecimientoDto } from './establecimiento.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CrearActividadEconomicaDto {
  @IsNotEmpty()
  @ApiProperty()
  codGranActividad: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoActividad: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoClasificador: string;

  @IsNotEmpty()
  @ApiProperty()
  codActividad: string;

  @ApiProperty()
  estado: string;

  @ValidateNested()
  @Type(() => EstablecimientoDto)
  @ApiProperty()
  establecimiento: EstablecimientoDto;

  usuarioCreacion?: string;
}

export class ActualizarActividadEconomicaDto {
  @ApiProperty()
  codGranActividad?: string;

  @ApiProperty()
  codTipoActividad?: string;

  @ApiProperty()
  codTipoClasificador?: string;

  @ApiProperty()
  codActividad?: string;

  @ApiProperty()
  estado: string;

  usuarioActualizacion: string;
}
