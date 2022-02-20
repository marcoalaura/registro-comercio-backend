import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObservacionRepository } from '../repository/observacion.repository';
import { TramiteRepository } from '../repository/tramite.repository';
import { TramiteDetalleRepository } from '../repository/tramite-detalle.repository';
import { TramiteDocumentoSoporteRepository } from '../repository/tramite-documento-soporte.repository';
import { TramiteEstado, ObservacionEstado } from '../../../common/constants';

@Injectable()
export class ObservacionService {
  // eslint-disable-next-line
  constructor(
    @InjectRepository(ObservacionRepository)
    private observacionRepository: ObservacionRepository,
    private tramiteRepository: TramiteRepository,
    private tramiteDetalleRepository: TramiteDetalleRepository,
    private tramiteDocumentoSoporteRepository: TramiteDocumentoSoporteRepository,
  ) {}

  async listarPorTramite(idTramite: string) {
    const resultado = await this.observacionRepository.listarPorTramite(
      idTramite,
    );
    return resultado;
  }

  async listarPorTramiteFormato(idTramite: number) {
    const resultado = await this.tramiteRepository.listarPorTramiteFormato(
      idTramite,
    );
    return resultado;
  }

  /**
   * Metodo para crear una observacion
   * @param id identificador del detalle campo del tramite o del documento soporte
   * @param idTramite identificador del tramite
   * @param tipo tipo de observacion al detalle campo DETALLE o al documento soporte DOCUMENTO
   * @param observacion observación del campo o documento soporte
   * @param sugerencia sugerencia del campo o documento soporte
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto observacion
   */
  // eslint-disable-next-line
  async actualizarObservacion(
    id: number,
    idTramite: number,
    tipo: string,
    observacion: string,
    sugerencia: string,
    usuarioAuditoria: string,
  ) {
    let detalle = null;
    let documento = null;
    let tramite = null;
    let valorObservado = '';
    let regObservacion = null;
    let result = null;
    if (!observacion)
      throw new PreconditionFailedException(
        'Debe ingresar una observación y la sugerencia',
      );

    if (tipo === 'DETALLE') {
      detalle = await this.tramiteDetalleRepository.buscarPorId(id);
      if (!detalle)
        throw new PreconditionFailedException(
          'No se encontro el tramite-detalle',
        );
      valorObservado = detalle.valor;
      regObservacion = await this.observacionRepository.buscarPorIdDetalle(
        detalle.id,
      );
      if (idTramite != detalle.idTramite)
        throw new PreconditionFailedException(
          `El id ${id} del tramite-detalle, no corresponde al tramite con id ${idTramite}`,
        );
    } else if (tipo === 'DOCUMENTO') {
      documento = await this.tramiteDocumentoSoporteRepository.buscarPorId(id);
      if (!documento)
        throw new PreconditionFailedException(
          'No se encontro el tramite-documento-soporte',
        );
      valorObservado = documento.nombre;
      regObservacion = await this.observacionRepository.buscarPorIdDocumento(
        documento.id,
      );
      if (idTramite != documento.idTramite)
        throw new PreconditionFailedException(
          `El id ${id} del tramite-documento, no corresponde al tramite con id ${idTramite}`,
        );
    }

    const estadoTramite = await this.tramiteRepository.buscarEstadoPorId(
      idTramite,
    );
    if (
      estadoTramite.estado !== TramiteEstado.ASIGNADO &&
      estadoTramite.estado !== TramiteEstado.REVISION &&
      estadoTramite.estado !== TramiteEstado.OBSERVADO
    )
      throw new PreconditionFailedException(
        `No se puede observar un tramite, si no esta en estado ${TramiteEstado.ASIGNADO}, ${TramiteEstado.REVISION} o ${TramiteEstado.OBSERVADO}.`,
      );
    if (tipo === 'TRAMITE') tramite = estadoTramite;
    const data = {
      id: null,
      observacion,
      sugerencia,
      detalle,
      documento,
      tramite,
      valorObservado,
      usuarioAuditoria,
      estado: ObservacionEstado.ACTIVE,
    };
    if (regObservacion) {
      data.id = regObservacion.id;
      result = await this.observacionRepository.actualizarObservacion(data);
    } else {
      result = await this.observacionRepository.crearObservacion(data);
    }

    return result && result.raw;
  }

