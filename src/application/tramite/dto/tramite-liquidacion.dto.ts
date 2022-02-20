import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
} from '../../../common/validation';

export class ActualizarLiquidacionDTO {
  @ApiProperty()
  @IsNotEmpty()
  estado: string;
}

export class CrearLiquidacionDTO extends ActualizarLiquidacionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly monto: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly descripcion: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly idTramite: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;
}
