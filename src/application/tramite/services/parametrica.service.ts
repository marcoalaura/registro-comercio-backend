import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpresaRepository } from 'src/application/empresa/repository/empresa.repository';
import { FiltrosPublicacionDto } from 'src/application/publicacion/dto/filtros-publicacion.dto';
import { TramiteParametricaTipoCatalogo } from 'src/common/constants';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { ParametricaRepository } from '../repository/parametrica.repository';

@Injectable()
export class ParametricaService {
  constructor(
    @InjectRepository(ParametricaRepository)
    private parametricaRepository: ParametricaRepository,
    @InjectRepository(EmpresaRepository)
    private empresaRepository: EmpresaRepository,
  ) {}

  async listarParametricaTramites(tipo: string, buscar: string) {
    const resultado =
      await this.parametricaRepository.listarParametricaTramites(tipo, buscar);
    let data = [];
    if (resultado?.length > 0) {
      data = this.construirRespuestaTramites(resultado);
    }
    return data;
  }

  construirRespuestaTramites(resultado: any) {
    const data = [];
    data.push({
      idParametricaCategoria: resultado[0]['idParametricaCategoria'],
      nombreParametricaCategoria: resultado[0]['nombreParametricaCategoria'],
      ordenParametricaCategoria: resultado[0]['ordenParametricaCategoria'],
      tramites: [],
    });
    for (const item of resultado) {
      const indice = data.findIndex(
        (e) => e.idParametricaCategoria === item.idParametricaCategoria,
      );
      if (indice === -1) {
        data.push({
          idParametricaCategoria: item.idParametricaCategoria,
          nombreParametricaCategoria: item.nombreParametricaCategoria,
          ordenParametricaCategoria: item.ordenParametricaCategoria,
          tramites: [
            {
              idParametrica: item.idParametrica,
              nombreParametrica: item.nombreParametrica,
              codigoParametrica: item.codigoParametrica,
              rutaParametrica: item.rutaParametrica,
              rutaFront: item.rutaFront,
              preRutaFront: item.preRutaFront,
            },
          ],
        });
      } else {
        data[indice].tramites.push({
          idParametrica: item.idParametrica,
          nombreParametrica: item.nombreParametrica,
          codigoParametrica: item.codigoParametrica,
          rutaParametrica: item.rutaParametrica,
          rutaFront: item.rutaFront,
          preRutaFront: item.preRutaFront,
        });
      }
    }
    return data;
  }

  async listarCatalagoPublicaciones(idEmpresa: string) {
    const tipoCatalogo = TramiteParametricaTipoCatalogo.PUBLICACION;
    const empresa =
      await this.empresaRepository.buscarTipoSocietarioPorIdEmpresa(idEmpresa);
    if (!empresa)
      throw new PreconditionFailedException('No se ha encontrado la empresa.');

    const tipoSocietario = empresa.codTipoPersona
      ? empresa.codTipoPersona
      : null;
    const resultado =
      await this.parametricaRepository.listarParametricaPublicaciones(
        tipoCatalogo,
        tipoSocietario,
      );
    let data = [];
    if (resultado?.length > 0) {
      data = this.construirRespuestaTramites(resultado);
    }
    return data;
  }

  async listarCatalogoArancel(paginacionQueryDto: FiltrosPublicacionDto) {
    const tipoCatalogo = TramiteParametricaTipoCatalogo.PUBLICACION;
    const resultado = await this.parametricaRepository.listarCatalogoArancel(
      paginacionQueryDto,
      tipoCatalogo,
    );
    return resultado;
  }

  async obtenerCategorias(paginacionQueryDto: PaginacionQueryDto) {
    const resultado = await this.parametricaRepository.obtenerCategorias(
      paginacionQueryDto,
    );
    return resultado;
  }
}
