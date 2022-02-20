import { EntityRepository, Repository } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';
import { Establecimiento } from '../entities/establecimiento.entity';
import { Status } from '../../../common/constants';
import { EmpresaDto } from '../dto/empresa.dto';
import { CrearEstablecimientoDto } from '../dto/establecimiento.dto';
import { FiltrosEstablecimientoDto } from '../dto/filtros-establecimiento.dto';

@EntityRepository(Establecimiento)
export class EstablecimientoRepository extends Repository<Establecimiento> {
  async listarPorEmpresa(
    idEmpresa,
    paginacionQueryDto: FiltrosEstablecimientoDto,
  ) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('establecimiento')
      .leftJoinAndSelect('establecimiento.empresa', 'empresa')
      .select([
        'establecimiento.id',
        'establecimiento.nombreEstablecimiento',
        'establecimiento.codTipoEstablecimiento',
        'establecimiento.numeroEstablecimiento',
        'establecimiento.estado',
        'empresa.id',
        'empresa.matricula',
        'empresa.matriculaAnterior',
        'empresa.razonSocial',
        'empresa.codTipoUnidadEconomica',
        'empresa.ambitoAccion',
        'empresa.codEstadoActualizacion',
      ])
      .where('establecimiento.estado = :estado', { estado: Status.ACTIVE })
      .andWhere('empresa.id = :idEmpresa', { idEmpresa: idEmpresa })
      .andWhere(
        filtro
          ? 'persona.matricula like :filtro or persona.razonSocial ilike :filtro'
          : '1=1',
        {
          filtro: `%${filtro}%`,
        },
      )
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
    return queryBuilder;
  }

  buscarPorId(id: string) {
    return this.createQueryBuilder('establecimiento')
      .leftJoinAndSelect('establecimiento.empresa', 'empresa')
      .select([
        'establecimiento.id',
        'establecimiento.codTipoEstablecimiento',
        'establecimiento.numeroEstablecimiento',
        'establecimiento.estado',
        'empresa.id',
        'empresa.matricula',
        'empresa.matriculaAnterior',
        'empresa.razonSocial',
        'empresa.codTipoUnidadEconomica',
        'empresa.ambitoAccion',
        'empresa.codEstadoActualizacion',
      ])
      .where({ id })
      .getOne();
  }

  buscarUsuarioPorMatriculaEmpresa(empresa: EmpresaDto) {
    return this.createQueryBuilder('establecimiento')
      .leftJoinAndSelect('establecimiento.empresa', 'empresa')
      .where('empresa.matricula = :matricula', {
        matricula: empresa.matricula,
      })
      .getOne();
  }

  async crear(
    idEmpresa,
    establecimientoDto: CrearEstablecimientoDto,
    usuarioAuditoria: string,
  ) {
    // Empresa
    // const empresa = await this.findOne(idEmpresa);
    const empresa = new Empresa();
    empresa.id = idEmpresa;

    // Establecimiento
    const establecimiento = new Establecimiento();
    establecimiento.empresa = empresa;

    establecimiento.codTipoEstablecimiento =
      establecimientoDto?.codTipoEstablecimiento;
    establecimiento.numeroEstablecimiento =
      establecimientoDto?.numeroEstablecimiento;
    establecimiento.estado = establecimientoDto?.estado ?? Status.CREATE;
    establecimiento.usuarioCreacion = usuarioAuditoria;

    return this.save(establecimiento);
  }

  obtenerDireccion(idEstablecimiento: number) {
    return this.createQueryBuilder('e')
      .innerJoinAndSelect('e.direcciones', 'd')
      .where('e.id = :idEstablecimiento', { idEstablecimiento })
      .andWhere('d.estado = :estado', { estado: Status.ACTIVE })
      .getOne();
  }

  obtenerContactos(idEstablecimiento: number) {
    return this.createQueryBuilder('e')
      .innerJoinAndSelect('e.contactos', 'c')
      .where('e.id = :idEstablecimiento', { idEstablecimiento })
      .andWhere('c.estado = :estado', { estado: Status.ACTIVE })
      .getOne();
  }

  async runTransaction(op) {
    return this.manager.transaction(op);
  }
}
