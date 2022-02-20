import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { Parametrica } from 'src/application/tramite/entities/parametricas/parametrica.entity';
import { ParametricaRepository } from 'src/application/tramite/repository/parametrica.repository';
import { TramiteRepository } from 'src/application/tramite/repository/tramite.repository';
import { Tramite } from 'src/application/tramite/entities/tramite/tramite.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class PublicacionGenericoService {
  constructor(
    @InjectRepository(ParametricaRepository)
    private parametricaRepository: ParametricaRepository,
    @InjectRepository(TramiteRepository)
    private tramiteRepository: TramiteRepository,
  ) {}

  async consultarPublicacionCatalogoTramite(idPublicacion: number) {
    const publicacion =
      await this.tramiteRepository.obtenerDatosCatalogoPublicacion(
        idPublicacion,
      );

    if (!publicacion) {
      throw new PreconditionFailedException(
        'No se encontró la publicación y sus detalles',
      );
    }

    const catalogoPublicacion = await this.obtenerCatalogoPublicacion(
      publicacion.idParametrica,
    );

    return this.construirRespuestaEditarPublicacion(
      publicacion,
      catalogoPublicacion,
    );
  }

  /**
   * Metodo para obtener un catalogo de publicacion por id
   * @param idCatalogoTramite identificador del catalogo tramite (catalogo publicacion)
   * @returns Objeto (tramite->grupo->seccion->campo)
   */
  async obtenerCatalogoPublicacion(idCatalogoTramitePublicacion: number) {
    const catalogoTramitePublicacion =
      await this.parametricaRepository.obtenerCataloTramitePorId(
        idCatalogoTramitePublicacion,
      );
    if (!catalogoTramitePublicacion)
      throw new PreconditionFailedException(
        'No se encontró el catalogo de publicacion seleccionado',
      );

    return this.construirRespuestaCrearPublicacion(catalogoTramitePublicacion);
  }

  /**
   * Metodo para construir la respuesta de crear tramite (grupo->seccion->campo)
   * @param tramite Objeto con los valores de un tramite
   * @param catalogoTramite Objeto catalogo tramite (grupo->seccion->campo)
   * @returns Objeto (tramite->grupo->seccion->campo)
   */
  construirRespuestaCrearPublicacion(catalogoTramitePublicacion: Parametrica) {
    const result: any = {};
    // result.id = publicacion.id;
    result.titulo = catalogoTramitePublicacion.nombre;
    result.api = catalogoTramitePublicacion.api;
    result.grupos = catalogoTramitePublicacion.grupos;
    result.grupos.map((grupo: any) => {
      grupo.secciones.map((seccion: any) => {
        seccion.campos.map((campo: any) => {
          campo.valor = null;
        });
      });
    });
    return result;
  }

  construirRespuestaEditarPublicacion(
    publicacion: Tramite,
    catalogoPublicacion: Parametrica,
  ) {
    console.log('datos de mi publicacion ::: ', publicacion);
    const camposFormulario = {};
    const result: any = {};
    result.id = publicacion.id;
    result.titulo = publicacion.nombre;
    result.fechaPublicacion = dayjs(publicacion.fechaPublicacion).format(
      'YYYY-MM-DD',
    );
    result.idEmpresa = publicacion.idEmpresa;
    result.rutaPdf = publicacion.rutaPdf;
    result.codigo = publicacion.codigo;
    result.estado = publicacion.estado;
    result.grupos = catalogoPublicacion.grupos;

    publicacion.detalles.forEach((item) => {
      camposFormulario[item.campo] = item.valor;
    });

    result.grupos.forEach((grupo: any) => {
      grupo.secciones.forEach((seccion: any) => {
        seccion.campos.forEach((campo: any) => {
          campo.valor = camposFormulario[campo.campo];
        });
      });
    });

    console.log('Resultado de catalogo y publicacion generado :::: ', result);
    return result;
  }
}
