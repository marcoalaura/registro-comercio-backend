import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SINCredencialesDTO {
  @ApiProperty()
  Nit: string;
  @ApiProperty()
  @IsNotEmpty()
  Usuario: string;
  @ApiProperty()
  @IsNotEmpty()
  Contrasena: string;
}

export class SINVerificarPersonaNaturalDTO {
  TipoDocumentoId: string;
  NumeroDocumentoId: string;
  Complemento: string;
  PrimerApellido: string;
}

export class SINVerificarPersonaJuridicaDTO {
  NIT: string;
  RazonSocial: string;
  MatriculaComercio: string;
}

export class SINReservarPersonaNaturalDTO {
  TipoDocumentoId: string;
  NumeroDocumentoId: string;
  Complemento: string;
  Nombres: string;
  PrimerApellido: string;
  SegundoApellido: string;
}

export class SINReservarPersonaJuridicaDTO {
  RazonSocial: string;
  NumeroTestimonioConstitucion: string;
}
