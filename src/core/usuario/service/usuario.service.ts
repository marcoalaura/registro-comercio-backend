/* eslint-disable max-lines */
import { Injectable, PreconditionFailedException, Query } from '@nestjs/common';
import { UsuarioRepository } from '../repository/usuario.repository';
import { Usuario } from '../entity/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../../common/constants';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';
import { TextService } from '../../../common/lib/text.service';
import { MensajeriaService } from '../../external-services/mensajeria/mensajeria.service';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';
import { AuthorizationService } from '../../authorization/controller/authorization.service';
import { ActualizarUsuarioDto } from '../dto/actualizar-usuario.dto';
import { PersonaDto } from '../dto/persona.dto';
import { UsuarioRolRepository } from '../../authorization/repository/usuario-rol.repository';
import { ActualizarUsuarioRolDto } from '../dto/actualizar-usuario-rol.dto';
import { CrearUsuarioCiudadaniaDto } from '../dto/crear-usuario-ciudadania.dto';
import { SegipService } from '../../external-services/iop/segip/segip.service';
import { ConfigService } from '@nestjs/config';
import { TemplateEmailService } from '../../../common/templates/templates-email.service';
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto';
import { EntityForbiddenException } from '../../../common/exceptions/entity-forbidden.exception';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { RolRepository } from 'src/core/authorization/repository/rol.repository';
import { SessionRepository } from 'src/core/authentication/repository/sessions.repository';

