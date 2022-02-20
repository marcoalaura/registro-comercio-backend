import { IsNotEmpty } from 'src/common/validation';
import { EmpresaDto } from './empresa.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EstablecimientoDto {
  @IsNotEmpty()
  @ApiProperty()
  codTipoEstablecimiento: string;

  @IsNotEmpty()
  @ApiProperty()
  numeroEstablecimiento: string;

  @ApiProperty()
  establecimiento?: EstablecimientoDto;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  empresa: EmpresaDto;

  usuarioCreacion?: string;
}

export class CrearEstablecimientoDto {
  @IsNotEmpty()
  @ApiProperty()
  codTipoEstablecimiento: string;

  @IsNotEmpty()
  @ApiProperty()
  numeroEstablecimiento: string;

  @ApiProperty()
  establecimiento?: EstablecimientoDto;

  @ApiProperty()
  estado: string;

  @ValidateNested()
  @Type(() => EmpresaDto)
  @ApiProperty()
  empresa: EmpresaDto;

  @ApiProperty()
  denominaciones?: Array<string>;

  @ApiProperty()
  actividadesEconomicas?: Array<string>;

  @ApiProperty()
  kardexs?: Array<string>;

  @IsNotEmpty()
  @ApiProperty()
  direcciones: Array<string>;

  @ApiProperty()
  productos?: Array<string>;

  @ApiProperty()
  vinculados?: Array<string>;

  @ApiProperty()
  contactos?: Array<string>;

  @ApiProperty()
  usuarioCreacion?: string;
}

export class ActualizarEstablecimientoDto {
  @ApiProperty()
  codTipoEstablecimiento?: string;

  @ApiProperty()
  numeroEstablecimiento?: string;

  @ApiProperty()
  estado: string;

  usuarioActualizacion: string;
}
