import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';

export class FiltrosPublicacionDto extends PaginacionQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  readonly order?: string;
}
