import {
  Injectable,
  /*PreconditionFailedException,*/
  Query,
} from '@nestjs/common';
// import { EmpresaRepository } from '../repository/empresa.repository';
import { EstablecimientoRepository } from '../repository/establecimiento.repository';
import { Establecimiento } from '../entities/establecimiento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../../common/constants';
// import { TextService } from '../../../common/lib/text.service';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
// import { EntityForbiddenException } from '../../../common/exceptions/entity-forbidden.exception';
import { Messages } from '../../../common/constants/response-messages';
// import { AuthorizationService } from '../../../core/authorization/controller/authorization.service';
// import { ConfigService } from '@nestjs/config';
import {
  CrearEstablecimientoDto,
  ActualizarEstablecimientoDto,
} from '../dto/establecimiento.dto';
import { FiltrosEstablecimientoDto } from '../dto/filtros-establecimiento.dto';

@Injectable()
export class EstablecimientoService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(EstablecimientoRepository)
    private establecimientoRepositorio: EstablecimientoRepository,
  ) {}

  // GET establecimientos
  // async listar(@Query() paginacionQueryDto: FiltrosEstablecimientoDto) {
  //   const resultado = await this.establecimientoRepositorio.listar(
  //     paginacionQueryDto,
  //   );
  //   return resultado;
  // }

  // GET establecimientos por empresa
  async buscarPorIdEmpresa(
    idEmpresa: string,
    @Query() paginacionQueryDto: FiltrosEstablecimientoDto,
  ) {
    const resultado = await this.establecimientoRepositorio.listarPorEmpresa(
      idEmpresa,
      paginacionQueryDto,
    );
    return resultado;
  }

  async buscarPorId(establecimiento: string): Promise<Establecimiento> {
    return this.establecimientoRepositorio.buscarPorId(establecimiento);
  }

  async crear(
    idEmpresa: string,
    establecimientoDto: CrearEstablecimientoDto,
    usuarioAuditoria: string,
  ) {
    // const { empresa } = establecimientoDto;
    establecimientoDto.estado = Status.PENDING;
    const result = await this.establecimientoRepositorio.crear(
      idEmpresa,
      establecimientoDto,
      usuarioAuditoria,
    );
    const { id, estado } = result;
    return { id, estado };
    // throw new PreconditionFailedException();
  }

  async activar(idEstablecimiento, usuarioAuditoria: string) {
    // this.verificarPermisos(idEstablecimiento, usuarioAuditoria);
    const establecimiento = await this.establecimientoRepositorio.findOne(
      idEstablecimiento,
    );
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING];
    if (
      establecimiento &&
      statusValid.includes(establecimiento.estado as Status)
    ) {
      const establecimientoDto = new ActualizarEstablecimientoDto();
      establecimientoDto.estado = Status.PENDING;
      establecimientoDto.usuarioActualizacion = usuarioAuditoria;
      await this.establecimientoRepositorio.update(
        idEstablecimiento,
        establecimientoDto,
      );
      return { id: idEstablecimiento, estado: establecimientoDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  async inactivar(idEstablecimiento: string, usuarioAuditoria: string) {
    // this.verificarPermisos(idEstablecimiento, usuarioAuditoria);
    const establecimiento = await this.establecimientoRepositorio.findOne(
      idEstablecimiento,
    );
    if (establecimiento) {
      const establecimientoDto = new ActualizarEstablecimientoDto();
      establecimientoDto.usuarioActualizacion = usuarioAuditoria;
      establecimientoDto.estado = Status.INACTIVE;
      await this.establecimientoRepositorio.update(
        idEstablecimiento,
        establecimientoDto,
      );
      return {
        id: idEstablecimiento,
        estado: establecimientoDto.estado,
      };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }

  // private verificarPermisos(id, usuarioAuditoria) {
  //   // TODO agregar logica de permiso para editar establecimiento
  //   if (usuarioAuditoria === id) {
  //     throw new EntityForbiddenException();
  //   }
  // }

  async actualizarDatos(
    id: string,
    establecimientoDto: ActualizarEstablecimientoDto,
    usuarioAuditoria: string,
  ) {
    // this.verificarPermisos(id, usuarioAuditoria);
    const establecimiento = await this.establecimientoRepositorio.findOne(id);
    if (establecimiento) {
      const actualizarEstablecimientoDto = new ActualizarEstablecimientoDto();
      actualizarEstablecimientoDto.usuarioActualizacion = usuarioAuditoria;
      await this.establecimientoRepositorio.update(
        id,
        actualizarEstablecimientoDto,
      );
      return { id };
    }
    throw new EntityNotFoundException(Messages.INVALID_RECORD);
  }
}
