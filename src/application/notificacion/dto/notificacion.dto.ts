import { ApiProperty } from '@nestjs/swagger';
import {
  // IsArray,
  // IsNumber,
  IsObject,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'src/common/validation';

class FacturaDetalleDTO {
  @ApiProperty()
  tipoEmision: string;

  @ApiProperty()
  tipoEvento: string;

  @ApiProperty()
  @IsNotEmpty()
  nit: string;

  @ApiProperty()
  @IsNotEmpty()
  cuf: string;

  @ApiProperty()
  @IsNotEmpty()
  nroFactura: string;

  @ApiProperty()
  urlPdf: string;

  @ApiProperty()
  urlXml: string;

  @ApiProperty()
  observacion: string;
}

export class NotificacionFacturaDto {
  @ApiProperty()
  @IsBoolean()
  finalizado: boolean;

  @ApiProperty()
  @IsNotEmpty()
  estado: string;

  @ApiProperty()
  @IsNotEmpty()
  fuente: string;

  @ApiProperty()
  @IsNotEmpty()
  codigoSeguimiento: string;

  @ApiProperty()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty()
  mensaje: string;

  @ApiProperty()
  detalle: FacturaDetalleDTO;
}

// class MetodoPagoDTO {
//   @ApiProperty()
//   codigoRespuesta: string;

//   @ApiProperty()
//   mensajeRespuesta: string;

//   @ApiProperty()
//   @IsNumber()
//   idCpt: number;

//   @ApiProperty()
//   cpt: string;

//   @ApiProperty()
//   estado: string;

//   @ApiProperty()
//   canal: string;

//   @ApiProperty()
//   fecha: string;

//   @ApiProperty()
//   @IsArray()
//   trnasacciones: Array<any>;
// }

// class FacturacionDTO {
//   @ApiProperty()
//   @IsNotEmpty()
//   razonSocial: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   nit: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   correo: string;

//   @ApiProperty()
//   numeroTarjeta: string;
// }

// export class NotificacionPpeDTO {
//   @ApiProperty()
//   @IsNotEmpty()
//   codigoOrden: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   estado: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   metodoPago: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   fecha: string;

//   @ApiProperty()
//   datosMetodoPago: MetodoPagoDTO;

//   @ApiProperty()
//   datosFacturacion: FacturacionDTO;
// }

class PagoFacturaDetalleDTO {
  @ApiProperty()
  @IsOptional()
  tipoEmision: string;

  @ApiProperty()
  @IsOptional()
  tipoEvento: string;

  @ApiProperty()
  @IsOptional()
  nit: string;

  @ApiProperty()
  @IsOptional()
  cuf: string;

  @ApiProperty()
  @IsOptional()
  nroFactura: string;

  @ApiProperty()
  @IsOptional()
  urlPdf: string;

  @ApiProperty()
  @IsOptional()
  urlXml: string;

  @ApiProperty()
  @IsOptional()
  observacion: string;

  @ApiProperty()
  @IsOptional()
  codigoRespuesta: string;

  @ApiProperty()
  @IsOptional()
  numeroReferencia: string;

  @ApiProperty()
  @IsOptional()
  transaccionUuid: string;

  @ApiProperty()
  @IsOptional()
  moneda: string;

  @ApiProperty()
  @IsOptional()
  decision: string;

  @ApiProperty()
  @IsOptional()
  mensajeRespuesta: string;

  @ApiProperty()
  @IsOptional()
  datosMetodoPago: string;

  @ApiProperty()
  @IsOptional()
  metodoPago: string;

  @ApiProperty()
  @IsOptional()
  codigoOrden: string;

  @ApiProperty()
  @IsOptional()
  fecha: string;
}

export class NotificacionPagoFacturaDto {
  @ApiProperty()
  @IsBoolean()
  finalizado: boolean;

  @ApiProperty()
  @IsNotEmpty()
  estado: string;

  @ApiProperty()
  @IsNotEmpty()
  fuente: string;

  @ApiProperty()
  @IsNotEmpty()
  codigoSeguimiento: string;

  @ApiProperty()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty()
  mensaje: string;

  @ApiProperty()
  @IsObject()
  detalle: PagoFacturaDetalleDTO;
}
