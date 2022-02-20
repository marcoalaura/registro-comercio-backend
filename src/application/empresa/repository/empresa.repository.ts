/* eslint-disable max-lines-per-function */
import { EntityRepository, Repository } from 'typeorm';
// import { Persona } from '../entity/persona.entity';
import { CrearEmpresaDto } from '../dto/empresa.dto';
import { Empresa } from '../entities/empresa.entity';
import { Parametro } from 'src/application/parametro/parametro.entity';
import { Status } from '../../../common/constants';
import { FiltrosEmpresaDto } from '../dto/filtros-empresa.dto';
import { GruposParametros } from '../../../common/constants';

@EntityRepository(Empresa)
export class EmpresaRepository extends Repository<Empresa> {
  async listar(paginacionQueryDto: FiltrosEmpresaDto) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('empresa')
      .select([
        'empresa.id',
        'empresa.matricula',
        'empresa.razonSocial',
        'empresa.estado',
      ])
      .where(
        filtro
          ? 'empresa.matricula like :filtro or empresa.razonSocial ilike :filtro'
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

  async listarPorUsuario(
    paginacionQueryDto: FiltrosEmpresaDto,
    usuarioAuditoria,
  ) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('empresa')
      .leftJoinAndSelect('empresa.establecimientos', 'establecimiento')
      .leftJoinAndSelect('establecimiento.vinculados', 'vinculado')
      .leftJoinAndSelect('vinculado.persona', 'persona')
      .leftJoinAndSelect('persona.usuarios', 'usuario')
      .leftJoinAndSelect('vinculado.personaJuridica', 'personaJuridica')
      .leftJoinAndSelect('empresa.objetos_sociales', 'objetos_sociales')
      .select(['empresa', 'establecimiento', 'vinculado', 'objetos_sociales'])
      .where('usuario.id = :id', { id: usuarioAuditoria })
      .andWhere('objetos_sociales.estado = :estado', { estado: Status.ACTIVE })
      .andWhere(
        filtro
          ? 'empresa.matricula like :filtro or empresa.razonSocial ilike :filtro'
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

  async listarHabilitacionPorUsuario(
    paginacionQueryDto: FiltrosEmpresaDto,
    usuarioAuditoria,
  ) {
    // const { limite, saltar } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('empresa')
      .leftJoinAndSelect(
        'empresa.establecimientos',
        'establecimiento',
        'establecimiento.codTipoEstablecimiento = :casaMatriz',
        { casaMatriz: 1 },
      )
      .leftJoinAndSelect('empresa.habilitacionesExcepciones', 'excepcion')
      .leftJoinAndSelect('establecimiento.vinculados', 'vinculado')
      .leftJoinAndSelect('establecimiento.direcciones', 'direccion')
      .leftJoinAndSelect('vinculado.persona', 'persona')
      .leftJoinAndSelect('persona.usuarios', 'usuario')
      .leftJoinAndSelect('vinculado.personaJuridica', 'personaJuridica')
      .leftJoinAndSelect('establecimiento.contactos', 'contacto')
      .leftJoinAndMapOne(
        'empresa.tipoPersona',
        Parametro,
        'tipoSocietario',
        'empresa.codTipoPersona = tipoSocietario.codigo AND tipoSocietario.grupo=:grupoTipoPersona',
        { grupoTipoPersona: GruposParametros.TIPO_SOCIETARIO },
      )
      .leftJoinAndMapOne(
        'direccion.departamento',
        Parametro,
        'departamento',
        'direccion.codDepartamento = departamento.codigo AND departamento.grupo=:grupoDepartamento',
        { grupoDepartamento: GruposParametros.DEPARTAMENTO },
      )
      .leftJoinAndMapOne(
        'direccion.provincia',
        Parametro,
        'provincia',
        'direccion.codProvincia = provincia.codigo AND provincia.grupo=:grupoProvincia',
        { grupoProvincia: GruposParametros.PROVINCIA },
      )
      .leftJoinAndMapOne(
        'direccion.municipio',
        Parametro,
        'municipio',
        'direccion.codMunicipio = municipio.codigo AND municipio.grupo=:grupoMunicipio',
        { grupoMunicipio: GruposParametros.MUNICIPIO },
      )
      .select([
        'empresa.id',
        'empresa.nit',
        'empresa.matricula',
        'empresa.matriculaAnterior',
        'empresa.razonSocial',
        'empresa.estado',
        'empresa.escenario',
        'empresa.observacion',
        'empresa.codTipoPersona',
        'empresa.fechaInscripcion',
        'empresa.fechaHabilitacion',
        'tipoSocietario.descripcion',
        'establecimiento.id',
        'establecimiento.numeroEstablecimiento',
        'direccion.id',
        'direccion.nombreSubdivisionGeografica',
        'direccion.nombreVia',
        'direccion.numeroDomicilio',
        'direccion.manzana',
        'direccion.uv',
        'direccion.edificio',
        'direccion.piso',
        'direccion.numeroNombreAmbiente',
        'direccion.direccionReferencial',
        'direccion.latitud',
        'direccion.longitud',
        'departamento.descripcion',
        'provincia.descripcion',
        'municipio.descripcion',
        'contacto.id',
        'contacto.tipoContacto',
        'contacto.descripcion',
        'excepcion.id',
        'excepcion.estado',
        'excepcion.motivo',
        'excepcion.fechaExcepcion',
      ])
      // .addSelect('p.descripcion', 'p_descripcion')
      .where('usuario.id = :id', { id: usuarioAuditoria })
      // .offset(saltar)
      // .limit(limite)
      .getManyAndCount();
    return queryBuilder;
  }

  //   buscarUsuario(usuario: string) {
  //     // return Usuario.findOne({ usuario });
  //     return this.createQueryBuilder('usuario')
  //       .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
  //       .leftJoinAndSelect('usuarioRol.rol', 'rol')
  //       .where({ usuario: usuario })
  //       .getOne();
  //   }

  buscarPorId(id: string) {
    return this.createQueryBuilder('empresa')
      .leftJoinAndSelect(
        'empresa.establecimientos',
        'establecimiento',
        'establecimiento.codTipoEstablecimiento = :casaMatriz',
        { casaMatriz: 1 },
      )
      .leftJoinAndSelect('empresa.habilitacionesExcepciones', 'excepcion')
      .leftJoinAndSelect('establecimiento.vinculados', 'vinculado')
      .leftJoinAndSelect('establecimiento.direcciones', 'direccion')
      .leftJoinAndSelect('vinculado.persona', 'persona')
      .leftJoinAndSelect('persona.usuarios', 'usuario')
      .leftJoinAndSelect('vinculado.personaJuridica', 'personaJuridica')
      .leftJoinAndSelect('establecimiento.contactos', 'contacto')
      .leftJoinAndMapOne(
        'empresa.tipoPersona',
        Parametro,
        'tipoSocietario',
        'empresa.codTipoPersona = tipoSocietario.codigo AND tipoSocietario.grupo=:grupoTipoPersona',
        { grupoTipoPersona: GruposParametros.TIPO_SOCIETARIO },
      )
      .leftJoinAndMapOne(
        'direccion.departamento',
        Parametro,
        'departamento',
        'direccion.codDepartamento = departamento.codigo AND departamento.grupo=:grupoDepartamento',
        { grupoDepartamento: GruposParametros.DEPARTAMENTO },
      )
      .leftJoinAndMapOne(
        'direccion.provincia',
        Parametro,
        'provincia',
        'direccion.codProvincia = provincia.codigo AND provincia.grupo=:grupoProvincia',
        { grupoProvincia: GruposParametros.PROVINCIA },
      )
      .leftJoinAndMapOne(
        'direccion.municipio',
        Parametro,
        'municipio',
        'direccion.codMunicipio = municipio.codigo AND municipio.grupo=:grupoMunicipio',
        { grupoMunicipio: GruposParametros.MUNICIPIO },
      )
      .select([
        'empresa.id',
        'empresa.nit',
        'empresa.matricula',
        'empresa.matriculaAnterior',
        'empresa.razonSocial',
        'empresa.estado',
        'empresa.escenario',
        'empresa.observacion',
        'empresa.codTipoPersona',
        'empresa.fechaInscripcion',
        'empresa.fechaHabilitacion',
        'tipoSocietario.descripcion',
        'establecimiento.id',
        'establecimiento.numeroEstablecimiento',
        'direccion.id',
        'direccion.nombreSubdivisionGeografica',
        'direccion.nombreVia',
        'direccion.numeroDomicilio',
        'direccion.manzana',
        'direccion.uv',
        'direccion.edificio',
        'direccion.piso',
        'direccion.numeroNombreAmbiente',
        'direccion.direccionReferencial',
        'direccion.latitud',
        'direccion.longitud',
        'departamento.descripcion',
        'provincia.descripcion',
        'municipio.descripcion',
        'contacto.id',
        'contacto.tipoContacto',
        'contacto.descripcion',
        'excepcion.id',
        'excepcion.estado',
        'excepcion.motivo',
        'excepcion.fechaExcepcion',
      ])
      .where('empresa.id = :id', { id: id })
      .getOne();
  }

  buscarPorNIT(matricula: string) {
    return this.createQueryBuilder('empresa')
      .where('matricula = :nit', { nit: matricula })
      .getOne();
  }

  buscarPorRazonSocial(razonSocial: string) {
    return this.createQueryBuilder('empresa')
      .where('razonSocial = :razonSocial', { razonSocial })
      .getOne();
  }

  async buscarPorMatricula(matricula: string) {
    const campos = [
      'empresa.id',
      'empresa.nit',
      'empresa.matricula',
      'empresa.matriculaAnterior',
      'empresa.escenario',
      'empresa.estado',
    ];
    let respuesta = null;
    respuesta = await this.createQueryBuilder('empresa')
      .select(campos)
      .where('matricula = :matricula AND estado = :estado', {
        matricula,
        estado: 'ACTIVO',
      })
      .getOne();
    if (!respuesta) {
      respuesta = await this.createQueryBuilder('empresa')
        .select(campos)
        .where('matricula_anterior = :matricula AND estado = :estado', {
          matricula,
          estado: 'PENDIENTE',
        })
        .getOne();
    }
    console.log(respuesta);
    return respuesta;
  }

  async consultarEstadoPorMatriculaAnterior(matricula: string) {
    const respuesta = await this.createQueryBuilder('empresa')
      .select([
        'empresa.matriculaAnterior',
        'empresa.estado',
        'empresa.escenario',
        'empresa.observacion',
      ])
      .where('empresa.matriculaAnterior = :matricula', { matricula: matricula })
      .getOne();
    return respuesta;
  }

  buscarTipoSocietarioPorIdEmpresa(id: string) {
    return this.createQueryBuilder('empresa')
      .select([
        'empresa.id',
        'empresa.estado',
        'empresa.codTipoPersona',
        'empresa.matricula',
        'empresa.razonSocial',
      ])
      .where('empresa.id = :id', { id: id })
      .getOne();
  }

  async crear(empresaDto: CrearEmpresaDto, usuarioAuditoria: string) {
    const empresa = new Empresa();
    empresa.estado = empresaDto?.estado ?? Status.CREATE;
    empresa.razonSocial = empresaDto?.razonSocial;
    empresa.usuarioCreacion = usuarioAuditoria;
    await this.refrescarVistaEmpresas();
    return this.save(empresa);
  }

  async runTransaction(op) {
    return this.manager.transaction(op);
  }

  async refrescarVistaEmpresas(): Promise<any[]> {
    // refrescar al crear y actualizar empresa
    return await this.query('select refrescar_vista_empresas_homonimia()');
  }
}
