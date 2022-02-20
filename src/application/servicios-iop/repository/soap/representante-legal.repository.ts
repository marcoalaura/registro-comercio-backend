/* eslint-disable max-lines-per-function */
import { EntityRepository, getManager, Repository } from 'typeorm';
import { Empresa } from '../../../empresa/entities/empresa.entity';

@EntityRepository(Empresa)
export class VistaRepresentanteLegalRepository extends Repository<Empresa> {
  async buscarPorMatricula(matricula: string) {
    const manager = getManager();
    const result = await manager.query(
      `SELECT * FROM ${process.env.DB_SCHEMA_EMPRESA}.vista_servicios WHERE emp_matricula = '${matricula}'`,
    );
    if (result.length > 0) {
      const representantes = [];
      for (const r of result) {
        representantes.push({
          IdMatricula: r.emp_matricula,
          NombreVinculo: r.per_nombre_completo,
          NumId: null,
          IdClase: null,
          FecRegistro: r.vin_registro_designacion,
          NumDoc: r.pju_numero_documento,
          FecDocumento: null,
          NoticiaDocumento: null,
          TipoVinculo: r.vin_cod_tipo_vinculo,
          IdLibro: r.vin_cod_libro_designacion,
          NumReg: null,
        });
      }
      return representantes;
    } else {
      return null;
    }
  }
}
