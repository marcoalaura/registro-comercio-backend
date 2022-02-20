/* eslint-disable max-lines-per-function */
import { Injectable, PreconditionFailedException, Query } from '@nestjs/common';
import { EmpresaRepository } from '../repository/empresa.repository';
import { Empresa } from '../entities/empresa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../../common/constants';
// import { TextService } from '../../../common/lib/text.service';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { ExternalServiceException } from '../../../common/exceptions/external-service.exception';
// import { EntityForbiddenException } from '../../../common/exceptions/entity-forbidden.exception';
// import { Messages } from '../../../common/constants/response-messages';
// import { AuthorizationService } from '../../../core/authorization/controller/authorization.service';
// import { PersonaDto } from '../dto/persona.dto';
// import { UsuarioRolRepository } from '../../authorization/repository/usuario-rol.repository';
// import { ConfigService } from '@nestjs/config';
import { SinService } from '../../../core/external-services/iop/sin/sin.service';
import { CrearEmpresaDto, ActualizarEmpresaDto } from '../dto/empresa.dto';
import { FiltrosEmpresaDto } from '../dto/filtros-empresa.dto';
import { HabilitacionExcepcionService } from './habilitacion-excepcion.service';
import { HttpService } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

const http = new HttpService();

@Injectable()
export class EmpresaService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(EmpresaRepository)
    private empresaRepositorio: EmpresaRepository,
    private readonly habilitacionExcepcionServicio: HabilitacionExcepcionService,
    private readonly impuestosServices: SinService,
  ) {}

  // private readonly impuestosServices: SinService
  // private readonly authorizationService: AuthorizationService,
  // private configService: ConfigService,

  // GET empresas
  async listar(@Query() paginacionQueryDto: FiltrosEmpresaDto) {
    const resultado = await this.empresaRepositorio.listar(paginacionQueryDto);
    return resultado;
  }

  async listarPorUsuario(
    @Query() paginacionQueryDto: FiltrosEmpresaDto,
    usuarioAuditoria: string,
  ) {
    const resultado = await this.empresaRepositorio.listarPorUsuario(
      paginacionQueryDto,
      usuarioAuditoria,
    );
    return resultado;
  }

  async listarHabilitacionPorUsuario(
    @Query() paginacionQueryDto: FiltrosEmpresaDto,
    usuarioAuditoria: string,
  ) {
    const resultado =
      await this.empresaRepositorio.listarHabilitacionPorUsuario(
        paginacionQueryDto,
        usuarioAuditoria,
      );
    // Reducir niveles de consulta, se remueve establecimiento
    const resultadoAplanado = [];
    resultadoAplanado[0] = resultado[0].map((item) => {
      const newItem = {
        ...item,
        direccion: item.establecimientos[0]?.direcciones[0],
      };

      delete newItem.establecimientos;
      return newItem;
    });
    resultadoAplanado[1] = resultado[1];

    return resultadoAplanado;
  }

  async buscarPorId(idEmpresa: string): Promise<Empresa> {
    const resultado = await this.empresaRepositorio.buscarPorId(idEmpresa);
    if (resultado) {
      // Reducir niveles de consulta, se remueve establecimiento
      const resultadoAplanado = {
        ...resultado,
        direccion: resultado.establecimientos[0]?.direcciones[0],
      };

      delete resultadoAplanado.establecimientos;
      return resultadoAplanado;
    }
    return resultado;
  }

  async buscarPorMatricula(datos): Promise<Empresa> {
    const empresa = await this.empresaRepositorio.buscarPorMatricula(
      datos.matricula,
    );
    if (!empresa) {
      throw new PreconditionFailedException(
        'No se encontró una empresa con la matricula seleccionada',
      );
    }
    return empresa;
  }

  async consultarEstadoPorMatriculaAnterior(matricula: string) {
    const empresa =
      await this.empresaRepositorio.consultarEstadoPorMatriculaAnterior(
        matricula,
      );
    if (!empresa) {
      throw new PreconditionFailedException(
        'No se encontró una empresa con la matricula seleccionada',
      );
    }
    const respuesta = {
      ...empresa,
      estadoConsulta: '',
    };
    if (empresa.estado == Status.ACTIVE) {
      respuesta.estadoConsulta = 'La empresa se encuentra habilitada';
    } else if (empresa.estado == Status.CANCEL) {
      respuesta.estadoConsulta = `La matricula ${matricula} ha sido dada de baja`;
    } else {
      if (empresa.escenario == '2') {
        respuesta.estadoConsulta =
          'La empresa se encuentra pendiente de habilitación. Puede habilitarla mediante la opción de habilitación en línea';
      } else {
        // Casos 3 o escenario = null
        respuesta.estadoConsulta =
          'La empresa se encuentra pendiente de habilitación. Debe apersonarse a las oficinas de SEPREC para habilitarla';
      }
    }

    return respuesta;
  }

  async crear(empresaDto: CrearEmpresaDto, usuarioAuditoria: string) {
    const empresa = await this.empresaRepositorio.buscarPorNIT(
      empresaDto.matricula,
    );
    if (!empresa) {
      // verificar si la razón social no esta registrada
      const razon_social = await this.empresaRepositorio.buscarPorRazonSocial(
        empresaDto.razonSocial,
      );
      if (!razon_social) {
        // validar NIT con Impuestos
        // let validarNIT;
        // if (empresaDto.codTipoPersona == 'UNIPERSONAL') {
        //   const datosVerificar = {
        //     TipoDocumentoId: '',
        //     NumeroDocumentoId: '',
        //     Complemento: '',
        //     PrimerApellido: '',
        //   };
        //   validarNIT = await this.impuestosServices.VerificarNITEmpresaUnipersonal(
        //     datosVerificar,
        //   );
        // } else {
        //   const datosVerificar = {
        //     NIT: '',
        //     RazonSocial: '',
        //     MatriculaComercio: '',
        //   };
        //   validarNIT = await this.impuestosServices.VerificarNITPersonaJuridica(
        //     datosVerificar,
        //   );
        // }
        // if (validarNIT?.finalizado) {
        empresaDto.estado = Status.PENDING;
        const result = await this.empresaRepositorio.crear(
          empresaDto,
          usuarioAuditoria,
        );
        const { id, estado } = result;
        return { id, estado };
        // }
        // throw new PreconditionFailedException('validarNIT.mensaje');
      }
      throw new PreconditionFailedException(
        'La razón social indicada ya existe!' /*Messages.EXISTING_EMAIL*/,
      );
    }
    throw new PreconditionFailedException(
      'La empresa ya existe!' /*Messages.EXISTING_USER*/,
    );
  }

  async activar(idEmpresa, usuarioAuditoria: string) {
    // this.verificarPermisos(idEmpresa, usuarioAuditoria);
    const empresa = await this.empresaRepositorio.findOne(idEmpresa);
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING];
    if (empresa && statusValid.includes(empresa.estado as Status)) {
      const empresaDto = new ActualizarEmpresaDto();
      empresaDto.estado = Status.PENDING;
      empresaDto.usuarioActualizacion = usuarioAuditoria;
      await this.empresaRepositorio.update(idEmpresa, empresaDto);
      return { id: idEmpresa, estado: empresaDto.estado };
    }
    throw new EntityNotFoundException();
  }

  async inactivar(idEmpresa: string, usuarioAuditoria: string) {
    // this.verificarPermisos(idEmpresa, usuarioAuditoria);
    const empresa = await this.empresaRepositorio.findOne(idEmpresa);
    if (empresa) {
      const empresaDto = new ActualizarEmpresaDto();
      empresaDto.usuarioActualizacion = usuarioAuditoria;
      empresaDto.estado = Status.INACTIVE;
      await this.empresaRepositorio.update(idEmpresa, empresaDto);
      return {
        id: idEmpresa,
        estado: empresaDto.estado,
      };
    }
    throw new EntityNotFoundException();
  }

  async habilitar(idEmpresa, nit: string, usuarioAuditoria: string) {
    // this.verificarPermisos(idEmpresa, usuarioAuditoria);
    const empresa = await this.empresaRepositorio.findOne(idEmpresa);
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING];
    let nitReservado = false;
    if (empresa && statusValid.includes(empresa.estado as Status)) {
      if (!nit) {
        // No cuenta con NIT, verificar si se encuentra en lista de excepciones
        const tieneExcepcion =
          await this.habilitacionExcepcionServicio.verificarExisteActivaPorIdEmpresa(
            idEmpresa,
          );
        if (!tieneExcepcion) {
          throw new PreconditionFailedException(
            'La empresa no cuenta con un NIT válido y no esta incluída en una lista de excepciones!',
          );
        }
        // La empresa cuenta con una excepción válida, Reservar NIT
        const data = {
          RazonSocial: empresa.razonSocial,
        };
        const respuestaSIN = await http
          .post(process.env.URL_SIN_RESERVA_NIT_PERSONA_JURIDICA, data)
          .toPromise();
        if (
          respuestaSIN.data &&
          parseInt(respuestaSIN.data.estado) === 0 &&
          respuestaSIN.data.datos?.NITReservado
        ) {
          nit = respuestaSIN.data.datos.NITReservado;
          console.log('nit reservado: ', nit);
          nitReservado = true;
        } else {
          throw new PreconditionFailedException(
            'No se pudo completar la reserva de NIT',
          );
        }
      }
      const empresaDto = new ActualizarEmpresaDto();
      empresaDto.estado = Status.ACTIVE;
      empresaDto.accion = 'HABILITADO';
      empresaDto.nit = nit;
      empresaDto.matricula = nit;
      empresaDto.usuarioActualizacion = usuarioAuditoria;
      await this.empresaRepositorio.update(idEmpresa, empresaDto);
      if (nitReservado) {
        return { id: idEmpresa, nitReservado: nit, estado: empresaDto.estado };
      } else {
        return { id: idEmpresa, estado: empresaDto.estado };
      }
    }
    throw new PreconditionFailedException(
      'La empresa no existe o su matricula ha sido cancelada',
    );
  }

  async cambiarEscenario(idEmpresa, datos, usuarioAuditoria: string) {
    // this.verificarPermisos(idEmpresa, usuarioAuditoria);
    const empresa = await this.empresaRepositorio.findOne(idEmpresa);
    if (empresa) {
      const empresaDto = new ActualizarEmpresaDto();
      empresaDto.accion = 'RECLASIFICADO';
      empresaDto.escenario = datos.escenario;
      empresaDto.observacion = datos.observacion;
      empresaDto.usuarioActualizacion = usuarioAuditoria;
      await this.empresaRepositorio.update(idEmpresa, empresaDto);
      return { id: idEmpresa, estado: empresaDto.estado };
    }
    throw new EntityNotFoundException();
  }

  //   private verificarPermisos(usuarioAuditoria, id) {
  //     if (usuarioAuditoria === id) {
  //       throw new EntityForbiddenException();
  //     }
  //   }

  async actualizarDatos(
    id: string,
    empresaDto: ActualizarEmpresaDto,
    usuarioAuditoria: string,
  ) {
    // this.verificarPermisos(id, usuarioAuditoria);
    const empresa = await this.empresaRepositorio.findOne(id);
    if (empresa) {
      const { razonSocial } = empresaDto;
      if (razonSocial && razonSocial !== empresa.razonSocial) {
        const existe = await this.empresaRepositorio.buscarPorRazonSocial(
          razonSocial,
        );
        if (existe) {
          throw new PreconditionFailedException(
            'La razón social indicada ya está en uso!',
          );
        }
        //const actualizarEmpresaDto = new ActualizarEmpresaDto();
        //actualizarEmpresaDto.razonSocial = razonSocial;
        //actualizarEmpresaDto.usuarioActualizacion = usuarioAuditoria;
        empresaDto.usuarioActualizacion = usuarioAuditoria;
        await this.empresaRepositorio.update(id, empresaDto);
      }
      return { id };
    }
    throw new EntityNotFoundException();
  }

  async validarNITLinea(datos): Promise<any> {
    if (!datos.nit || datos.nit == '') {
      throw new PreconditionFailedException(
        'Debe proporcionar un NIT válido para realizar la verificación',
      );
    }
    const empresa = await this.empresaRepositorio.findOne(datos.idEmpresa);
    if (!empresa) {
      throw new PreconditionFailedException(
        'Sucedió un error al recuperar la información de la empresa seleccionada',
      );
    }
    const data = {
      MatriculaComercio: empresa.matriculaAnterior,
      NIT: datos.nit,
      RazonSocial: empresa.razonSocial,
    };
    //console.log(data);
    try {
      // Aqui consumimos IOP SinService
      // const validacion =
      const respuesta =
        await this.impuestosServices.VerificarNITPersonaJuridica(data);
      // console.log('=============================> validacion', validacion);
      // const respuesta = await http
      //  .post(process.env.URL_SIN_VERIFICACION_NIT_PERSONA_JURIDICA, data)
      //  .toPromise();
      // console.log('respuesta desde external service', respuesta);
      if (respuesta) {
        return respuesta;
      } else {
        console.log('something failed while connecting to SIN...');
        throw new ExternalServiceException(
          'SIN:VALIDAR_NIT',
          'Falló la consulta al SIN',
        );
      }
    } catch (error) {
      throw new ExternalServiceException('SIN:VALIDAR_NIT', error);
    }
  }
}
