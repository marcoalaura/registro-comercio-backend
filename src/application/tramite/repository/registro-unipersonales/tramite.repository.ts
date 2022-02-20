/* eslint-disable max-lines-per-function */
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Tramite } from '../../entities/tramite/tramite.entity';
// import { Parametro } from 'src/application/parametro/parametro.entity';

@EntityRepository(Tramite)
export class TramiteRegistroUnipersonalesRepository extends Repository<Tramite> {
  buscarPorId(id: number) {
    return getRepository(Tramite)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.empresa', 'e')
      .leftJoinAndSelect('t.detalles', 'detalle')
      .leftJoinAndSelect('t.documentos', 'documento')
      .leftJoinAndSelect('t.usuarioPropietario', 'propietario')
      .leftJoinAndSelect('propietario.persona', 'persona')
      .select([
        't.id',
        't.version',
        't.codigo',
        't.fechaSolicitud',
        't.fechaConclusion',
        't.fechaObservacion',
        't.fechaReingreso',
        't.fechaAprobacion',
        't.fechaInscrito',
        't.codigoBlockchain',
        't.rutaPdf',
        't.estado',
        't.paso',
        't.idEmpresa',
        't.idParametrica',
        't.idUsuarioPropietario',
        't.idUsuarioFuncionario',
        'e.id',
        'e.nit',
        'detalle.id',
        'detalle.campo',
        'detalle.valor',
        'detalle.valorComplejo',
        'detalle.tipo',
        'detalle.tabla',
        'documento.id',
        'documento.campo',
        'documento.tipo',
        'documento.nroDocumento',
        'documento.emisor',
        'documento.fechaEmision',
        'documento.nombre',
        'documento.ruta',
        'documento.detalle',
        'propietario.id',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.tipoDocumento',
        'persona.nroDocumento',
        'persona.fechaNacimiento',
        'persona.genero',
      ])
      .where('t.id = :id', { id })
      .getOne();
  }

  buscarPorIdConParametro(id: number) {
    return getRepository(Tramite)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.empresa', 'e')
      .leftJoinAndSelect('t.detalles', 'detalle')
      .leftJoinAndSelect('t.documentos', 'documento')
      .leftJoinAndSelect('t.usuarioPropietario', 'propietario')
      .leftJoinAndSelect('propietario.persona', 'persona')
      .select([
        't.id',
        't.version',
        't.codigo',
        't.fechaSolicitud',
        't.fechaConclusion',
        't.fechaObservacion',
        't.fechaReingreso',
        't.fechaAprobacion',
        't.fechaInscrito',
        't.codigoBlockchain',
        't.rutaPdf',
        't.estado',
        't.paso',
        't.idEmpresa',
        't.idParametrica',
        't.idUsuarioPropietario',
        't.idUsuarioFuncionario',
        'e.id',
        'e.nit',
        'detalle.id',
        'detalle.campo',
        'detalle.valor',
        'detalle.valorComplejo',
        'detalle.tipo',
        'detalle.tabla',
        'documento.id',
        'documento.campo',
        'documento.tipo',
        'documento.nroDocumento',
        'documento.emisor',
        'documento.fechaEmision',
        'documento.nombre',
        'documento.ruta',
        'documento.detalle',
        'propietario.id',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.tipoDocumento',
        'persona.nroDocumento',
        'persona.fechaNacimiento',
        'persona.genero',
      ])
      .where('t.id = :id', { id })
      .getOne();
  }
}