  /**
   * Metodo para crear una observacion
   * @param id identificador de la observacion del tramite
   * @param idTramite identificador del tramite observado
   * @param observacion observación del campo o documento soporte
   * @param sugerencia sugerencia del campo o documento soporte
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto observacion
   */
  // eslint-disable-next-line
  async actualizarObservacionTramite(
    id: number,
    idTramite: number,
    observacion: string,
    sugerencia: string,
    usuarioAuditoria: string,
  ) {
    if (!observacion)
      throw new PreconditionFailedException('Debe ingresar una observación');

    const regObservacion = await this.observacionRepository.buscarPorIdTramite(
      id,
    );
    if (!(regObservacion && regObservacion.tramite))
      throw new PreconditionFailedException(
        `No se ha encontrado la observación con id ${id}.`,
      );

    if (idTramite != regObservacion.tramite.id)
      throw new PreconditionFailedException(
        `El id de la observacion ${id}, no corresponde al tramite con id ${idTramite}.`,
      );
    const tramite = await this.tramiteRepository.buscarEstadoPorId(idTramite);
    if (
      tramite.estado !== TramiteEstado.ASIGNADO &&
      tramite.estado !== TramiteEstado.REVISION &&
      tramite.estado !== TramiteEstado.OBSERVADO
    )
      throw new PreconditionFailedException(
        `No se puede observar un tramite, si no esta en estado ${TramiteEstado.ASIGNADO}, ${TramiteEstado.REVISION} o ${TramiteEstado.OBSERVADO}.`,
      );

    const data = {
      id,
      observacion,
      sugerencia,
      tramite,
      usuarioAuditoria,
    };
    const result = await this.observacionRepository.actualizarObservacion(data);

    return result;
  }

  /**
   * Metodo para crear una observacion
   * @param id identificador de la observacion al tramite
   * @param idTramite identificador del tramite
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto observacion
   */
  // eslint-disable-next-line
  async inactivarObservacion(
    id: number,
    idTramite: number,
    usuarioAuditoria: string,
  ) {
    const regObservacion = await this.observacionRepository.buscarPorId(id);

    if (!regObservacion)
      throw new PreconditionFailedException(
        `No se ha encontrado la observación con id ${id}.`,
      );

    if (regObservacion.estado === ObservacionEstado.INACTIVE)
      throw new PreconditionFailedException(
        `Ya se encuentra ${ObservacionEstado.INACTIVE} la observación con id ${id}.`,
      );

    if (
      idTramite !=
      (regObservacion.tramite
        ? regObservacion.tramite.id
        : regObservacion.detalle
        ? regObservacion.detalle.idTramite
        : regObservacion.documento
        ? regObservacion.documento.idTramite
        : null)
    )
      throw new PreconditionFailedException(
        `El id de la observación ${id}, no corresponde al id del tramite ${idTramite}.`,
      );

    const tramite = await this.tramiteRepository.buscarEstadoPorId(idTramite);
    if (
      tramite.estado !== TramiteEstado.ASIGNADO &&
      tramite.estado !== TramiteEstado.REVISION &&
      tramite.estado !== TramiteEstado.OBSERVADO
    )
      throw new PreconditionFailedException(
        `No se puede INACTIVAR una observacion de un tramite, si no esta en estado ${TramiteEstado.ASIGNADO}, ${TramiteEstado.REVISION} o ${TramiteEstado.OBSERVADO}.`,
      );

    const data = {
      id,
      estado: ObservacionEstado.INACTIVE,
      usuarioAuditoria,
    };
    const result = await this.observacionRepository.inactivarObservacion(data);

    return result && result.raw;
  }
}
