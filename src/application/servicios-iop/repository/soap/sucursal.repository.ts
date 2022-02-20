/* eslint-disable max-lines-per-function */
import { EntityRepository, getManager, Repository } from 'typeorm';
import { Empresa } from '../../../empresa/entities/empresa.entity';

@EntityRepository(Empresa)
export class VistaSucursalRepository extends Repository<Empresa> {
  async buscarPorMatricula(matricula: string) {
    const manager = getManager();
    const result = await manager.query(
      `SELECT * FROM ${process.env.DB_SCHEMA_EMPRESA}.vista_servicios WHERE emp_matricula = '${matricula}'`,
    );
    if (result.length > 0) {
      const empresa = {
        IdMatricula: null,
        RazonSocial: null,
        FechaInscripcion: null,
        FechaUltimaRenovacion: null,
        UltimaGestionRenovada: null,
        Nit: null,
        MatrículaDatosSucList1: [],
      };
      for (const r of result) {
        if (r.est_id_establecimiento === null) {
          empresa.IdMatricula = r.emp_matricula;
          empresa.RazonSocial = r.emp_razon_social;
          empresa.FechaInscripcion = r.emp_fecha_inscripcion;
          empresa.FechaUltimaRenovacion = r.emp_fecha_ultima_actualizacion;
          empresa.UltimaGestionRenovada = r.emp_ultimo_anio_actualizacion;
          empresa.Nit = r.emp_nit;
        } else {
          empresa.MatrículaDatosSucList1.push({
            MatriculaDatosSuc: {
              IdSuc: r.est_id,
              Sucursal: r.est_nombre_establecimiento,
              Municipio: r.dir_cod_municipio,
              Direccion: r.dir_direccion_referencial,
              Zona: r.dir_nombre_subdivision_geografica,
              Telefono: r.con_tipo_contacto,
              Representante: r.per_nombre_completo,
            },
          });
        }
      }
      return empresa;
    } else {
      return null;
    }
  }
}
