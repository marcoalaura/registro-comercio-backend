// import { Transform } from 'class-transformer';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';

export class FiltrosEstablecimientoDto extends PaginacionQueryDto {
  // @Transform(({ value }) => (value ? value.split(',') : null))
  // readonly rol?: string;
}
