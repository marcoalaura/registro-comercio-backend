import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
// import { IsEnum } from 'class-validator';
// import { TramiteEstado } from '../../../common/constants/index';

export class FiltrosTramitesDto extends PaginacionQueryDto {
  // @Transform(({ value }) => (value ? value.split(',') : null))
  // readonly rol?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly order?: string;

  // Obtener objeto OrderByCondition para usar en funcion query.orderBy(orden);
  get getOrderBy() {
    let o: 'ASC' | 'DESC' = 'ASC';
    let c: string;
    let ordenado = this.orden;
    if (typeof this.orden === 'string') {
      if (this.orden.split(',').length === 1) {
        c = this.orden;
        if (this.orden.startsWith('-')) {
          o = 'DESC';
          c = this.orden.substr(1);
        }
        return {
          [`${c}`]: o,
        };
      }
      ordenado = this.orden.split(',');
    }
    const orderByCondition = {};
    for (const pOrden of ordenado) {
      o = 'ASC';
      c = pOrden;
      if (pOrden.startsWith('-')) {
        o = 'DESC';
        c = pOrden.substr(1);
      }
      orderByCondition[`${c}`] = o;
    }
    return orderByCondition;
  }

  // Obtener objeto OrderByCondition filtrado solo campos ['columna1', 'columna2', ...]
  ordenFiltrar = (campos) => {
    const secuencia = Object.keys(this.getOrderBy).reduce((obj, key) => {
      if (campos.indexOf(key) >= 0) {
        return {
          ...obj,
          [key]: this.getOrderBy[key],
        };
      }
      return obj;
    }, {});
    return Object.keys(secuencia).length ? secuencia : {};
  };
}
