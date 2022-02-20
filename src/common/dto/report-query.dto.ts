import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetJsonData } from '../lib/json.module';

const FORMAT_DEFAULT = 'pdf';

export class ReporteQueryDto {
  @IsNotEmpty()
  @IsString()
  readonly filtro?: string;

  @IsString()
  @IsOptional()
  readonly format?: string = FORMAT_DEFAULT;

  get filtroJSON(): any {
    return this.filtro ? GetJsonData(this.filtro) : {};
  }

  get idDepartamento(): string {
    return this.filtroJSON && this.filtroJSON.idDepartamento
      ? this.filtroJSON.idDepartamento
      : null;
  }
}
