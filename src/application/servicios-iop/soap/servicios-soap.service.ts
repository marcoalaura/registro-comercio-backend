import { Injectable } from '@nestjs/common';
import { EmpresaService } from '../service/soap/empresa.service';
import { ActividadService } from '../service/soap/actividad.service';
import { RepresentanteLegalService } from '../service/soap/representante-legal.service';
import { SucursalService } from '../service/soap/sucursal.service';
import { ResponseWrapper } from './lib/response-wrapper';

@Injectable()
export class ServiciosIopService {
  /* eslint-disable max-params */
  constructor(
    private empresaService: EmpresaService,
    private actividadService: ActividadService,
    private representanteLegalService: RepresentanteLegalService,
    private sucursalService: SucursalService,
    private responseWrapper: ResponseWrapper,
  ) {}

  /* eslint-disable max-lines-per-function */
  serviciosIop() {
    const servicios = {
      SrvActividades: async (args) => {
        const elementoRaiz = 'SrvActividadesResult';
        const elementoAdicional = 'MatriculaActividad';
        if (!this.responseWrapper.nullValuesFinder(args)) {
          return this.responseWrapper.badRequest(elementoRaiz);
        }
        const result = await this.actividadService.buscarPorMatricula(
          args.IdMatricula,
        );
        if (!result) {
          return this.responseWrapper.nestedNotFoundElements(
            elementoRaiz,
            elementoAdicional,
            args.IdMatricula,
          );
        }
        return this.responseWrapper.nestedExistElements(
          elementoRaiz,
          elementoAdicional,
          result,
        );
      },

      SrvInfoMatricula: async (args) => {
        const elementoRaiz = 'SrvInfoMatriculaResult';
        const elementoAdicional = 'infoMatricula';
        if (!this.responseWrapper.nullValuesFinder(args)) {
          return this.responseWrapper.badRequest(elementoRaiz);
        }
        const result = await this.empresaService.buscarPorMatricula(
          args.IdMatricula,
        );
        if (!result) {
          return this.responseWrapper.nestedNotFoundElements(
            elementoRaiz,
            elementoAdicional,
            args.IdMatricula,
          );
        }
        return this.responseWrapper.nestedExistElements(
          elementoRaiz,
          elementoAdicional,
          { result },
        );
      },

      SrvMatricula: async (args) => {
        const elementoRaiz = 'SrvMatriculaResult';
        const elementoAdicional = 'MatriculaDatos';
        if (!this.responseWrapper.nullValuesFinder(args)) {
          return this.responseWrapper.badRequest(elementoRaiz);
        }
        const result = await this.empresaService.verEstadoMatriculaComercio(
          args.IdMatricula,
        );
        if (!result) {
          return this.responseWrapper.nestedNotFoundElements(
            elementoRaiz,
            elementoAdicional,
            args.IdMatricula,
          );
        }
        return this.responseWrapper.nestedExistElements(
          elementoRaiz,
          elementoAdicional,
          { result },
        );
      },

      SrvMatriculaConsultaNit: async (args) => {
        const elementoRaiz = 'SrvMatriculaConsultaNitResult';
        const elementoAdicional = 'MatriculasResult';
        if (!this.responseWrapper.nullValuesFinder(args)) {
          return this.responseWrapper.badRequest(elementoRaiz);
        }
        const result = await this.empresaService.buscarPorNIT(args.IdNit);
        if (!result) {
          return this.responseWrapper.nestedNotFoundElements(
            elementoRaiz,
            elementoAdicional,
            args.IdNit,
          );
        }
        return this.responseWrapper.nestedExistElements(
          elementoRaiz,
          elementoAdicional,
          { result },
        );
      },

      SrvMatriculaConsultaRazon: async (args) => {
        const elementoRaiz = 'SrvMatriculaConsultaRazonResult';
        const elementoAdicional = 'busquedaRazonSocial';
        if (!this.responseWrapper.nullValuesFinder(args)) {
          return this.responseWrapper.badRequest(elementoRaiz);
        }
        const result = await this.empresaService.buscarPorRazonSocial(
          args.txtConsulta,
        );
        if (!result) {
          return this.responseWrapper.nestedNotFoundElements(
            elementoRaiz,
            elementoAdicional,
            args.txtConsulta,
          );
        }
        return this.responseWrapper.nestedExistElements(
          elementoRaiz,
          elementoAdicional,
          { result },
        );
      },

      SrvRepresentante: async (args) => {
        const elementoRaiz = 'SrvRepresentanteResult';
        const elementoAdicional = 'Representantes';
        if (!this.responseWrapper.nullValuesFinder(args)) {
          return this.responseWrapper.badRequest(elementoRaiz);
        }
        const result = await this.representanteLegalService.buscarPorMatricula(
          args.IdMatricula,
        );
        if (!result) {
          return this.responseWrapper.nestedNotFoundElements(
            elementoRaiz,
            elementoAdicional,
            args.IdMatricula,
          );
        }
        const representantes = this.responseWrapper.nestedExistElements(
          elementoRaiz,
          elementoAdicional,
          result,
        );
        return { ...representantes };
      },

      SrvMatriculaListSuc: async (args) => {
        const elementoRaiz = 'SrvMatriculaListSucResult';
        const elementoAdicional = 'MatriculaResultSuc';
        if (!this.responseWrapper.nullValuesFinder(args)) {
          return this.responseWrapper.badRequest(elementoRaiz);
        }
        const result = await this.sucursalService.buscarPorMatricula(
          args.IdMatricula,
        );
        if (!result) {
          return this.responseWrapper.nestedNotFoundElements(
            elementoRaiz,
            elementoAdicional,
            args.IdMatricula,
          );
        }
        return this.responseWrapper.nestedExistElements(
          elementoRaiz,
          elementoAdicional,
          { result },
        );
      },

      SrvMatriculaVigencia: async (args) => {
        const elementoRaiz = 'SrvMatriculaVigenciaResult';
        const elementoAdicional = 'MatriculaDatosVigencia';
        if (!this.responseWrapper.nullValuesFinder(args)) {
          return this.responseWrapper.badRequest(elementoRaiz);
        }
        const result = await this.empresaService.verEstadoMatriculaComercio(
          args.IdMatricula,
        );
        if (!result) {
          return this.responseWrapper.nestedNotFoundElements(
            elementoRaiz,
            elementoAdicional,
            args.IdMatricula,
          );
        }
        return this.responseWrapper.nestedExistElements(
          elementoRaiz,
          elementoAdicional,
          { result },
        );
      },
    };

    return {
      WebServiceRCB: {
        WebServiceRCBSoap: servicios,
        WebServiceRCBSoap12: servicios,
      },
    };
  }
}
