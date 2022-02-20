import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from '../../../common/validation';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EmpresaDto } from 'src/application/empresa/dto/empresa.dto';
import { EstablecimientoDto } from 'src/application/empresa/dto/establecimiento.dto';
import { UsuarioDto } from 'src/core/usuario/dto/usuario.dto';
import { Detalle } from '../entities/tramite/detalle.entity';
import { Documento } from '../entities/tramite/documento.entity';
import { Bitacora } from '../entities/tramite/bitacora.entity';
import { ParametricaDto } from './parametrica.dto';

export class CrearTramiteDto {
  @IsString()
  @ApiProperty()
  readonly version: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  readonly fechaSolicitud: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly fechaConclusion: Date;

  @IsOptional()
  @ApiProperty()
  datosContacto: Record<string, unknown>;

  @IsString()
  @ApiProperty()
  readonly estado: string;

  @ValidateNested()
  @Type(() => ParametricaDto)
  parametrica: ParametricaDto;

  @IsNotEmpty()
  @ApiProperty()
  detalles: Array<Detalle>;

  @IsNotEmpty()
  @ApiProperty()
  documentos: Array<Documento>;

  @IsNotEmpty()
  @ApiProperty()
  bitacoras: Array<Bitacora>;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmpresaDto)
  empresa: EmpresaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EstablecimientoDto)
  establecimiento: EstablecimientoDto;

  @ValidateNested()
  @Type(() => UsuarioDto)
  usuarioPropietario: UsuarioDto;

  @ValidateNested()
  @Type(() => UsuarioDto)
  usuarioFuncionario: UsuarioDto;

  @IsOptional()
  @IsString()
  usuarioCreacion: string;
}
