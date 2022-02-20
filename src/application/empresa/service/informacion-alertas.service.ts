import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { TramiteService } from '../../tramite/services/tramite.service';

@Injectable()
export class InformacionAlertasService {
  constructor(private tramiteService: TramiteService) {}

  async obtenerFechaActualizacionMatricula(idEmpresa: number) {
    const resultado =
      await this.tramiteService.obtenerUltimaActualizacionMatricula(idEmpresa);
    return { fechaActualizacion: resultado };
  }

  async obtenerTramitesPorEstado(idEmpresa: number, estado: string) {
    const resultado =
      await this.tramiteService.obtenerCantidadTramitesPorEstado(
        idEmpresa,
        estado,
      );
    const data = {};
    data[estado] = resultado?.cantidad;
    return data;
  }

  async obtenerPublicaciones(idEmpresa: number) {
    console.log(idEmpresa);
    const resultado = await Promise.resolve([
      { publicacion: 'Aumento de capital' },
      { publicacion: 'Cambio de representante legal' },
      { publicacion: 'Convocatoria a Junta de Socios' },
    ]);
    return resultado;
  }

  async obtenerNormativaActualizada(idEmpresa: number) {
    console.log(idEmpresa);
    const resultado = await Promise.resolve([
      { normativa: 'Reglamento de inscripcion de socios' },
      { normativa: 'Reglamento de actualizacion de cambios operativos' },
    ]);
    return resultado;
  }
}
