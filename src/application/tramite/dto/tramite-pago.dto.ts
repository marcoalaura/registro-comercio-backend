import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
} from '../../../common/validation';

export class ActualizarPagoDTO {
  @ApiProperty()
  @IsNotEmpty()
  canalPago: string;

  @ApiProperty()
  @IsNotEmpty()
  estado: string;

  @ApiProperty()
  transaccion: Record<string, unknown>;
}

export class CrearPagoDTO extends ActualizarPagoDTO {
  //
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly monto: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly canalSolicitud: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly idTramite: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  usuarioCreacion: string;
}
