import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generarPDF, descargarPDF } from '../../common/lib/pdf.module';
import { ReporteRepository } from './reporte.repository';
import * as fs from 'fs';
import { RUTA_LOGO } from '../../common/constants';
import { CarboneService } from '../../../libs/carbone/src';
import * as dayjs from 'dayjs';
import { ExternalServiceException } from 'src/common/exceptions/external-service.exception';

const RUTA_TEMPLATE = './src/templates/carbone';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(ReporteRepository)
    readonly reporteRepository: ReporteRepository,
    private carboneService: CarboneService,
  ) {}

  // eslint-disable-next-line max-params
  async generar(plantilla: string, parametros: any, ruta: string, config: any) {
    await generarPDF(plantilla, parametros, ruta, config);
    return ruta;
  }

  async descargarBase64(ruta: string) {
    return descargarPDF(ruta);
  }

  async obtenerDatosEmpresa(idEmpresa: number) {
    const respuesta = await this.reporteRepository.obtenerDatosEmpresa(
      idEmpresa,
    );
    const data = await this.formatData(respuesta, null);
    const format = 'pdf';
    const nombreArchivo = 'matricula';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerDatosReporte(tramite: any, tipo: string, documentoDetalle: any) {
    const respuesta = await this.reporteRepository.obtenerDatosEmpresa(
      tramite?.empresa?.id,
    );
    console.log('::::::::::::::::::::: tipo:', tipo);
    if (respuesta) {
      respuesta.titulo = documentoDetalle?.nombre.toUpperCase();
      respuesta.fecha = dayjs().format('DD/MM/YYYY');
      // if (tipo === '01')  // Particularmente que debe hacer en registro de empresa unipersonal
    }
    return respuesta;
  }

  async readLogo(base64: string) {
    const logo = base64.split('base64,');
    if (logo.length > 1) {
      return logo[1];
    }
    return null;
  }

  async readLogoMinisterio(ruta: string) {
    return fs.readFileSync(ruta, 'base64');
  }

  async formatData(resultado: any, filtros: any) {
    return {
      cuerpo: resultado,
      filtros: filtros,
      // image: await this.readLogo(filtros.logo),
      imageMinisterio: await this.readLogoMinisterio(RUTA_LOGO),
      // leyenda: filtros.leyenda,
    };
  }

  async generarMatricula(tramite: any, tipo: string, documentoDetalle: any) {
    try {
      const nombreArchivo = `${tramite?.id}_${documentoDetalle.plantilla}.pdf`;
      const rutaGuardadoPdf = `${process.env.PDF_PATH}${nombreArchivo}`;
      const plantillaHtml = `src/templates/tramites/${tipo}/${documentoDetalle.plantilla}.html`;
      const configPagina = {
        pageSize: 'Letter',
        orientation: 'portrait',
        marginLeft: '0.5cm',
        marginRight: '0.5cm',
        marginTop: '0.5cm',
        marginBottom: '0.5cm',
        output: rutaGuardadoPdf,
      };

      const parametros = await this.obtenerDatosReporte(
        tramite,
        tipo,
        documentoDetalle,
      );

      await this.generar(
        plantillaHtml,
        parametros,
        rutaGuardadoPdf,
        configPagina,
      );

      return { rutaGuardadoPdf, nombreArchivo };
    } catch (error) {
      throw new ExternalServiceException(
        'No se pudo generar el archivo',
        error,
      );
    }
  }

  /*
   * Funcion que retorna un array de la siguiente forma
   * [
        {
        "fila":"FÍSICA",
        "contenido":[
           {
           "nombre":"PRIMERO DE SECUNDARIA",
           "valor":0
           },
          ]
        }
     ] */
  formatDynamicPivot(arrayPivot: [], nombreCampo: string) {
    return arrayPivot.map((item: any) => {
      const row: any = {};
      const arrayData: any = [];
      for (const key in item) {
        if (key === nombreCampo) {
          row.fila = item[key];
        } else {
          arrayData.push({
            nombre: key,
            valor: item[key],
          });
        }
      }
      row.contenido = arrayData;
      return row;
    });
  }
}
