import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActividadEconomicaRepository } from '../repository/actividad-economica.repository';
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception';
import { Status } from 'src/common/constants';
import { Messages } from 'src/common/constants/response-messages';
import {
  CrearActividadEconomicaDto,
  ActualizarActividadEconomicaDto,
} from '../dto/actividad-economica.dto';

@Injectable()
export class ActividadEconomicaService {
  constructor(
    @InjectRepository(ActividadEconomicaRepository)
    private actividadEconomicaRepository: ActividadEconomicaRepository,
  ) {}

  async buscarPorIdEstablecimiento(id: string) {
    const resultado =
      await this.actividadEconomicaRepository.listarPorIdEstablecimiento(id);
    return resultado;
  }

  async crear(
    idEstablecimiento: string,
    actividadEconomicaDto: CrearActividadEconomicaDto,
    usuarioAuditoria: string,
  ) {
    // const { establecimiento } = actividadEconomicaDto;
    actividadEconomicaDto.estado = Status.PENDING;
    const result = await this.actividadEconomicaRepository.crear(
      idEstablecimiento,
      actividadEconomicaDto,
      usuarioAuditoria,
    );
    const { id, estado } = result;
    return { id, estado };
  }

  async activar(idActividadEconomica, usuarioAuditoria: string) {
    // this.verificarPermisos(idActividadEconomica, usuarioAuditoria);
    const actividadEconomica = await this.actividadEconomicaRepository.findOne(
      idActividadEconomica,
    );
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING];
    if (
      actividadEconomica &&
      statusValid.includes(actividadEconomica.estado as Status)
    ) {
      const actividadEconomicaDto = new ActualizarActividadEconomicaDto();
      actividadEconomicaDto.estado = Status.PENDING;
      actividadEconomicaDto.usuarioActualizacion = usuarioAuditoria;
      await this.actividadEconomicaRepository.update(
        idActividadEconomica,
        actividadEconomicaDto,
      );
      return { id: idActividadEconomica, estado: actividadEconomicaDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  async inactivar(idActividadEconomica: string, usuarioAuditoria: string) {
    // this.verificarPermisos(idActividadEconomica, usuarioAuditoria);
    const actividadEconomica = await this.actividadEconomicaRepository.findOne(
      idActividadEconomica,
    );
    if (actividadEconomica) {
      const actividadEconomicaDto = new ActualizarActividadEconomicaDto();
      actividadEconomicaDto.usuarioActualizacion = usuarioAuditoria;
      actividadEconomicaDto.estado = Status.INACTIVE;
      await this.actividadEconomicaRepository.update(
        idActividadEconomica,
        actividadEconomicaDto,
      );
      return {
        id: idActividadEconomica,
        estado: actividadEconomicaDto.estado,
      };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  async actualizarDatos(
    id: string,
    actividadEconomicaDto: ActualizarActividadEconomicaDto,
    usuarioAuditoria: string,
  ) {
    // this.verificarPermisos(id, usuarioAuditoria);
    const actividadEconomica = await this.actividadEconomicaRepository.findOne(
      id,
    );
    if (actividadEconomica) {
      const actualizarActividadEconomicaDto =
        new ActualizarActividadEconomicaDto();
      actualizarActividadEconomicaDto.usuarioActualizacion = usuarioAuditoria;
      await this.actividadEconomicaRepository.update(
        id,
        actualizarActividadEconomicaDto,
      );
      return { id };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }
}
