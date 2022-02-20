import { Injectable, PreconditionFailedException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FiltrosPublicacionDto } from '../dto/filtros-publicacion.dto';

import { nanoid } from 'nanoid';
import { ParametricaRepository } from 'src/application/tramite/repository/parametrica.repository';
import { TramiteRepository } from 'src/application/tramite/repository/tramite.repository';
import { TramiteEstado } from 'src/common/constants';
import { TramiteBitacoraRepository } from 'src/application/tramite/repository/tramite-bitacora.repository';
import { TramiteDetalleRepository } from 'src/application/tramite/repository/tramite-detalle.repository';
import { EmpresaRepository } from 'src/application/empresa/repository/empresa.repository';
import { PlantillaCampoComun } from 'src/common/constants/plantillas';

const estadosValidos = [TramiteEstado.SOLICITUD, TramiteEstado.CONFIRMADO];

/* eslint-disable max-lines-per-function */
@Injectable()
export class PublicacionTramiteService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(TramiteRepository)
    private tramiteRepository: TramiteRepository,
    @InjectRepository(TramiteDetalleRepository)
    private tramiteDetalleRepository: TramiteDetalleRepository,
    @InjectRepository(ParametricaRepository)
    private parametricaRepository: ParametricaRepository,
    @InjectRepository(EmpresaRepository)
    private empresaRepository: EmpresaRepository,
  ) {}

  async listarSolicitudes(
    @Query() paginacionQueryDto: FiltrosPublicacionDto,
    idEmpresa: string,
  ) {
    const resultado = await this.tramiteRepository.listarPublicaciones(
      paginacionQueryDto,
      idEmpresa,
      TramiteEstado.SOLICITUD,
    );
    return resultado;
  }

  async listarConfirmados(
    @Query() paginacionQueryDto: FiltrosPublicacionDto,
    idEmpresa: string,
  ) {
    const resultado = await this.tramiteRepository.listarPublicaciones(
      paginacionQueryDto,
      idEmpresa,
      TramiteEstado.CONFIRMADO,
    );
    return resultado;
  }

  async obtener(id: number, idEmpresa: string) {
    const publicacionTramite =
      await this.tramiteRepository.obtenerPublicacionPorId(id);
    await this.validarPublicacion(publicacionTramite, idEmpresa);

    const publicacionTramiteDetalle =
      await this.tramiteDetalleRepository.buscarPorIdTramite(id);
    publicacionTramiteDetalle.forEach((item) => {
      if (item.campo === PlantillaCampoComun.NRO_MATRICULA)
        publicacionTramite.matricula = item.valor;
      if (item.campo === PlantillaCampoComun.RESUMEN)
        publicacionTramite.resumen = item.valor;
    });

    return publicacionTramite;
  }

  async anular(usuarioAuditoria: any, id: number, idEmpresa: string) {
    const publicacionTramite =
      await this.tramiteRepository.obtenerPublicacionPorId(id);
    await this.validarPublicacion(publicacionTramite, idEmpresa);

    if (!estadosValidos.includes(publicacionTramite.estado)) {
      throw new PreconditionFailedException(
        `No se puede anular la publicación en estado ${publicacionTramite.estado}.`,
      );
    }

    await this.tramiteRepository.actualizarEstadoPublicacion({
      usuarioAuditoria,
      id,
      estado: TramiteEstado.ANULADO,
    });
    return { id };
  }

  async validarPublicacion(publicacionTramite: any, idEmpresa: string) {
    if (!publicacionTramite) {
      throw new PreconditionFailedException(
        `No se ha encontrado la publicación.`,
      );
    }
    if (publicacionTramite.idEmpresa !== idEmpresa) {
      throw new PreconditionFailedException(
        `La publicación no corresponde a la Empresa.`,
      );
    }
    return publicacionTramite;
  }

  async crearPublicacion(
    paramsPublicacion: any,
    camposFormularioPublicacion: any,
  ) {
    console.log(
      'Crear publicacion en estado solicitud!!',
      paramsPublicacion.idEmpresa,
      paramsPublicacion.fechaPublicacion,
      paramsPublicacion.idCatalogoPublicacion,
    );

    const catalogoPublicacion =
      await this.parametricaRepository.obtenerCataloTramitePorId(
        paramsPublicacion.idCatalogoPublicacion,
      );
    console.log('Catalogo publicacion obtenido :: ', catalogoPublicacion);

    const datosEmpresa =
      await this.empresaRepository.buscarTipoSocietarioPorIdEmpresa(
        paramsPublicacion.idEmpresa,
      );

    const data = {
      codigo: nanoid(),
      version: catalogoPublicacion.version,
      nombre: catalogoPublicacion.nombre,
      estado: TramiteEstado.SOLICITUD,
      fechaPublicacion: paramsPublicacion.fechaPublicacion,
      idEmpresa: paramsPublicacion.idEmpresa,
      idCatalogoPublicacion: paramsPublicacion.idCatalogoPublicacion,
      usuarioAuditoria: paramsPublicacion.usuarioAuditoria,
    };

    const nuevaPublicacionTramite = await this.crearPublicacionTramite(
      data,
      camposFormularioPublicacion,
      { catalogoPublicacion, datosEmpresa },
    );
    console.log(
      'Nueva publicacion-tramite (tramite de tipo publicacion) :: ',
      nuevaPublicacionTramite,
    );
    return nuevaPublicacionTramite;
  }

  async crearPublicacionTramite(
    data: any,
    camposFormularioPublicacion: any,
    { catalogoPublicacion, datosEmpresa }: any,
  ) {
    const operacionSolicitudPublicacion = async (transaction) => {
      const tramiteRepositoryTransaction =
        transaction.getCustomRepository(TramiteRepository);

      const tramiteBitacoraRepositoryTransaction =
        transaction.getCustomRepository(TramiteBitacoraRepository);

      const tramiteDetalleRepositoryTransaction =
        transaction.getCustomRepository(TramiteDetalleRepository);

      const nuevaPublicacion =
        await tramiteRepositoryTransaction.crearSolicitudPublicacion(data);

      await tramiteBitacoraRepositoryTransaction.crear({
        operacion: TramiteEstado.SOLICITUD,
        idTramite: nuevaPublicacion.raw[0].id,
        idUsuario: data.usuarioAuditoria,
        usuarioAuditoria: data.usuarioAuditoria,
      });

      const objCamposFormulario = await this.construirCamposFormulario(
        camposFormularioPublicacion,
        nuevaPublicacion.raw[0].id,
        data.usuarioAuditoria,
      );
      console.log('objCamposFormulario :: generado :: ', objCamposFormulario);

      const objCamposResumenEmpresa = await this.generarCamposResumenEmpresa(
        datosEmpresa,
        {
          campoValorFormulario: objCamposFormulario,
          idTramite: nuevaPublicacion.raw[0].id,
          usuarioAuditoria: data.usuarioAuditoria,
        },
        catalogoPublicacion,
      );
      console.log('objCamposResumen :: generado :: ', objCamposResumenEmpresa);

      const arrCampoValorPublicacion = [
        ...objCamposFormulario,
        ...objCamposResumenEmpresa,
      ];
      const idxCampoResumen = objCamposResumenEmpresa.findIndex(
        (campo) => campo.campo === PlantillaCampoComun.RESUMEN,
      );

      await tramiteDetalleRepositoryTransaction.crear(arrCampoValorPublicacion);

      return {
        id: nuevaPublicacion.raw[0].id,
        titulo: nuevaPublicacion.raw[0].nombre,
        codigo: nuevaPublicacion.raw[0].codigo,
        estado: nuevaPublicacion.raw[0].estado,
        fechaPublicacion: nuevaPublicacion.raw[0].fechaPublicacion,
        resumen: objCamposResumenEmpresa[idxCampoResumen].valor,
      };
    };

    const result: any = await this.tramiteRepository.runTransaction(
      operacionSolicitudPublicacion,
    );

    return result;
  }

  async construirCamposFormulario(
    campos: any,
    idTramite: number,
    usuarioAuditoria: number,
  ) {
    console.log(
      '[PublicacionTramiteService] Formar objeto formulario-publicacion',
      campos,
      idTramite,
      usuarioAuditoria,
    );
    const arrCampos = [];
    campos.forEach((campo) => {
      arrCampos.push({
        campo: campo.campo,
        valor: campo.valor,
        tipo: campo.tipo,
        tabla: campo.tabla,
        idTramite,
        usuarioAuditoria,
      });
    });

    console.log('Campos original :: ', campos);
    console.log('Campos construido :: ', arrCampos);
    return arrCampos;
  }

  async generarCamposResumenEmpresa(
    datosEmpresa: any,
    { campoValorFormulario, idTramite, usuarioAuditoria }: any,
    catalogoPublicacion: any,
  ) {
    console.log(
      'Generar CampoValor Empresa - Resumen',
      datosEmpresa,
      campoValorFormulario,
      catalogoPublicacion,
    );
    const arrCampos = [];
    const camposSeccionResumen =
      catalogoPublicacion.grupos[0].secciones[1].campos;

    const camposFormulario = {};

    campoValorFormulario.forEach((el) => {
      camposFormulario[el.campo] = el.valor;
    });

    const camposEmpresa = {
      [PlantillaCampoComun.DENOMINACION]: datosEmpresa.razonSocial,
      [PlantillaCampoComun.NRO_MATRICULA]: datosEmpresa.matricula,
      // TODO: Temporal solo se obtiene el codigo de tipo societario
      [PlantillaCampoComun.TIPO_SOCIETARIO]: datosEmpresa.codTipoPersona,
    };

    camposSeccionResumen.map((campo) => {
      if (campo.campo === PlantillaCampoComun.RESUMEN) {
        return (campo.valor = this.generarResumenPublicacion(
          { ...camposEmpresa, ...camposFormulario },
          campo.label, // plantilla resumen
        ));
      } else {
        return (campo.valor = camposEmpresa[campo.campo]);
      }
    });

    camposSeccionResumen.forEach((campo) => {
      arrCampos.push({
        campo: campo.campo,
        valor: campo.valor,
        tipo: campo.tipo,
        tabla: campo.tabla,
        idTramite,
        usuarioAuditoria,
      });
    });

    return arrCampos;
  }

  generarResumenPublicacion(camposFormulario: any, plantillaResumen: any) {
    console.log('Generando resument publicacion >> ');
    let regexText = '';
    const campoValorObj = {};
    const _campos = Object.entries(camposFormulario);
    _campos.forEach((item, idx) => {
      const [campo, valor] = item;
      campoValorObj[`{${campo}}`] = valor;
      regexText += `{${campo}}${idx < _campos.length ? '|' : ''}`;
    });

    const regexp = new RegExp(`${regexText}/`, 'gi');
    console.log('Expresion regular generada => ', regexp);
    const plantillaValor = plantillaResumen.replace(
      regexp,
      (matched) => campoValorObj[matched],
    );
    console.log('Plantilla valor generada :: ', plantillaValor);
    return plantillaValor;
  }
}
