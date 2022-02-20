// import { ValidateIf } from 'class-validator';
// import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl } from 'src/common/validation';
import { ApiProperty } from '@nestjs/swagger';

export class EmpresaDto {
  @ApiProperty()
  nit: string;

  @IsNotEmpty()
  // @Transform(({ value }) => value?.trim())
  @ApiProperty()
  matricula: string;

  @ApiProperty()
  matriculaAnterior?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  razonSocial: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoRazonSocial: string;

  @ApiProperty()
  sigla?: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoUnidadEconomica: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoPersona: string;

  @ApiProperty()
  codPaisOrigen: string;

  @ApiProperty()
  ambitoAccion: string;

  @ApiProperty()
  mesCierreGestion: number;

  @ApiProperty()
  paginaWeb?: string;

  @ApiProperty()
  vigencia?: number;

  @ApiProperty()
  fechaVigencia?: Date;

  @ApiProperty()
  duracionSociedad: number;

  @ApiProperty()
  codTipoConstitucionAcciones: string;

  @ApiProperty()
  numeroSenarec?: string;

  @ApiProperty()
  fechaInscripcion: Date;

  @ApiProperty()
  fechaHabilitacion: Date;

  @ApiProperty()
  fechaCancelacion: Date;

  @ApiProperty()
  fechaUltimaActualizacion: Date;

  @ApiProperty()
  ultimoAnioActualizacion: number;

  @ApiProperty()
  codEstadoActualizacion: string;

  @ApiProperty()
  accion: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  escenario: string;

  @ApiProperty()
  observacion: string;

  usuarioCreacion?: string;
}

export class CrearEmpresaDto {
  @ApiProperty()
  nit: string;

  @IsNotEmpty()
  @ApiProperty()
  matricula: string;

  @ApiProperty()
  matriculaAnterior?: string;

  @IsNotEmpty()
  @ApiProperty()
  razonSocial: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoRazonSocial: string;

  @ApiProperty()
  sigla?: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoUnidadEconomica: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoPersona: string;

  @ApiProperty()
  codPaisOrigen: string;

  @ApiProperty()
  ambitoAccion: string;

  @ApiProperty()
  mesCierreGestion: number;

  @IsUrl()
  @ApiProperty()
  paginaWeb?: string;

  @ApiProperty()
  vigencia?: number;

  @ApiProperty()
  fechaVigencia?: Date;

  @ApiProperty()
  duracionSociedad: number;

  @ApiProperty()
  codTipoConstitucionAcciones: string;

  @ApiProperty()
  numeroSenarec?: string;

  @ApiProperty()
  fechaInscripcion: Date;

  @ApiProperty()
  fechaHabilitacion: Date;

  @ApiProperty()
  fechaCancelacion: Date;

  @ApiProperty()
  fechaUltimaActualizacion: Date;

  @ApiProperty()
  ultimoAnioActualizacion: number;

  @ApiProperty()
  codEstadoActualizacion: string;

  @ApiProperty()
  accion: string;

  @ApiProperty()
  estado: string;

  usuarioCreacion?: string;
}

export class ActualizarEmpresaDto {
  @ApiProperty()
  nit: string;

  @ApiProperty()
  matricula: string;

  @ApiProperty()
  matriculaAnterior?: string;

  @ApiProperty()
  razonSocial?: string;

  @IsNotEmpty()
  @ApiProperty()
  codTipoRazonSocial?: string;

  @ApiProperty()
  sigla?: string;

  @ApiProperty()
  codTipoUnidadEconomica: string;

  @ApiProperty()
  codTipoPersona: string;

  @ApiProperty()
  codPaisOrigen: string;

  @ApiProperty()
  ambitoAccion: string;

  @ApiProperty()
  mesCierreGestion: number;

  @ApiProperty()
  paginaWeb?: string;

  @ApiProperty()
  vigencia?: number;

  @ApiProperty()
  fechaVigencia?: Date;

  @ApiProperty()
  duracionSociedad: number;

  @ApiProperty()
  codTipoConstitucionAcciones: string;

  @ApiProperty()
  numeroSenarec?: string;

  @ApiProperty()
  fechaInscripcion: Date;

  @ApiProperty()
  fechaHabilitacion: Date;

  @ApiProperty()
  fechaCancelacion: Date;

  @ApiProperty()
  fechaUltimaActualizacion: Date;

  @ApiProperty()
  ultimoAnioActualizacion: number;

  @ApiProperty()
  codEstadoActualizacion: string;

  @ApiProperty()
  accion: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  escenario: string;

  @ApiProperty()
  observacion: string;

  usuarioActualizacion: string;
}
