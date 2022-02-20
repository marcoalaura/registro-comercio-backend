import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'src/common/validation';

export class datosRegistroSucursalSUFEDTO {
  @ApiProperty()
  @IsNotEmpty()
  nombre: string;
  @ApiProperty()
  @IsNotEmpty()
  direccion: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  codigo: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  actividades: Array<number>;
}

export class datosRegistroPuntoVentaSUFEDTO {
  @ApiProperty()
  @IsNotEmpty()
  nombre: string;
  @ApiProperty()
  @IsNotEmpty()
  descripcion: string;
  @ApiProperty()
  @IsNotEmpty()
  tipoPuntoVenta: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sucursal: number;
}

export class datosFacturaDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  codigoSucursal: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  puntoVenta: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  documentoSector: 1;
  @ApiProperty()
  @IsNotEmpty()
  municipio: string;
  @ApiProperty()
  departamento: string;
  @ApiProperty()
  @IsNotEmpty()
  telefono: string;
  @ApiProperty()
  @IsNotEmpty()
  razonSocial: string;
  @ApiProperty()
  @IsNotEmpty()
  documentoIdentidad: string;
  @ApiProperty()
  complemento: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tipoDocumentoIdentidad: 5;
  @ApiProperty()
  @IsNotEmpty()
  correo: string;
  @ApiProperty()
  @IsNotEmpty()
  codigoCliente: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  metodoPago: 2;
  @ApiProperty()
  numeroTarjeta: string;
  @ApiProperty()
  @IsNumber()
  codigoMoneda: 1;
  @ApiProperty()
  @IsNumber()
  tipoCambio: 1;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  montoTotal: number;
  @ApiProperty()
  @IsNumber()
  montoGiftCard: number;
  @ApiProperty()
  @IsNumber()
  montoDescuentoAdicional: number;
  @ApiProperty()
  @IsNotEmpty()
  formatoFactura: 'pagina';
  @ApiProperty()
  @IsNumber()
  codigoExcepcion: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  detalle: Array<DetalleDTO>;
}

export class DetalleDTO {
  @ApiProperty()
  @IsNotEmpty()
  actividadEconomica: string;
  @ApiProperty()
  @IsNotEmpty()
  codigoSin: string;
  @ApiProperty()
  @IsNotEmpty()
  codigo: string;
  @ApiProperty()
  @IsNotEmpty()
  descripcion: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  precioUnitario: number;
  @ApiProperty()
  @IsNumber()
  montoDescuento: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cantidad: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  unidadMedida: number;
  @ApiProperty()
  numeroSerie: string;
}

export class datosFacturaAnulacionDTO {
  @ApiProperty()
  @IsNotEmpty()
  motivo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tipoAnulacion: 3;
}
