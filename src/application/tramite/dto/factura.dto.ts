import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearFacturaDto {
  @ApiProperty()
  numeroFactura: string;

  @ApiProperty()
  @IsNotEmpty()
  estado: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  montoTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  codigoSeguimiento: string;

  @ApiProperty()
  cuf: string;

  @ApiProperty()
  urlFactura: string;

  @ApiProperty()
  fechaEmision: Date;
}

export class ActualizarFacturaDto {
  @ApiProperty()
  numeroFactura: string;

  @ApiProperty()
  @IsNotEmpty()
  estado: string;

  @ApiProperty()
  cuf: string;

  @ApiProperty()
  urlFactura: string;

  @ApiProperty()
  fechaEmision: Date;

  @ApiProperty()
  observacion: string;
}
