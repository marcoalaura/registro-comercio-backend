import { EntityRepository, getManager, Repository } from 'typeorm';
import { Empresa } from '../../../empresa/entities/empresa.entity';

@EntityRepository(Empresa)
export class ReporteASFIRepository extends Repository<Empresa> {
  async generarListadoReporte() {
    const manager = getManager();
    const result = await manager.query(
      `SELECT * FROM ${process.env.DB_SCHEMA_EMPRESA}.vista_servicios 
       WHERE emp_estado != 'CANCELADO' AND emp_cod_estado_actualizacion = '0' LIMIT 50`,
    );
    if (result.length > 0) {
      const actividades = [];
      for (const r of result) {
        actividades.push({
          IdMatricula: r.emp_matricula,
          TxtActividad: null,
          Seccion: null,
          Division: null,
          Clase: null,
          VersionClasificador: null,
        });
      }
      return actividades;
    } else {
      return null;
    }
  }
}
