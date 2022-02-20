import { IsNotEmpty, IsNumber } from 'class-validator';

export class EditarTramiteSeccionDto {
  @IsNumber()
  id: number;

  @IsNumber()
  idSeccionParametrica: number;

  @IsNumber()
  idTramite: number;

  @IsNotEmpty()
  editado: boolean;

  @IsNotEmpty()
  usuarioAuditoria: string;
}
