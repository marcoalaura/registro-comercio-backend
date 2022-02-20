/* eslint-disable max-lines-per-function */
import { EntityRepository, getManager, Repository } from 'typeorm';
import { Empresa } from '../../../empresa/entities/empresa.entity';
import { verificarEstadoMatricula } from '../../../../common/lib/control-estado-matricula';
import { FormatoRespuestaFUNDEMPRESA } from '../../../../common/constants';
import * as dayjs from 'dayjs';
import { uniqueElements } from '../../../../common/lib/array.module';
@EntityRepository(Empresa)
export class VistaServiciosRESTRepository extends Repository<Empresa> {
  async buscarMatriculaPorNIT(nit: string) {
    const result = await this.createQueryBuilder('empresa')
      .select(['empresa.nit', 'empresa.matricula', 'empresa.razonSocial'])
      .where('empresa.nit = :nit', { nit: nit })
      .getMany();
    if (result.length > 0) {
      const inforNit = [];
      for (const r of result) {
        inforNit.push({
          IdMatricula: r.matricula,
          RazonSocial: r.razonSocial,
        });
      }
      const empresa = {
        returna: FormatoRespuestaFUNDEMPRESA.rutina,
        texto: result[0].nit,
        detalle: {
          inforNit: inforNit,
        },
        cantidad: inforNit.length.toString(),
        error: '0000',
      };
      return empresa;
    }
    return {
      returna: FormatoRespuestaFUNDEMPRESA.rutina,
      texto: nit,
      detalle: '',
      cantidad: FormatoRespuestaFUNDEMPRESA.sinCantidadPorDefecto,
      error: FormatoRespuestaFUNDEMPRESA.registroNoEncontrado,
    };
  }

  async buscarMatriculas(matricula: string) {
    const manager = getManager();
    const result = await manager.query(
      `SELECT * FROM ${process.env.DB_SCHEMA_EMPRESA}.vista_servicios WHERE emp_matricula = '${matricula}'`,
    );
    if (result.length > 0) {
      const empresa = {
        returna: FormatoRespuestaFUNDEMPRESA.rutina,
        texto: matricula,
        detalle: {
          infoMatricula: {
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
            Telefono: null,
            ClaseCIIU: null,
            CtrlEstado: null,
          },
          MatriculaDatosSucList1: {
            MatriculaDatosSuc: [],
          },
        },
        cantidad: null,
        error: '0000',
      };
      const arr = [];
      for (const r of result) {
        if (r.est_id_establecimiento === null) {
          empresa.detalle.infoMatricula.IdMatricula = r.emp_matricula;
          empresa.detalle.infoMatricula.RazonSocial = r.emp_razon_social;
          empresa.detalle.infoMatricula.TipoSocietario =
            r.emp_cod_tipo_unidad_economica;
          empresa.detalle.infoMatricula.FechaInscripcion =
            r.emp_fecha_inscripcion
              ? dayjs(r.emp_fecha_inscripcion).format('YYYY-MM-DD')
              : null;
          empresa.detalle.infoMatricula.FechaUltRenovacion =
            r.emp_fecha_ultima_actualizacion
              ? dayjs(r.emp_fecha_ultima_actualizacion).format('YYYY-MM-DD')
              : null;
          empresa.detalle.infoMatricula.UltGestionRenovada =
            r.emp_ultimo_anio_actualizacion;
          empresa.detalle.infoMatricula.Nit = r.emp_nit;
          empresa.detalle.infoMatricula.Departamento = r.dir_cod_departamento;
          empresa.detalle.infoMatricula.Provincia = r.dir_cod_provincia;
          empresa.detalle.infoMatricula.Municipio = r.dir_cod_municipio;
          empresa.detalle.infoMatricula.CalleAv = r.dir_nombre_via;
          empresa.detalle.infoMatricula.EntreCalles =
            r.dir_direccion_referencial;
          empresa.detalle.infoMatricula.Nro = r.dir_numero_domicilio;
          empresa.detalle.infoMatricula.Uv = r.dir_uv;
          empresa.detalle.infoMatricula.Mza = r.dir_manzana;
          empresa.detalle.infoMatricula.Edificio = r.dir_edificio;
          empresa.detalle.infoMatricula.Piso = r.dir_piso;
          empresa.detalle.infoMatricula.NroOficina =
            r.dir_numero_nombre_ambiente;
          empresa.detalle.infoMatricula.Zona =
            r.dir_nombre_subdivision_geografica;
          empresa.detalle.infoMatricula.CorreoElectronico = r.con_tipo_contacto;
          empresa.detalle.infoMatricula.Actividad = r.act_cod_actividad;
          empresa.detalle.infoMatricula.Telefono = r.con_tipo_contacto;
          empresa.detalle.infoMatricula.ClaseCIIU = null;
          empresa.detalle.infoMatricula.CtrlEstado = verificarEstadoMatricula(
            r.emp_estado,
            r.emp_cod_estado_actualizacion,
          );
        } else {
          empresa.detalle.MatriculaDatosSucList1.MatriculaDatosSuc.push({
            IdSuc: r.est_id,
            Sucursal: r.est_nombre_establecimiento,
            Departamento: r.dir_cod_departamento,
            Municipio: r.dir_cod_municipio,
            Direccion: r.dir_direccion_referencial,
            Zona: r.dir_nombre_subdivision_geografica,
            Telefono: r.con_descripcion,
            IdClase: null,
            NumId: null,
            Representante: r.per_nombre_completo,
          });
        }
        arr.push(r.est_id);
      }
      empresa.cantidad = uniqueElements(arr).toString();
      return empresa;
    } else {
      return {
        returna: FormatoRespuestaFUNDEMPRESA.rutina,
        texto: matricula,
        detalle: '',
        cantidad: FormatoRespuestaFUNDEMPRESA.sinCantidadPorDefecto,
        error: FormatoRespuestaFUNDEMPRESA.registroNoEncontrado,
      };
    }
  }

  async buscarRepresentantesPorMatricula(matricula: string) {
    const manager = getManager();
    const result = await manager.query(
      `SELECT * FROM ${process.env.DB_SCHEMA_EMPRESA}.vista_servicios WHERE emp_matricula = '${matricula}'`,
    );
    if (result.length > 0) {
      const empresa = {
        returna: FormatoRespuestaFUNDEMPRESA.rutina,
        texto: matricula,
        detalle: {
          Representantes: {
            IdMatricula: result[0].emp_matricula,
            Representante: [],
          },
        },
        cantidad: null,
        error: '0000',
      };

      for (const r of result) {
        empresa.detalle.Representantes.Representante.push({
          NombreVinculo: r.per_nombre_completo,
          NumId: null,
          IdClase: null,
          FecRegistro: r.vin_registro_designacion,
          Noticia: null,
          TipoVinculo: r.vin_cod_tipo_vinculo,
          IdLibro: r.vin_cod_libro_designacion,
          NumReg: null,
        });
      }
      empresa.cantidad =
        empresa.detalle.Representantes.Representante.length.toString();
      return empresa;
    } else {
      return {
        returna: FormatoRespuestaFUNDEMPRESA.rutina,
        texto: matricula,
        detalle: '',
        cantidad: FormatoRespuestaFUNDEMPRESA.sinCantidadPorDefecto,
        error: FormatoRespuestaFUNDEMPRESA.registroNoEncontrado,
      };
    }
  }
}
