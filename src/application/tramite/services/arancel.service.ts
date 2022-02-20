import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArancelRepository } from '../repository/arancel.repository';
import { TramiteDetalleRepository } from '../repository/tramite-detalle.repository';
import { TramiteRepository } from '../repository/tramite.repository';

@Injectable()
export class ArancelService {
  constructor(
    @InjectRepository(ArancelRepository)
    private arancelRepository: ArancelRepository,
    @InjectRepository(TramiteDetalleRepository)
    private tramiteDetalleRepository: TramiteDetalleRepository,
    @InjectRepository(TramiteRepository)
    private tramiteRepository: TramiteRepository,
  ) {}

  async listarPorTramite(idTramite: number) {
    const result = await this.arancelRepository.solicitudPagoPorTramite(
      idTramite,
    );
    const pagos = [];
    let cantidad = 0;
    let montoTotal = 0;
    if (result[0].length > 0) {
      for (const fila of result[0]) {
        let paga = true;
        if (fila.funcionDependiente) {
          const idTramite = fila.catalogoTramite.tramites[0].id;
          paga = await this.funcionDependiente(
            fila.funcionDependiente,
            idTramite,
          );
        }
        if (paga) {
          cantidad++;
          montoTotal += +fila.monto;
          pagos.push(fila);
        }
      }
    }
    return [{ montoTotal, pagos }, cantidad];
  }

  async funcionDependiente(
    funcion: string,
    idTramite: number,
  ): Promise<boolean> {
    switch (funcion) {
      case 'dependedeDireccion':
        return await this.dependeDireccion(idTramite);
        break;
      default:
        return false;
        break;
    }
  }

  async dependeDireccion(idTramite: number) {
    // obtener tramite detalles del tramite con tabla direccion
    const tramiteDetalles = await this.tramiteDetalleRepository.find({
      where: [
        {
          idTramite,
          tabla: 'direcciones',
        },
      ],
    });
    if (tramiteDetalles.length <= 0) return false;

    const resp = await this.tramiteRepository.direccionPorTramite(idTramite);
    if (resp.length <= 0) return false;

    const direccion = resp[0].establecimiento.direcciones[0];

    for (const element of tramiteDetalles) {
      const key = this.camelize(element.campo);
      if (
        (element.valor !== '' || element.valor !== null) &&
        (direccion[key] !== '' || direccion[key] !== null)
      )
        if (direccion[key] !== element.valor) return true;
    }
    return false;
  }

  camelize = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  };
}
