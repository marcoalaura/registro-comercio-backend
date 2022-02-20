import { EntityRepository, getManager, Repository } from 'typeorm';
import { Empresa } from '../empresa/entities/empresa.entity';

@EntityRepository(Empresa)
export class ReporteRepository extends Repository<Empresa> {
  obtenerDatosEmpresa(idEmpresa: number) {
    return this.createQueryBuilder('empresa')
      .leftJoinAndSelect(
        'empresa.establecimientos',
        'establecimiento',
        'establecimiento.codTipoEstablecimiento = :casaMatriz',
        { casaMatriz: 1 },
      )
      .leftJoinAndSelect('establecimiento.vinculados', 'vinculado')
      .leftJoinAndSelect('establecimiento.direcciones', 'direccion')
      .leftJoinAndSelect('vinculado.persona', 'persona')
      .leftJoinAndSelect('vinculado.personaJuridica', 'personaJuridica')
      .leftJoinAndSelect('empresa.objetos_sociales', 'objetosSociales')
      .leftJoinAndSelect('empresa.capitales', 'capitales')
      .select([
        'empresa.nit as nit',
        'empresa.matricula as matricula',
        'empresa.razonSocial as "razonSocial"',
        'empresa.codTipoPersona as "codTipoPersona"',
        'empresa.fechaInscripcion as "fechaInscripcion"',
        'empresa.fechaHabilitacion as "fechaHabilitacion"',
        'objetosSociales.objetoSocial as "objetoSocial"',
        'capitales.capitalSuscrito as capital',
        'establecimiento.numeroEstablecimiento as "numeroEstablecimiento"',
        'direccion.direccionReferencial as domicilio',
        'vinculado.registroDesignacion as "registroDesignacion"',
        'vinculado.codLibroDesignacion as "codLibroDesignacion"',
        'persona.nombre_completo as "nombrePropietario"',
        'persona.nroDocumento as "numeroDocumento"',
      ])
      .where('empresa.id = :idEmpresa', { idEmpresa })
      .getRawOne();
  }

  obtenerDatosEmpresaVista(idEmpresa: number) {
    const query = `
      select ve.* 
      from ${process.env.DB_SCHEMA_EMPRESA}.vista_servicios ve
      where ve.emp_id = ${idEmpresa}
      ;
    `;

    const manager = getManager();
    return manager.query(query);
  }
}
