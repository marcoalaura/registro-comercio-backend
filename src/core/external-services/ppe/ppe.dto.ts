import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsPositive,
  ValidateNested,
  IsNumber,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class DatosPagoDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly nombresCliente: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly apellidosCliente: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly numeroDocumentoCliente: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly fechaNacimientoCliente: string;

  @ApiProperty()
  @IsOptional()
  cuentaBancaria: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly montoTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly moneda: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly tipoCambioMoneda: number;
}

export class FacturacionPagoDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly razonSocial: string;

  @ApiProperty()
  @IsNotEmpty()
  nitCliente: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly correo: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  municipio: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  departamento: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telefono: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tipoDocumentoIdentidad: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  documentoIdentidad: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  complemento: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  codigoCliente: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  montoTotal: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  tipoCambio: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  documentoSector: number;
}

export class ProductoDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  actividadEconomica: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  codigoSin: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly descripcion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly precioUnitario: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly cantidad: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly unidadMedida: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  subTotal: number;
}

export class SesionDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly idToken: string;
}

export class PagoDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly descripcion: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  readonly datosSesion?: Array<SesionDTO>;

  @ApiProperty()
  @IsOptional()
  codigoOrden: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => DatosPagoDTO)
  readonly datosPago: DatosPagoDTO;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => FacturacionPagoDTO)
  facturacion: FacturacionPagoDTO;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  readonly productos: Array<ProductoDTO>;
}

export class CrearPagoPeeDTO {
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => PagoDTO)
  readonly pago: PagoDTO;

  @ApiProperty()
  @IsNotEmpty()
  readonly idTramite: number;
}
