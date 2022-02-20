import { GruposParametros, Status } from 'src/common/constants';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { GetJsonData } from 'src/common/lib/json.module';
import { EntityRepository, Repository } from 'typeorm';
import { CrearParametroDto } from './dto/crear-parametro.dto';
import { Parametro } from './parametro.entity';

@EntityRepository(Parametro)
export class ParametroRepository extends Repository<Parametro> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('parametro')
      .select([
        'parametro.id',
        'parametro.codigo',
        'parametro.nombre',
        'parametro.grupo',
      ])
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
    return queryBuilder;
  }

  async listarPorGrupo(grupo: string) {
    const queryBuilder = await this.createQueryBuilder('parametro')
      .select(['parametro.id', 'parametro.codigo', 'parametro.nombre'])
      .where('parametro.grupo = :grupo', {
        grupo,
      })
      .getMany();
    return queryBuilder;
  }

  async crear(parametroDto: CrearParametroDto) {
    const { codigo, nombre, grupo, descripcion } = parametroDto;

    const parametro = new Parametro();
    parametro.codigo = codigo;
    parametro.nombre = nombre;
    parametro.grupo = grupo;
    parametro.descripcion = descripcion;

    await this.save(parametro);
    return parametro;
  }

  async listarDepartamentos(query: PaginacionQueryDto) {
    const { limite, saltar, filtro } = query;
    const parametros = filtro ? GetJsonData(filtro) : null;
    const queryBuilder = this.createQueryBuilder('p')
      .select(['p.id', 'p.codigo', 'p.nombre'])
      .where('p.estado = :estado and p.grupo = :grupo', {
        estado: Status.ACTIVE,
        grupo: GruposParametros.DEPARTAMENTO,
      })
      .offset(saltar)
      .limit(limite);
    if (parametros?.id) {
      queryBuilder.andWhere('p.id = :id', { id: parametros.id });
    }
    if (parametros?.codigo) {
      queryBuilder.andWhere('p.codigo = :codigo', {
        codigo: parametros.codigo,
      });
    }
    return queryBuilder.getManyAndCount();
  }

  async listarTerritorios(query: PaginacionQueryDto) {
    const { limite, saltar, filtro } = query;
    const parametros = filtro ? GetJsonData(filtro) : null;
    let tipo = null;
    console.log('=============================> parametros', parametros);
    if (parametros?.tipo === 'provincias') {
      tipo = GruposParametros.PROVINCIA;
    }
    if (parametros?.tipo === 'municipios') {
      tipo = GruposParametros.MUNICIPIO;
    }

    console.log('=============================> tipo', tipo);
    const queryBuilder = this.createQueryBuilder('p')
      .select(['p.id', 'p.codigo', 'p.nombre'])
      .where('p.estado = :estado and p.grupo = :grupo', {
        estado: Status.ACTIVE,
        grupo: tipo,
      })
      .offset(saltar)
      .limit(limite);
    if (parametros?.codigo) {
      queryBuilder.andWhere('p.codigo ilike :filtro', {
        filtro: `${parametros.codigo}%`,
      });
    }
    return queryBuilder.getManyAndCount();
  }

  async listarMunicipiosByDpto(id: string) {
    const queryBuilder = this.createQueryBuilder('p')
      .select(['p.id', 'p.codigo', 'p.nombre'])
      .where(
        'p.estado = :estado and p.grupo = :grupo and p.codigo like :filtro',
        {
          estado: Status.ACTIVE,
          grupo: GruposParametros.MUNICIPIO,
          filtro: `${id}%`,
        },
      );
    return queryBuilder.getManyAndCount();
  }

  async obtenerDescripcion(grupo: string, codigo: string) {
    const queryBuilder = this.createQueryBuilder('p')
      .select(['p.descripcion'])
      .where('p.codigo = :codigo and p.grupo = :grupo', { codigo, grupo });
    return queryBuilder.getOne();
  }
}
