/* eslint-disable max-lines-per-function */
import { EntityRepository, getManager, Repository } from 'typeorm';
import { Empresa } from '../../../empresa/entities/empresa.entity';
import { verificarEstadoMatricula } from '../../../../common/lib/control-estado-matricula';
import * as dayjs from 'dayjs';

@EntityRepository(Empresa)
export class VistaEmpresaRepository extends Repository<Empresa> {
  async buscarPorNIT(nit: string) {
    const result = await this.createQueryBuilder('empresa')
      .select([
        'empresa.nit',
        'empresa.matricula',
        'empresa.razonSocial',
        'empresa.estado',
        'empresa.codEstadoActualizacion',
      ])
      .where('empresa.nit = :nit', { nit: nit })
      .getOne();
    if (result) {
      const empresa = {
        IdMatricula: result.matricula,
        Nit: result.nit,
        RazonSocial: result.razonSocial,
      };
      const ctrlEstado = verificarEstadoMatricula(
        result.estado,
        result.codEstadoActualizacion,
      );
      empresa['CtrlEstado'] = ctrlEstado;
      return empresa;
    }
    return null;
  }

  async verEstadoMatriculaComercio(matricula: string) {
    const result = await this.createQueryBuilder('empresa')
      .select([
        'empresa.matricula',
        'empresa.razonSocial',
        'empresa.matricula',
        'empresa.fechaInscripcion',
        'empresa.vigencia',
        'empresa.fechaUltimaActualizacion',
        'empresa.ultimoAnioActualizacion',
        'empresa.fechaVigencia',
        'empresa.nit',
        'empresa.estado',
        'empresa.codEstadoActualizacion',
      ])
      .where('empresa.matricula = :matricula', { matricula: matricula })
      .getOne();
    if (result) {
      const empresa = {
        IdMatricula: result.matricula,
        RazonSocial: result.razonSocial,
        FechaInscripcion: result.fechaInscripcion
          ? dayjs(result.fechaInscripcion).format('YYYY-MM-DD')
          : null,
        FechaUltRenovacion: result.ultimoAnioActualizacion
          ? dayjs(result.ultimoAnioActualizacion).format('YYYY-MM-DD')
          : null,
        UltGestionRenovada: result.fechaUltimaActualizacion,
        VigenciaMatricula: result.vigencia,
        FecVigenciaMatricula: result.fechaVigencia
          ? dayjs(result.fechaVigencia).format('YYYY-MM-DD')
          : null,
        Nit: result.nit,
      };
      const ctrlEstado = verificarEstadoMatricula(
        result.estado,
        result.codEstadoActualizacion,
      );
      empresa['CtrlEstado'] = ctrlEstado;
      return empresa;
    }
    return null;
  }

  async buscarPorMatricula(matricula: string) {
    const manager = getManager();
    const result = await manager.query(
      `SELECT * FROM ${process.env.DB_SCHEMA_EMPRESA}.vista_servicios WHERE emp_matricula = '${matricula}'`,
    );

    if (result.length > 0) {
      const empresa = {
        IdMatricula: null,
        RazonSocial: null,
        TipoSocietario: null,
        FechaInscripcion: null,
        FechaUltRenovacion: null,
        UltGestionRenovada: null,
        Nit: null,
        Departamento: null,
        Provincia: null,
        Municipio: null,
        CalleAv: null,
        EntreCalles: null,
        Nro: null,
        Uv: null,
        Mza: null,
        Edificio: null,
        Piso: null,
        NroOficina: null,
        Zona: null,
        CorreoElectronico: null,
        Actividad: null,
        ClaseCIIU: null,
        CtrlEstado: null,
        MatriculaDatosSucList1: [],
      };
      for (const r of result) {
        if (r.est_id_establecimiento === null) {
          empresa.IdMatricula = r.emp_matricula;
          empresa.RazonSocial = r.emp_razon_social;
          empresa.TipoSocietario = r.emp_cod_tipo_unidad_economica;
          empresa.FechaInscripcion = r.emp_fecha_inscripcion
            ? dayjs(r.emp_fecha_inscripcion).format('YYYY-MM-DD')
            : null;
          empresa.FechaUltRenovacion = r.emp_fecha_ultima_actualizacion
            ? dayjs(r.emp_fecha_ultima_actualizacion).format('YYYY-MM-DD')
            : null;
          empresa.UltGestionRenovada = r.emp_ultimo_anio_actualizacion;
          empresa.Nit = r.emp_nit;
          empresa.Departamento = r.dir_cod_departamento;
          empresa.Provincia = r.dir_cod_provincia;
          empresa.Municipio = r.dir_cod_municipio;
          empresa.CalleAv = r.dir_nombre_via;
          empresa.EntreCalles = r.dir_direccion_referencial;
          empresa.Nro = r.dir_numero_domicilio;
          empresa.Uv = r.dir_uv;
          empresa.Mza = r.dir_manzana;
          empresa.Edificio = r.dir_edificio;
          empresa.Piso = r.dir_piso;
          empresa.NroOficina = r.dir_numero_domicilio;
          empresa.Zona = r.dir_nombre_subdivision_geografica;
          empresa.CorreoElectronico = r.con_tipo_contacto;
          empresa.Actividad = r.act_cod_actividad;
          empresa.ClaseCIIU = null;
          empresa.CtrlEstado = verificarEstadoMatricula(
            result[0].emp_estado,
            result[0].emp_cod_estado_actualizacion,
          );
        } else {
          empresa.MatriculaDatosSucList1.push({
            MatriculaDatosSuc: {
              IdSuc: r.est_id,
              Sucursal: r.est_nombre_establecimiento,
              Departamento: r.dir_cod_departamento,
              Municipio: r.dir_cod_municipio,
              Direccion: r.dir_direccion_referencial,
              Zona: r.dir_nombre_subdivision_geografica,
              Telefono: r.con_tipo_contacto,
              IdClase: null,
              NumId: null,
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

  async buscarPorRazonSocial(razonSocial: string) {
    const result = await this.createQueryBuilder('empresa')
      .select(['empresa.matricula', 'empresa.razonSocial', 'empresa.nit'])
      .where('empresa.razon_social LIKE :razonSocial LIMIT 100', {
        razonSocial: `%${razonSocial}%`,
      })
      .getMany();
    if (result.length > 0) {
      const empresa = [];
      for (const r of result) {
        empresa.push({
          IdMatricula: r.matricula,
          RazonSocial: r.razonSocial,
          Nit: r.nit,
        });
      }
      return empresa;
    } else {
      return null;
    }
  }
}
