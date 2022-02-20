import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsDate,
  IsNotEmpty,
} from 'src/common/validation';

export class CrearTramiteRegistroUnipersonalDto {
  @IsString()
  @ApiProperty()
  tipoUnidadEconomica: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  actividadesSecundarias: Array<string>;

  @IsString()
  @ApiProperty()
  objetoSocial: string;

  @IsString()
  @ApiProperty()
  actividadPrincipal: string;

  @IsString()
  @ApiProperty()
  razonSocial: string;

  @IsString()
  @ApiProperty()
  tipoRazonSocial: string;

  @IsNumber()
  @ApiProperty()
  capital: number;
}

class PersonaPaso2 {
  @IsString()
  @ApiProperty()
  nombres: string;

  @IsString()
  @ApiProperty()
  primerApellido: string;

  @IsString()
  @ApiProperty()
  segundoApellido: string;

  @IsString()
  @ApiProperty()
  tipoDocumento: string;

  @IsString()
  @ApiProperty()
  nroDocumento: string;

  @IsString()
  @ApiProperty()
  fechaNacimiento: string;

  @IsString()
  @ApiProperty()
  genero: string;
}

class ContactoPaso2 {
  @IsString()
  @ApiProperty()
  celular: string;

  @IsString()
  @ApiProperty()
  telefonoFijo: string;

  @IsString()
  @ApiProperty()
  correo: string;
}

export class personaTramiteRegistroUnipersonalDto {
  @IsObject()
  @ApiProperty()
  persona: PersonaPaso2;

  @IsObject()
  @ApiProperty()
  contacto: ContactoPaso2;
}

class GeoPosicionDto {
  @IsNumber()
  @ApiProperty()
  lat: number;

  @IsNumber()
  @ApiProperty()
  lng: number;
}

export class direccionTramiteRegistroUnipersonalDto {
  @IsString()
  @ApiProperty()
  idDepartamento: string;

  @IsString()
  @ApiProperty()
  idProvincia: string;

  @IsString()
  @ApiProperty()
  idMunicipio: string;

  @IsString()
  @ApiProperty()
  tipoDivision: string;

  @IsString()
  @ApiProperty()
  nombreDivision: string;

  @IsString()
  @ApiProperty()
  tipoVia: string;

  @IsString()
  @ApiProperty()
  nombreVia: string;

  @IsString()
  @ApiProperty()
  direccionReferencial: string;

  @IsString()
  @ApiProperty()
  numeroDomicilio: string;

  @IsString()
  @ApiProperty()
  edificio: string;

  @IsString()
  @ApiProperty()
  piso: string;

  @IsString()
  @ApiProperty()
  tipoAmbiente: string;

  @IsString()
  @ApiProperty()
  numeroAmbiente: string;

  @IsString()
  @ApiProperty()
  correoElectronico: string;

  @IsString()
  @ApiProperty()
  telefono1: string;

  @IsString()
  @ApiProperty()
  telefono2: string;

  @IsString()
  @ApiProperty()
  telefono3: string;

  @IsObject()
  @ApiProperty()
  position: GeoPosicionDto;
}

export class documentoTramiteRegistroUnipersonalDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  tipoDocumento: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  numeroDocumento: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  emisor: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  fechaEmision: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombreDocumento: string;

  @IsObject()
  @IsOptional()
  detalle: any;
}

export class cambiarEstadoDocumentoDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  estado: string;
}
