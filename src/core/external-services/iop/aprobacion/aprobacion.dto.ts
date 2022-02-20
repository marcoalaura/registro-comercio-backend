import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBase64 } from 'class-validator';

export class datosSolicitudAprobacionDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly idUsuario: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly idTramite: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly pathFile: string;
}

export class datosSolicitudAprobacionIOPDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly tipoDocumento: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBase64()
  readonly documento: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly hashDocumento: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly idTramite: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly descripcion: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly token: string;
}
