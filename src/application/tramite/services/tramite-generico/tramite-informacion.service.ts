import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablecimientoRepository } from 'src/application/empresa/repository/establecimiento.repository';
import { TipoContacto } from 'src/common/constants';
import { ParametricaRepository } from '../../repository/parametrica.repository';
import { TramiteRepository } from '../../repository/tramite.repository';

@Injectable()
export class TramiteInformacionService {
  constructor(
    @InjectRepository(TramiteRepository)
    private tramiteRepository: TramiteRepository,
    @InjectRepository(ParametricaRepository)
    private parametricaRepository: ParametricaRepository,
    @InjectRepository(EstablecimientoRepository)
    private establecimientoRepository: EstablecimientoRepository,
  ) {}

  async obtenerInformacionDireccionContacto(tramite: any) {
    const establecimientoDirecciones =
      await this.establecimientoRepository.obtenerDireccion(
        tramite.idEstablecimiento,
      );

    const establecimientosContatos =
      await this.establecimientoRepository.obtenerContactos(
        tramite.idEstablecimiento,
      );

    const correo = establecimientosContatos?.contactos?.find(
      (e) => e.tipoContacto === TipoContacto.CORREO,
    );

    const telefono = establecimientosContatos?.contactos?.find(
      (e) => e.tipoContacto === TipoContacto.TELEFONO,
    );

    const result: any = { ...establecimientoDirecciones?.direcciones[0] };
    result.telefono1 = telefono?.descripcion?.telefono1 || null;
    result.telefono2 = telefono?.descripcion?.telefono2 || null;
    result.telefono3 = telefono?.descripcion?.telefono3 || null;
    result.email = correo?.descripcion?.email || null;
    return result;
  }
}
