import { IsString, IsNotEmpty, IsObject, IsNumber } from 'class-validator';

export class PropiedadesDto {
  @IsString()
  icono: string;

  @IsString()
  color_light?: string;

  @IsString()
  color_dark?: string;

  @IsNumber()
  @IsString()
  orden?: number | string;
}
export class CrearModuloDto {
  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsObject()
  propiedades: PropiedadesDto;
}