@Injectable()
export class UsuarioService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    @InjectRepository(UsuarioRolRepository)
    private usuarioRolRepositorio: UsuarioRolRepository,
    @InjectRepository(RolRepository)
    private rolRepositorio: RolRepository,
    private readonly mensajeriaService: MensajeriaService,
    private readonly authorizationService: AuthorizationService,
    private readonly segipServices: SegipService,
    private configService: ConfigService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  // GET USERS
  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    const resultado = await this.usuarioRepositorio.listar(paginacionQueryDto);
    return resultado;
  }

  async buscarUsuario(usuario: string): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuario(usuario);
  }

  async crear(usuarioDto: CrearUsuarioDto, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(
      usuarioDto.persona,
    );
    if (!usuario) {
      // verificar si el correo no esta registrado
      const correo = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
        usuarioDto.correoElectronico,
      );
      if (!correo) {
        // contrastacion segip
        const { persona } = usuarioDto;
        const contrastaSegip = await this.segipServices.contrastar(persona);
        if (contrastaSegip?.finalizado) {
          const contrasena = TextService.generateShortRandomText();
          usuarioDto.contrasena = await TextService.encrypt(contrasena);
          usuarioDto.estado = Status.PENDING;
          const result = await this.usuarioRepositorio.crear(
            usuarioDto,
            usuarioAuditoria,
          );
          // enviar correo con credenciales
          const datosCorreo = {
            correo: usuarioDto.correoElectronico,
            asunto: Messages.SUBJECT_EMAIL_ACCOUNT_ACTIVE,
          };
          await this.enviarCorreoContrasenia(
            datosCorreo,
            usuarioDto.persona.nroDocumento,
            contrasena,
          );
          const { id, estado } = result;
          return { id, estado };
        }
        throw new PreconditionFailedException(contrastaSegip.mensaje);
      }
      throw new PreconditionFailedException(Messages.EXISTING_EMAIL);
    }
    throw new PreconditionFailedException(Messages.EXISTING_USER);
  }

  async crearConCiudadania(
    usuarioDto: CrearUsuarioCiudadaniaDto,
    usuarioAuditoria: string,
  ) {
    const persona = new PersonaDto();
    persona.nroDocumento = usuarioDto.usuario;
    const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(persona);
    if (!usuario) {
      usuarioDto.estado = Status.ACTIVE;
      const result = await this.usuarioRepositorio.crear(
        usuarioDto as CrearUsuarioDto,
        usuarioAuditoria,
      );
      const { id, estado } = result;
      return { id, estado };
    }
    throw new PreconditionFailedException(Messages.EXISTING_USER);
  }

  async crearConCiudadaniaV2(personaCiudadania, usuarioAuditoria: string) {
    const persona = new PersonaDto();
    // completar campos de Ciudadanía
    persona.tipoDocumento = personaCiudadania.tipoDocumento;
    persona.nroDocumento = personaCiudadania.nroDocumento;
    persona.fechaNacimiento = personaCiudadania.fechaNacimiento;
    persona.nombres = personaCiudadania.nombres;
    persona.primerApellido = personaCiudadania.primerApellido;
    persona.segundoApellido = personaCiudadania.segundoApellido;
    // const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(persona);
    const usuario = await this.usuarioRepositorio.verificarExisteUsuarioPorCI(
      persona.nroDocumento,
    );
    if (!usuario) {
      const rol = await this.rolRepositorio.buscarPorNombreRol(
        RolEnum.EMPRESARIO,
      );
      console.log('rol obtenido', rol);
      const nuevoUsuario = {
        usuario: personaCiudadania.nroDocumento,
        estado: Status.ACTIVE,
        persona,
        ciudadaniaDigital: true,
        roles: [rol],
      };
      const result = await this.usuarioRepositorio.crearConCiudadania(
        nuevoUsuario,
        usuarioAuditoria,
      );
      const { id, estado } = result;
      return { id, estado };
    }
    throw new PreconditionFailedException(Messages.EXISTING_USER);
  }

  async crearConPersonaExistente(persona, usuarioAuditoria: string) {
    // const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(persona);
    const usuario = await this.usuarioRepositorio.verificarExisteUsuarioPorCI(
      persona.nroDocumento,
    );
    if (!usuario) {
      const rol = await this.rolRepositorio.buscarPorNombreRol(
        RolEnum.EMPRESARIO,
      );
      console.log('rol obtenido', rol);
      const nuevoUsuario = {
        estado: Status.ACTIVE,
        persona,
        ciudadaniaDigital: true,
        roles: [rol],
      };
      const result = await this.usuarioRepositorio.crearConPersonaExistente(
        nuevoUsuario,
        usuarioAuditoria,
      );
      const { id, estado } = result;
      return { id, estado };
    }
    throw new PreconditionFailedException(Messages.EXISTING_USER);
  }

  async activar(idUsuario, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria);
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING];
    if (usuario && statusValid.includes(usuario.estado as Status)) {
      // cambiar estado al usuario y generar una nueva contrasena
      const contrasena = TextService.generateShortRandomText();
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.contrasena = await TextService.encrypt(contrasena);
      usuarioDto.estado = Status.PENDING;
      usuarioDto.usuarioActualizacion = usuarioAuditoria;
      await this.usuarioRepositorio.update(idUsuario, usuarioDto);
      // si todo bien => enviar el mail con la contraseña generada
      const datosCorreo = {
        correo: usuario.correoElectronico,
        asunto: Messages.SUBJECT_EMAIL_ACCOUNT_ACTIVE,
      };
      await this.enviarCorreoContrasenia(
        datosCorreo,
        usuario.usuario,
        contrasena,
      );
      return { id: idUsuario, estado: usuarioDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  async inactivar(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria);
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    if (usuario) {
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.usuarioActualizacion = usuarioAuditoria;
      usuarioDto.estado = Status.INACTIVE;
      await this.usuarioRepositorio.update(idUsuario, usuarioDto);
      return {
        id: idUsuario,
        estado: usuarioDto.estado,
      };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  private async enviarCorreoContrasenia(datosCorreo, usuario, contrasena) {
    const url = this.configService.get('URL_FRONTEND');
    const template = TemplateEmailService.armarPlantillaActivacionCuenta(
      url,
      usuario,
      contrasena,
    );

    const result = await this.mensajeriaService.sendEmail(
      datosCorreo.correo,
      datosCorreo.asunto,
      template,
    );
    return result.finalizado;
  }

  private verificarPermisos(usuarioAuditoria, id) {
    if (usuarioAuditoria === id) {
      throw new EntityForbiddenException();
    }
  }

  async actualizarContrasena(idUsuario, contrasenaActual, contrasenaNueva) {
    const hash = TextService.decodeBase64(contrasenaActual);
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(
      idUsuario,
    );
    if (usuario && (await TextService.compare(hash, usuario.contrasena))) {
      // validar que la contrasena nueva cumpla nivel de seguridad
      const contrasena = TextService.decodeBase64(contrasenaNueva);
      if (TextService.validateLevelPassword(contrasena)) {
        // guardar en bd
        const usuarioDto = new ActualizarUsuarioDto();
        usuarioDto.contrasena = await TextService.encrypt(contrasena);
        usuarioDto.estado = Status.ACTIVE;
        await this.usuarioRepositorio.update(idUsuario, usuarioDto);
        return {
          id: idUsuario,
          estado: usuarioDto.estado,
        };
      }
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE);
    }
    throw new PreconditionFailedException(Messages.INVALID_CREDENTIALS);
  }

  async restaurarContrasena(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria);
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    const statusValid = [Status.ACTIVE, Status.PENDING];
    if (usuario && statusValid.includes(usuario.estado as Status)) {
      const contrasena = TextService.generateShortRandomText();
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.contrasena = await TextService.encrypt(contrasena);
      usuarioDto.estado = Status.PENDING;
      usuarioDto.usuarioActualizacion = usuarioAuditoria;

      const op = async (transaction) => {
        const repositorio = transaction.getRepository(Usuario);
        await repositorio.update(idUsuario, usuarioDto);
        // si todo bien => enviar el mail con la contraseña generada
        const datosCorreo = {
          correo: usuario.correoElectronico,
          asunto: Messages.SUBJECT_EMAIL_ACCOUNT_RESET,
        };
        await this.enviarCorreoContrasenia(
          datosCorreo,
          usuario.usuario,
          contrasena,
        );
      };
      await this.usuarioRepositorio.runTransaction(op);
      return { id: idUsuario, estado: usuarioDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  async actualizarDatos(
    id: string,
    usuarioDto: ActualizarUsuarioRolDto,
    usuarioAuditoria: string,
  ) {
    this.verificarPermisos(id, usuarioAuditoria);
    // 1. verificar que exista el usuario
    const usuario = await this.usuarioRepositorio.findOne(id);
    if (usuario) {
      const { correoElectronico, roles } = usuarioDto;
      // 2. verificar que el email no este registrado
      if (
        correoElectronico &&
        correoElectronico !== usuario.correoElectronico
      ) {
        const existe = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
          correoElectronico,
        );
        if (existe) {
          throw new PreconditionFailedException(Messages.EXISTING_EMAIL);
        }
        const actualizarUsuarioDto = new ActualizarUsuarioDto();
        actualizarUsuarioDto.correoElectronico = correoElectronico;
        actualizarUsuarioDto.usuarioActualizacion = usuarioAuditoria;
        await this.usuarioRepositorio.update(id, actualizarUsuarioDto);
      }
      if (roles.length > 0) {
        // realizar reglas de roles
        await this.actualizarRoles(id, roles, usuarioAuditoria);
      }
      return { id };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  private async actualizarRoles(id, roles, usuarioAuditoria) {
    const usuarioRoles =
      await this.usuarioRolRepositorio.obtenerRolesPorUsuario(id);
    const { inactivos, activos, nuevos } = this.verificarUsuarioRoles(
      usuarioRoles,
      roles,
    );
    // ACTIVAR roles inactivos
    if (inactivos.length > 0) {
      await this.usuarioRolRepositorio.activar(id, inactivos, usuarioAuditoria);
    }
    // INACTIVAR roles activos
    if (activos.length > 0) {
      await this.usuarioRolRepositorio.inactivar(id, activos, usuarioAuditoria);
    }
    // CREAR nuevos roles
    if (nuevos.length > 0) {
      await this.usuarioRolRepositorio.crear(id, nuevos, usuarioAuditoria);
    }
  }

  private verificarUsuarioRoles(usuarioRoles, roles) {
    const inactivos = roles.filter((rol) =>
      usuarioRoles.some(
        (usuarioRol) =>
          usuarioRol.rol.id === rol && usuarioRol.estado === Status.INACTIVE,
      ),
    );

    const activos = usuarioRoles
      .map((usuarioRol) =>
        roles.every(
          (rol) =>
            rol !== usuarioRol.rol.id && usuarioRol.estado === Status.ACTIVE,
        )
          ? usuarioRol.rol.id
          : null,
      )
      .filter(Boolean);

    const nuevos = roles.filter((rol) =>
      usuarioRoles.every((usuarioRol) => usuarioRol.rol.id !== rol),
    );

    return {
      activos,
      inactivos,
      nuevos,
    };
  }

  async buscarUsuarioId(id: string) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(id);
    let roles = [];
    if (usuario?.usuarioRol?.length) {
      roles = await Promise.all(
        usuario.usuarioRol.map(async (usuarioRol) => {
          const { rol } = usuarioRol.rol;
          if (usuarioRol.estado === Status.ACTIVE) {
            const modulos =
              await this.authorizationService.obtenerPermisosPorRol(rol);
            return {
              rol,
              modulos,
            };
          }
          return false;
        }),
      );
      roles = roles.filter(Boolean);
      return {
        id: usuario.id,
        usuario: usuario.usuario,
        estado: usuario.estado,
        roles,
        persona: usuario.persona,
      };
    } else {
      throw new EntityNotFoundException(Messages.INVALID_USER);
    }
  }

  async buscarUsuarioPorCI(persona: PersonaDto): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuarioPorCI(persona);
  }

  async actualizarContadorBloqueos(idUsuario: number, intento: number) {
    const usuario = await this.usuarioRepositorio.actualizarContadorBloqueos(
      idUsuario,
      intento,
    );
    return usuario;
  }

  async actualizarDatosBloqueo(idUsuario, codigo, fechaBloqueo) {
    const usuario = await this.usuarioRepositorio.actualizarDatosBloqueo(
      idUsuario,
      codigo,
      fechaBloqueo,
    );
    return usuario;
  }

  async desbloquearCuenta(codigo: string) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoDesbloqueo(
      codigo,
    );
    if (usuario?.fechaBloqueo) {
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.fechaBloqueo = null;
      usuarioDto.intentos = 0;
      usuarioDto.codigoDesbloqueo = null;
      await this.usuarioRepositorio.update(usuario.id, usuarioDto);
    }
    return { codigo };
  }

  async actualizarDatosPersona(datosPersona: PersonaDto) {
    const usuario = await this.usuarioRepositorio.actualizarDatosPersona(
      datosPersona,
    );
    return usuario;
  }

  async obtenerAccessTokenCD(id: number) {
    const respuesta = await this.sessionRepository.obtenerAccessTokenCD(id);
    return respuesta.length > 0 && respuesta[0].access_token
      ? respuesta[0].access_token
      : null;
  }
}
