import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DenominacionRepository } from '../repository/denominacion.repository';
import { Status } from '../../../common/constants';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';
import {
  CrearDenominacionDto,
  ActualizarDenominacionDto,
} from '../dto/denominacion.dto';

@Injectable()
export class DenominacionService {
  constructor(
    @InjectRepository(DenominacionRepository)
    private denominacionRepository: DenominacionRepository,
  ) {}

  async buscarPorIdEstablecimiento(id: string) {
    const resultado =
      await this.denominacionRepository.listarPorIdEstablecimiento(id);
    return resultado;
  }

  async crear(
    idEstablecimiento: string,
    denominacionDto: CrearDenominacionDto,
    usuarioAuditoria: string,
  ) {
    const denominacion =
      await this.denominacionRepository.buscarPorDenominacion(
        denominacionDto.denominacion,
      );
    if (!denominacion) {
      // const { establecimiento } = denominacionDto;
      denominacionDto.estado = Status.PENDING;
      const result = await this.denominacionRepository.crear(
        idEstablecimiento,
        denominacionDto,
        usuarioAuditoria,
      );
      const { id, estado } = result;
      return { id, estado };
    }
    throw new PreconditionFailedException();
  }

  async activar(idDenominacion, usuarioAuditoria: string) {
    // this.verificarPermisos(idDenominacion, usuarioAuditoria);
    const denominacion = await this.denominacionRepository.findOne(
      idDenominacion,
    );
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING];
    if (denominacion && statusValid.includes(denominacion.estado as Status)) {
      const denominacionDto = new ActualizarDenominacionDto();
      denominacionDto.estado = Status.PENDING;
      denominacionDto.usuarioActualizacion = usuarioAuditoria;
      await this.denominacionRepository.update(idDenominacion, denominacionDto);
      return { id: idDenominacion, estado: denominacionDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  async inactivar(idDenominacion: string, usuarioAuditoria: string) {
    // this.verificarPermisos(idDenominacion, usuarioAuditoria);
    const denominacion = await this.denominacionRepository.findOne(
      idDenominacion,
    );
    if (denominacion) {
      const denominacionDto = new ActualizarDenominacionDto();
      denominacionDto.usuarioActualizacion = usuarioAuditoria;
      denominacionDto.estado = Status.INACTIVE;
      await this.denominacionRepository.update(idDenominacion, denominacionDto);
      return {
        id: idDenominacion,
        estado: denominacionDto.estado,
      };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  async actualizarDatos(
    id: string,
    denominacionDto: ActualizarDenominacionDto,
    usuarioAuditoria: string,
  ) {
    // this.verificarPermisos(id, usuarioAuditoria);
    const denominacionExistente = await this.denominacionRepository.findOne(id);
    if (denominacionExistente) {
      const { denominacion } = denominacionDto;
      if (denominacion && denominacion !== denominacionExistente.denominacion) {
        const existe = await this.denominacionRepository.buscarPorDenominacion(
          denominacion,
        );
        if (existe) {
          throw new PreconditionFailedException(
            'La denominación indicada ya está en uso!',
          );
        }
        const actualizarDenominacionDto = new ActualizarDenominacionDto();
        actualizarDenominacionDto.denominacion = denominacion;
        actualizarDenominacionDto.usuarioActualizacion = usuarioAuditoria;
        await this.denominacionRepository.update(id, actualizarDenominacionDto);
      }
      return { id };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }
}
