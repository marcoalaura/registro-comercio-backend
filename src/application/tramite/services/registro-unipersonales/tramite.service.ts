/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception';
import {
  CrearTramiteRegistroUnipersonalDto,
  personaTramiteRegistroUnipersonalDto,
  direccionTramiteRegistroUnipersonalDto,
  documentoTramiteRegistroUnipersonalDto,
} from '../../dto/registro-unipersonal/tramite.dto';
import { TramiteRegistroUnipersonalesRepository } from '../../repository/registro-unipersonales/tramite.repository';
import { nanoid } from 'nanoid';
import { TramiteGenericoService } from '../tramite-generico/tramite-generico.service';
import { ParametricaRepository } from '../../repository/parametrica.repository';
import { TramiteDetalleRepository } from '../../repository/tramite-detalle.repository';
import { TramiteDocumentoSoporteRepository } from '../../repository/tramite-documento-soporte.repository';
import { ClasificadorRepository } from 'src/application/empresa/repository/clasificador.repository';
import { PreconditionFailedException } from '@nestjs/common';
import { Parametrica } from '../../entities/parametricas/parametrica.entity';
import { ParametroService } from 'src/application/parametro/parametro.service';
import {
  Status,
  GruposParametros,
  CLASIFICADOR_ACTIVO,
} from '../../../../common/constants/';
import { unlinkSync } from 'fs';

@Injectable()
export class TramiteRegistroUnipersonalesService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(TramiteRegistroUnipersonalesRepository)
    private tramiteRepository: TramiteRegistroUnipersonalesRepository,
    @InjectRepository(ParametricaRepository)
    private parametricaRepository: ParametricaRepository,
    @InjectRepository(TramiteDetalleRepository)
    private tramiteDetalleRepository: TramiteDetalleRepository,
    @InjectRepository(TramiteDocumentoSoporteRepository)
    private tramiteDocumentoSoporteRepository: TramiteDocumentoSoporteRepository,
    @InjectRepository(ClasificadorRepository)
    private clasificadorRepository: ClasificadorRepository,
    private readonly tramiteGenericoService: TramiteGenericoService,
    private readonly parametroService: ParametroService,
  ) {}

  async buscarPorId(id: number) {
    const tramite = await this.tramiteRepository.buscarPorId(id);

    if (!tramite) throw new EntityNotFoundException();

    if (tramite.detalles && tramite.detalles.length > 0) {
      this.armarFormDetalles(tramite);
    }

    if (tramite.usuarioPropietario && tramite.usuarioPropietario.persona) {
      this.armarFormPersona(tramite);
    }

    return tramite;
  }

  async buscarPorIdConParametro(id: number) {
    const tramite = await this.tramiteRepository.buscarPorIdConParametro(id);

    if (!tramite) throw new EntityNotFoundException();

    if (tramite.detalles && tramite.detalles.length > 0) {
      await this.armarFormDetallesConParametros(tramite);
    }

    if (tramite.usuarioPropietario && tramite.usuarioPropietario.persona) {
      this.armarFormPersona(tramite);
    }

    return tramite;
  }

  /**
   * Metodo para crear tramite de inscripcion
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto tramite
   */
  async crearTramite(
    datosForm: CrearTramiteRegistroUnipersonalDto,
    usuarioAuditoria: string,
  ) {
    const codigoCatalogoTramite = '5';

    const catalogoTramite =
      await this.parametricaRepository.obtenerCatalogoTramitePorCodigo(
        codigoCatalogoTramite,
      );

    if (!catalogoTramite)
      throw new PreconditionFailedException(
        'No se encontro el tramite solicitado',
      );

    const data = {
      version: catalogoTramite.version,
      codigo: nanoid(),
      idEmpresa: null,
      idCatalogoTramite: catalogoTramite.id,
      usuarioAuditoria,
    };

    const nuevoTramite = await this.tramiteGenericoService.crearCabeceraTramite(
      data,
      null,
    );

    console.log('nuevo tramite-------------', nuevoTramite);

    // Guardar datos de paso 1
    const detalles = [];
    if (datosForm.tipoUnidadEconomica) {
      const item = {
        campo: 'cod_tipo_unidad_economica',
        valor: datosForm.tipoUnidadEconomica,
        tabla: 'empresas',
      };
      detalles.push(item);
    }
    if (datosForm.actividadPrincipal || datosForm.actividadesSecundarias) {
      const valor = {
        actividadPrincipal: datosForm.actividadPrincipal,
        actividadesSecundarias: datosForm.actividadesSecundarias,
      };
      const item = {
        campo: 'cod_actividad',
        valorComplejo: valor,
        tipo: 'json',
        tabla: 'actividades_economicas',
      };
      detalles.push(item);
    }
    // if (datosForm.actividadesSecundarias) {
    //   for (const actividad in datosForm.actividadesSecundarias) {
    //     const item = {
    //       campo: 'cod_actividad',
    //       valor: datosForm.actividadesSecundarias[actividad],
    //       tipo: 'string',
    //       tabla: 'actividades_economicas',
    //     };
    //     detalles.push(item);
    //   }
    // }
    if (datosForm.razonSocial) {
      const item = {
        campo: 'razon_social',
        valor: datosForm.razonSocial,
        tabla: 'empresas',
      };
      detalles.push(item);
    }
    if (datosForm.tipoRazonSocial) {
      const item = {
        campo: 'cod_tipo_razon_social',
        valor: datosForm.tipoRazonSocial,
        tabla: 'empresas',
      };
      detalles.push(item);
    }
    if (datosForm.objetoSocial) {
      const item = {
        campo: 'objeto_social',
        valor: datosForm.objetoSocial,
        tabla: 'objetos_sociales',
      };
      detalles.push(item);
    }
    if (datosForm.capital) {
      const item = {
        campo: 'capital_social',
        valor: datosForm.capital,
        tipo: 'numeric',
        tabla: 'capitales',
      };
      detalles.push(item);
    }

    detalles.map((d) => {
      d.tipo = d.tipo ?? 'string';
      d.idTramite = nuevoTramite.id;
      d.usuarioAuditoria = usuarioAuditoria;
      return d;
    });

    console.log(detalles);

    try {
      await this.tramiteDetalleRepository.crear(detalles);
    } catch (error) {
      console.log('Sucedió un error... ', error);
      throw new PreconditionFailedException(
        `Sucedió un error al registrar los datos del tramite`,
      );
    }

    // let item: keyof typeof datosForm;
    // for (item in datosForm) {
    // }

    return this.construirRespuestaCrearTramite(
      nuevoTramite,
      catalogoTramite,
      datosForm,
    );
  }

  /**
   * Metodo para crear tramite de inscripcion
   * @param datosForm datos de persona y contacto
   * @param idTramite identificador del tramite en base de datos
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto tramite
   */
  async agregarDatosContacto(
    datosForm: personaTramiteRegistroUnipersonalDto,
    idTramite: number,
    usuarioAuditoria: string,
  ) {
    const tramite = await this.tramiteRepository.findOne(idTramite);

    if (!tramite) throw new EntityNotFoundException();

    const catalogoTramite = await this.parametricaRepository.findOne(
      tramite.idParametrica,
    );

    if (!catalogoTramite)
      throw new PreconditionFailedException(
        'No se encontró el trámite solicitado',
      );

    // Guardar datos de paso 2 - contactos
    if (datosForm.contacto) {
      const detalles = [];
      // const valor = {
      //   celular: datosForm.contacto.celular ?? null,
      //   telefonoFijo: datosForm.contacto.telefonoFijo ?? null,
      //   correo: datosForm.contacto.correo ?? null,
      // };

      // if (datosForm.contacto.celular) {
      //   // const item = {
      //   //   // campo: 'tipo_contacto',
      //   //   valor: 'Telefono celular|' + datosForm.contacto.celular,
      //   //   // tipo: 'string',
      //   //   // tabla: 'contactos',
      //   // };
      //   // detalles.push(item);
      //   valor.celular = datosForm.contacto.celular;
      // }
      // if (datosForm.contacto.telefonoFijo) {
      //   // const item = {
      //   //   // campo: 'tipo_contacto',
      //   //   valor: 'Telefono fijo|' + datosForm.contacto.telefonoFijo,
      //   //   // tipo: 'string',
      //   //   // tabla: 'contactos',
      //   // };
      //   // detalles.push(item);
      //   valor.telefonoFijo = datosForm.contacto.telefonoFijo;
      // }
      // if (datosForm.contacto.correo) {
      //   // const item = {
      //   //   // campo: 'tipo_contacto',
      //   //   valor: 'Correo|' + datosForm.contacto.correo,
      //   //   // tipo: 'string',
      //   //   // tabla: 'contactos',
      //   // };
      //   // detalles.push(item);
      //   valor.correo = datosForm.contacto.correo;
      // }

      detalles.push({
        campo: 'canales',
        valorComplejo: datosForm.contacto,
        tipo: 'json',
        tabla: 'canales_comunicacion',
        idTramite: tramite.id,
        usuarioAuditoria,
      });

      // detalles.map((d) => {
      //   d.campo = 'tipo_contacto';
      //   d.tipo = 'string';
      //   d.tabla = 'contactos';
      //   d.idTramite = tramite.id;
      //   d.usuarioAuditoria = usuarioAuditoria;
      //   return d;
      // });

      console.log(detalles);

      for await (const detalle of detalles) {
        try {
          const contactoExistente =
            await this.tramiteDetalleRepository.buscarPorCampoTramite(
              detalle.campo,
              tramite.id,
            );

          // console.log('existente-------------', contactoExistente.id);

          // eslint-disable-next-line max-depth
          if (contactoExistente && contactoExistente.id) {
            // eslint-disable-next-line max-depth
            if (
              (detalle.valor && contactoExistente.valor != detalle.valor) ||
              detalle.valorComplejo
            ) {
              console.log(`actualizar: ${contactoExistente.id}`, detalle.campo);
              detalle.id = contactoExistente.id;
              await this.tramiteDetalleRepository.actualizarValor(detalle);
            } else {
              console.log(`.....${contactoExistente.id} sin cambios.....`);
            }
          } else {
            await this.tramiteDetalleRepository.crear(detalle);
          }
        } catch (error) {
          console.log('Sucedió un error... ', error);
          throw new PreconditionFailedException(
            `No se pudo actualizar la información de ${detalle.campo}`,
          );
        }
      }
    }

    return this.construirRespuestaCrearTramite(
      tramite,
      catalogoTramite,
      datosForm,
    );
  }

  /**
   * Metodo para crear tramite de inscripcion
   * @param datosForm datos de direccion y contacto
   * @param idTramite identificador del tramite en base de datos
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto tramite
   */
  async agregarDatosDireccionContacto(
    datosForm: direccionTramiteRegistroUnipersonalDto,
    idTramite: number,
    usuarioAuditoria: string,
  ) {
    const tramite = await this.tramiteRepository.findOne(idTramite);

    if (!tramite) throw new EntityNotFoundException();

    const catalogoTramite = await this.parametricaRepository.findOne(
      tramite.idParametrica,
    );

    if (!catalogoTramite)
      throw new PreconditionFailedException(
        'No se encontro el tramite solicitado',
      );

    // Guardar datos de paso 3 - direccion y contacto de direccion
    const detallesDireccion = [];
    if (datosForm.idDepartamento) {
      detallesDireccion.push({
        campo: 'cod_departamento',
        valor: datosForm.idDepartamento,
      });
    }
    if (datosForm.idProvincia) {
      detallesDireccion.push({
        campo: 'cod_provincia',
        valor: datosForm.idProvincia,
      });
    }
    if (datosForm.idMunicipio) {
      detallesDireccion.push({
        campo: 'cod_municipio',
        valor: datosForm.idMunicipio,
      });
    }
    if (datosForm.tipoDivision) {
      detallesDireccion.push({
        campo: 'cod_tipo_subdivision_geografica',
        valor: datosForm.tipoDivision,
      });
    }
    if (datosForm.nombreDivision) {
      detallesDireccion.push({
        campo: 'nombre_subdivision_geografica',
        valor: datosForm.nombreDivision,
      });
    }
    if (datosForm.tipoVia) {
      detallesDireccion.push({
        campo: 'cod_tipo_via',
        valor: datosForm.tipoVia,
      });
    }
    if (datosForm.nombreVia) {
      detallesDireccion.push({
        campo: 'nombre_via',
        valor: datosForm.nombreVia,
      });
    }
    if (datosForm.direccionReferencial) {
      detallesDireccion.push({
        campo: 'direccion_referencial',
        valor: datosForm.direccionReferencial,
      });
    }
    if (datosForm.numeroDomicilio) {
      detallesDireccion.push({
        campo: 'numero_domicilio',
        valor: datosForm.numeroDomicilio,
      });
    }
    if (datosForm.edificio) {
      detallesDireccion.push({
        campo: 'edificio',
        valor: datosForm.edificio,
      });
    }
    if (datosForm.piso) {
      detallesDireccion.push({
        campo: 'piso',
        valor: datosForm.piso,
      });
    }
    if (datosForm.tipoAmbiente) {
      detallesDireccion.push({
        campo: 'cod_tipo_ambiente',
        valor: datosForm.tipoAmbiente,
      });
    }
    if (datosForm.numeroAmbiente) {
      detallesDireccion.push({
        campo: 'numero_nombre_ambiente',
        valor: datosForm.numeroAmbiente,
      });
    }
    if (datosForm.position) {
      if (datosForm.position.lat) {
        detallesDireccion.push({
          campo: 'latitud',
          valor: String(datosForm.position.lat),
        });
      }
      if (datosForm.position.lng) {
        detallesDireccion.push({
          campo: 'longitud',
          valor: String(datosForm.position.lng),
        });
      }
    }

    detallesDireccion.map((d) => {
      d.tipo = 'string';
      d.tabla = 'direcciones';
      d.idTramite = tramite.id;
      d.usuarioAuditoria = usuarioAuditoria;
      return d;
    });

    // console.log(detallesDireccion);

    // contacto de direccion
    const detallesContacto = [];
    const valor = {
      correoElectronico: datosForm.correoElectronico ?? null,
      telefono1: datosForm.telefono1 ?? null,
      telefono2: datosForm.telefono2 ?? null,
      telefono3: datosForm.telefono3 ?? null,
    };

    // if (datosForm.correoElectronico) {
    //   // detallesContacto.push({
    //   //   valor: 'Dirección correo|' + datosForm.correoElectronico,
    //   // });
    //   valor.correoElectronico = datosForm.correoElectronico;
    // }
    // if (datosForm.telefono1) {
    //   // detallesContacto.push({
    //   //   valor: 'Telefono 1|' + datosForm.telefono1,
    //   // });
    //   valor.telefono1 = datosForm.telefono1;
    // }
    // if (datosForm.telefono2) {
    //   // detallesContacto.push({
    //   //   valor: 'Telefono 2|' + datosForm.telefono2,
    //   // });
    //   valor.telefono2 = datosForm.telefono2;
    // }
    // if (datosForm.telefono3) {
    //   // detallesContacto.push({
    //   //   valor: 'Telefono 3|' + datosForm.telefono3,
    //   // });
    //   valor.telefono3 = datosForm.telefono3;
    // }

    detallesContacto.push({
      campo: 'contacto_descripcion',
      valorComplejo: valor,
      tipo: 'json',
      tabla: 'contactos',
      idTramite: tramite.id,
      usuarioAuditoria,
    });

    // console.log(detallesContacto);

    const detalles = detallesDireccion.concat(detallesContacto);
    console.log(detalles);

    for await (const detalle of detalles) {
      try {
        const contactoExistente =
          await this.tramiteDetalleRepository.buscarPorCampoTramite(
            detalle.campo,
            tramite.id,
          );

        // console.log('existente-------------', contactoExistente.id);

        // eslint-disable-next-line max-depth
        if (contactoExistente && contactoExistente.id) {
          // eslint-disable-next-line max-depth
          if (
            (detalle.valor && contactoExistente.valor != detalle.valor) ||
            detalle.valorComplejo
          ) {
            console.log(`actualizar: ${contactoExistente.id}`, detalle.campo);
            detalle.id = contactoExistente.id;
            await this.tramiteDetalleRepository.actualizarValor(detalle);
          } else {
            console.log(`.....${contactoExistente.id} sin cambios.....`);
          }
        } else {
          await this.tramiteDetalleRepository.crear(detalle);
        }
      } catch (error) {
        console.log('Sucedió un error... ', error);
        throw new PreconditionFailedException(
          `No se pudo actualizar la información de ${detalle.campo}`,
        );
      }
    }

    // try {
    //   await this.tramiteDetalleRepository.crear(detallesDireccion);
    //   await this.tramiteDetalleRepository.crear(detallesContacto);
    // } catch (error) {
    //   // throw new Error();
    //   console.log('Sucedió un error... ', error);
    // }

    return this.construirRespuestaCrearTramite(
      tramite,
      catalogoTramite,
      datosForm,
    );
  }

  /**
   * Metodo para guardar un documento soporte del tramite
   * @param datosDocumento objeto con los datos del documento
   * @param datosArchivo objeto con los datos del archivo recibido
   * @param idTramite identificador del tramite en base de datos
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto tramite
   */
  // eslint-disable-next-line max-params
  async agregarDocumentoSoporte(
    datosDocumento: documentoTramiteRegistroUnipersonalDto,
    datosArchivo: any,
    idTramite: number,
    usuarioAuditoria: string,
  ) {
    const tramite = await this.tramiteRepository.findOne(idTramite);

    if (!tramite) throw new EntityNotFoundException();

    const catalogoTramite = await this.parametricaRepository.findOne(
      tramite.idParametrica,
    );

    if (!catalogoTramite)
      throw new PreconditionFailedException(
        'No se encontro el tramite solicitado',
      );

    // Guardar datos de paso 4 - documento soporte
    const guardar = {
      usuarioAuditoria,
      idTramite,
      campo: 'documento_soporte',
      tipo: datosDocumento.tipoDocumento ?? datosArchivo.tipoDocumento,
      nroDocumento: datosDocumento.numeroDocumento,
      emisor: datosDocumento.emisor,
      fechaEmision: datosDocumento.fechaEmision,
      nombre: datosDocumento.nombreDocumento,
      hash: datosArchivo.hashDocumento,
      ruta: datosArchivo.ruta,
      estado: Status.ACTIVE,
      detalle: datosDocumento.detalle,
    };

    console.log(guardar);

    if (
      !guardar.nroDocumento ||
      !guardar.emisor ||
      !guardar.nombre ||
      !guardar.fechaEmision
    ) {
      throw new PreconditionFailedException(
        'Debe completar todos los datos del documento de soporte',
      );
    }

    try {
      const registroExistente =
        await this.tramiteDocumentoSoporteRepository.buscarPorTramiteCampo(
          tramite.id,
          guardar.campo,
        );

      // console.log('existente-------------', registroExistente.id);

      if (registroExistente && registroExistente.id) {
        // console.log(registroExistente.ruta);
        const pathArchivoAnterior = registroExistente.ruta;

        console.log(`actualizar: ${registroExistente.id}`, guardar.campo);
        delete guardar.usuarioAuditoria;
        await this.tramiteDocumentoSoporteRepository.actualizar({
          id: registroExistente.id,
          usuarioActualizacion: usuarioAuditoria,
          ...guardar,
        });

        // Borrar archivo anterior
        console.log('Borrando===========>', pathArchivoAnterior);
        unlinkSync(pathArchivoAnterior);
      } else {
        await this.tramiteDocumentoSoporteRepository.crear(guardar);
      }
    } catch (error) {
      console.log(
        'Sucedió un error al guardar el documento soporte... ',
        error,
      );
      throw new Error();
    }

    // try {
    //   await this.tramiteDocumentoSoporteRepository.crear(guardar);
    // } catch (error) {
    //   console.log(
    //     'Sucedió un error al guardar el documento soporte... ',
    //     error,
    //   );
    //   throw new Error();
    // }

    return this.construirRespuestaCrearTramite(
      tramite,
      catalogoTramite,
      datosDocumento,
    );
  }

  armarFormDetalles(tramite) {
    const detalles = tramite.detalles;
    delete tramite.detalles;
    tramite.form = {
      direccion: {},
    };

    for (const detalle of detalles) {
      switch (detalle.campo) {
        case 'cod_tipo_unidad_economica':
          tramite.form.tipoUnidadEconomica = detalle.valor;
          break;
        case 'cod_actividad':
          if (detalle.valorComplejo) {
            tramite.form.actividadPrincipal =
              detalle.valorComplejo.actividadPrincipal;
            tramite.form.actividadesSecundarias =
              detalle.valorComplejo.actividadesSecundarias;
          }
          // if (detalle.valor.includes('_principal')) {
          //   tramite.form.actividadPrincipal = detalle.valor.split('_')[0];
          // } else {
          //   // eslint-disable-next-line max-depth
          //   if (
          //     tramite.form.actividadesSecundarias &&
          //     tramite.form.actividadesSecundarias.length > 0
          //   ) {
          //     tramite.form.actividadesSecundarias.push(detalle.valor);
          //   } else {
          //     tramite.form.actividadesSecundarias = [detalle.valor];
          //   }
          // }
          break;
        case 'razon_social':
          tramite.form.razonSocial = detalle.valor;
          break;
        case 'cod_tipo_razon_social':
          tramite.form.tipoRazonSocial = detalle.valor;
          break;
        case 'objeto_social':
          tramite.form.objetoSocial = detalle.valor;
          break;
        case 'capital_social':
          tramite.form.capital = parseInt(detalle.valor);
          break;
        case 'canales':
          // if (!tramite.form.contacto) {
          //   tramite.form.contacto = {};
          // }
          if (detalle.valorComplejo) {
            tramite.form.contacto = detalle.valorComplejo;
          }
          // if (detalle.valor.includes('Telefono 1|')) {
          //   // eslint-disable-next-line max-depth
          //   if (!tramite.form.direccion) {
          //     tramite.form.direccion = {};
          //   }
          //   tramite.form.direccion.telefono1 = detalle.valor.split('|')[1];
          // } else if (detalle.valor.includes('Telefono 2|')) {
          //   // eslint-disable-next-line max-depth
          //   if (!tramite.form.direccion) {
          //     tramite.form.direccion = {};
          //   }
          //   tramite.form.direccion.telefono2 = detalle.valor.split('|')[1];
          // } else if (detalle.valor.includes('Telefono 3|')) {
          //   // eslint-disable-next-line max-depth
          //   if (!tramite.form.direccion) {
          //     tramite.form.direccion = {};
          //   }
          //   tramite.form.direccion.telefono3 = detalle.valor.split('|')[1];
          // } else if (detalle.valor.includes('Dirección correo|')) {
          //   // eslint-disable-next-line max-depth
          //   if (!tramite.form.direccion) {
          //     tramite.form.direccion = {};
          //   }
          //   tramite.form.direccion.correoElectonico =
          //     detalle.valor.split('|')[1];
          // } else if (detalle.valor.includes('Telefono celular|')) {
          //   tramite.form.contacto.celular = detalle.valor.split('|')[1];
          // } else if (detalle.valor.includes('Telefono fijo|')) {
          //   tramite.form.contacto.telefonoFijo = detalle.valor.split('|')[1];
          // } else if (detalle.valor.includes('Correo|')) {
          //   tramite.form.contacto.correo = detalle.valor.split('|')[1];
          // }
          break;
        case 'contacto_descripcion':
          if (detalle.valorComplejo) {
            tramite.form.direccion.telefono1 = detalle.valorComplejo.telefono1;
            tramite.form.direccion.telefono2 = detalle.valorComplejo.telefono2;
            tramite.form.direccion.telefono3 = detalle.valorComplejo.telefono3;
            tramite.form.direccion.correoElectronico =
              detalle.valorComplejo.correoElectronico;
          }
          break;
        case 'cod_departamento':
          tramite.form.direccion.idDepartamento = detalle.valor;
          break;
        case 'cod_provincia':
          tramite.form.direccion.idProvincia = detalle.valor;
          break;
        case 'cod_municipio':
          tramite.form.direccion.idMunicipio = detalle.valor;
          break;
        case 'cod_tipo_subdivision_geografica':
          tramite.form.direccion.tipoDivision = detalle.valor;
          break;
        case 'nombre_subdivision_geografica':
          tramite.form.direccion.nombreDivision = detalle.valor;
          break;
        case 'cod_tipo_via':
          tramite.form.direccion.tipoVia = detalle.valor;
          break;
        case 'nombre_via':
          tramite.form.direccion.nombreVia = detalle.valor;
          break;
        case 'direccion_referencial':
          tramite.form.direccion.direccionReferencial = detalle.valor;
          break;
        case 'numero_domicilio':
          tramite.form.direccion.numeroDomicilio = detalle.valor;
          break;
        case 'edificio':
          tramite.form.direccion.edificio = detalle.valor;
          break;
        case 'piso':
          tramite.form.direccion.piso = detalle.valor;
          break;
        case 'cod_tipo_ambiente':
          tramite.form.direccion.tipoAmbiente = detalle.valor;
          break;
        case 'numero_nombre_ambiente':
          tramite.form.direccion.numeroAmbiente = detalle.valor;
          break;
        case 'latitud':
          if (!tramite.form.direccion.position) {
            tramite.form.direccion.position = {};
          }
          tramite.form.direccion.position.lat = parseFloat(detalle.valor);
          break;
        case 'longitud':
          if (!tramite.form.direccion.position) {
            tramite.form.direccion.position = {};
          }
          tramite.form.direccion.position.lng = parseFloat(detalle.valor);
          break;
      }
    }

    if (Object.entries(tramite.form.direccion).length === 0) {
      delete tramite.form.direccion;
    }

    console.log('formateado... ', tramite);
  }

  armarFormPersona(tramite) {
    const persona = tramite.usuarioPropietario?.persona;
    delete tramite.usuarioPropietario;
    if (!tramite.form) {
      tramite.form = {};
    }
    tramite.form.persona = persona;
  }

  async armarFormDetallesConParametros(tramite) {
    const detalles = tramite.detalles;
    delete tramite.detalles;
    tramite.form = {
      direccion: {},
    };

    let tmp = null;

    for await (const detalle of detalles) {
      switch (detalle.campo) {
        case 'cod_tipo_unidad_economica':
          tramite.form.tipoUnidadEconomica = detalle.valor;
          tmp = await this.parametroService.obtenerDescripcion(
            GruposParametros.TIPO_SOCIETARIO,
            detalle.valor,
          );
          tramite.form.unidadEconomica = tmp?.descripcion ?? null;
          break;
        case 'cod_actividad':
          if (detalle.valorComplejo) {
            tmp = await this.clasificadorRepository.obtenerDescripcion(
              CLASIFICADOR_ACTIVO,
              detalle.valorComplejo.actividadPrincipal,
            );
            tramite.form.actividadPrincipal =
              detalle.valorComplejo.actividadPrincipal;
            tramite.form.actividadPrincipalDescripcion =
              tmp?.descripcion ?? null;

            const actividadesSecundarias = [];

            // eslint-disable-next-line max-depth
            for await (const item of detalle.valorComplejo
              .actividadesSecundarias) {
              const tmp = await this.clasificadorRepository.obtenerDescripcion(
                CLASIFICADOR_ACTIVO,
                item,
              );
              actividadesSecundarias.push({
                codigo: item,
                descripcion: tmp?.descripcion ?? null,
              });
            }

            tramite.form.actividadesSecundarias = actividadesSecundarias;
          }
          break;
        case 'razon_social':
          tramite.form.razonSocial = detalle.valor;
          break;
        case 'cod_tipo_razon_social':
          tramite.form.tipoRazonSocial = detalle.valor;
          tmp = await this.parametroService.obtenerDescripcion(
            GruposParametros.TIPO_RAZON_SOCIAL,
            detalle.valor,
          );
          tramite.form.tipoRazonSocialDescripcion = tmp?.descripcion ?? null;
          break;
        case 'objeto_social':
          tramite.form.objetoSocial = detalle.valor;
          break;
        case 'capital_social':
          tramite.form.capital = parseInt(detalle.valor);
          break;
        case 'canales':
          // if (!tramite.form.contacto) {
          //   tramite.form.contacto = {};
          // }
          if (detalle.valorComplejo) {
            tramite.form.contacto = detalle.valorComplejo;
          }
          break;
        case 'contacto_descripcion':
          if (detalle.valorComplejo) {
            tramite.form.direccion.telefono1 = detalle.valorComplejo.telefono1;
            tramite.form.direccion.telefono2 = detalle.valorComplejo.telefono2;
            tramite.form.direccion.telefono3 = detalle.valorComplejo.telefono3;
            tramite.form.direccion.correoElectronico =
              detalle.valorComplejo.correoElectronico;
          }
          break;
        case 'cod_departamento':
          tramite.form.direccion.idDepartamento = detalle.valor;
          tmp = await this.parametroService.obtenerDescripcion(
            GruposParametros.DEPARTAMENTO,
            detalle.valor,
          );
          tramite.form.direccion.departamento = tmp?.descripcion ?? null;
          break;
        case 'cod_provincia':
          tramite.form.direccion.idProvincia = detalle.valor;
          tmp = await this.parametroService.obtenerDescripcion(
            GruposParametros.PROVINCIA,
            detalle.valor,
          );
          tramite.form.direccion.provincia = tmp?.descripcion ?? null;
          break;
        case 'cod_municipio':
          tramite.form.direccion.idMunicipio = detalle.valor;
          tmp = await this.parametroService.obtenerDescripcion(
            GruposParametros.MUNICIPIO,
            detalle.valor,
          );
          tramite.form.direccion.municipio = tmp?.descripcion ?? null;
          break;
        case 'cod_tipo_subdivision_geografica':
          tramite.form.direccion.tipoDivision = detalle.valor;
          tmp = await this.parametroService.obtenerDescripcion(
            GruposParametros.TIPO_SUBDIVISION_GEOGRAFICA,
            detalle.valor,
          );
          tramite.form.direccion.tipoDivisionDescripcion =
            tmp?.descripcion ?? null;
          break;
        case 'nombre_subdivision_geografica':
          tramite.form.direccion.nombreDivision = detalle.valor;
          break;
        case 'cod_tipo_via':
          tramite.form.direccion.tipoVia = detalle.valor;
          tmp = await this.parametroService.obtenerDescripcion(
            GruposParametros.TIPO_VIA,
            detalle.valor,
          );
          tramite.form.direccion.tipoViaDescripcion = tmp?.descripcion ?? null;
          break;
        case 'nombre_via':
          tramite.form.direccion.nombreVia = detalle.valor;
          break;
        case 'direccion_referencial':
          tramite.form.direccion.direccionReferencial = detalle.valor;
          break;
        case 'numero_domicilio':
          tramite.form.direccion.numeroDomicilio = detalle.valor;
          break;
        case 'edificio':
          tramite.form.direccion.edificio = detalle.valor;
          break;
        case 'piso':
          tramite.form.direccion.piso = detalle.valor;
          break;
        case 'cod_tipo_ambiente':
          tramite.form.direccion.tipoAmbiente = detalle.valor;
          tmp = await this.parametroService.obtenerDescripcion(
            GruposParametros.TIPO_AMBIENTE,
            detalle.valor,
          );
          tramite.form.direccion.tipoAmbienteDescripcion =
            tmp?.descripcion ?? null;
          break;
        case 'numero_nombre_ambiente':
          tramite.form.direccion.numeroAmbiente = detalle.valor;
          break;
        case 'latitud':
          if (!tramite.form.direccion.position) {
            tramite.form.direccion.position = {};
          }
          tramite.form.direccion.position.lat = parseFloat(detalle.valor);
          break;
        case 'longitud':
          if (!tramite.form.direccion.position) {
            tramite.form.direccion.position = {};
          }
          tramite.form.direccion.position.lng = parseFloat(detalle.valor);
          break;
      }
    }

    if (Object.entries(tramite.form.direccion).length === 0) {
      delete tramite.form.direccion;
    }

    console.log('formateado... ', tramite);
  }

  /**
   * Metodo para actualizar datos de tramite de inscripcion
   * @param idTramite id del tramite a actualizar
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto tramite
   */
  async actualizarTramite(
    datosForm: CrearTramiteRegistroUnipersonalDto,
    idTramite: number,
    usuarioAuditoria: string,
  ) {
    const tramite = await this.tramiteRepository.findOne(idTramite);

    if (!tramite) throw new EntityNotFoundException();

    const catalogoTramite = await this.parametricaRepository.findOne(
      tramite.idParametrica,
    );

    if (!catalogoTramite)
      throw new PreconditionFailedException(
        'No se encontro el tramite solicitado',
      );

    const data = {
      // version: catalogoTramite.version,
      codigo: nanoid(),
      // idCatalogoTramite: catalogoTramite.id,
      idUsuarioPropietario: usuarioAuditoria,
    };

    console.log('datos para actualizar ==================', data);

    try {
      const tramiteActualizado =
        await this.tramiteGenericoService.actualizarCabeceraTramite(
          data,
          idTramite,
        );
      // console.log('------------', tramiteActualizado);

      // actualizar datos de paso 1
      const detalles = [];
      if (datosForm.tipoUnidadEconomica) {
        const item = {
          campo: 'cod_tipo_unidad_economica',
          valor: datosForm.tipoUnidadEconomica,
        };
        detalles.push(item);
      }
      if (datosForm.actividadPrincipal || datosForm.actividadesSecundarias) {
        const valor = {
          actividadPrincipal: datosForm.actividadPrincipal,
          actividadesSecundarias: datosForm.actividadesSecundarias,
        };
        const item = {
          campo: 'cod_actividad',
          valorComplejo: valor,
        };
        detalles.push(item);
      }
      if (datosForm.razonSocial) {
        const item = {
          campo: 'razon_social',
          valor: datosForm.razonSocial,
        };
        detalles.push(item);
      }
      if (datosForm.tipoRazonSocial) {
        const item = {
          campo: 'cod_tipo_razon_social',
          valor: datosForm.tipoRazonSocial,
        };
        detalles.push(item);
      }
      if (datosForm.objetoSocial) {
        const item = {
          campo: 'objeto_social',
          valor: datosForm.objetoSocial,
        };
        detalles.push(item);
      }
      if (datosForm.capital) {
        const item = {
          campo: 'capital_social',
          valor: datosForm.capital,
        };
        detalles.push(item);
      }

      detalles.map((d) => {
        d.idTramite = idTramite;
        d.usuarioAuditoria = usuarioAuditoria;
        return d;
      });

      console.log(detalles);

      for await (const item of detalles) {
        console.log('actualizando item', item);
        try {
          await this.tramiteDetalleRepository.actualizarValorPorCampoTramite(
            item,
          );
        } catch (error) {
          console.log('Sucedió un error... ', error);
          throw new PreconditionFailedException(
            `No se pudo actualizar el valor de ${item.campo}`,
          );
        }
      }

      return this.construirRespuestaCrearTramite(
        tramiteActualizado,
        catalogoTramite,
        datosForm,
      );
    } catch (error) {
      console.log('------------------', error);
      throw new Error('sucedió un problema al actualizar datos de tramite');
    }
  }

  /**
   * Metodo para actualizar datos de contacto en tramite de inscripcion
   * @param datosForm datos de persona y contacto
   * @param idTramite identificador del tramite en base de datos
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto tramite
   */
  async actualizarDatosContacto(
    datosForm: personaTramiteRegistroUnipersonalDto,
    idTramite: number,
    usuarioAuditoria: string,
  ) {
    const tramite = await this.tramiteRepository.findOne(idTramite);

    if (!tramite) throw new EntityNotFoundException();

    const catalogoTramite = await this.parametricaRepository.findOne(
      tramite.idParametrica,
    );

    if (!catalogoTramite)
      throw new PreconditionFailedException(
        'No se encontro el tramite solicitado',
      );

    // Actualizar datos de paso 2 - contactos
    if (datosForm.contacto) {
      const detalles = [];
      // const valor = {
      //   celular: datosForm.contacto.celular ?? null,
      //   telefonoFijo: datosForm.contacto.telefonoFijo ?? null,
      //   correo: datosForm.contacto.correo ?? null,
      // };
      // if (datosForm.contacto.celular) {
      //   valor.celular = datosForm.contacto.celular;
      // }
      // if (datosForm.contacto.telefonoFijo) {
      //   valor.telefonoFijo = datosForm.contacto.telefonoFijo;
      // }
      // if (datosForm.contacto.correo) {
      //   valor.correo = datosForm.contacto.correo;
      // }

      detalles.push({
        campo: 'canales',
        valorComplejo: datosForm.contacto,
        idTramite: tramite.id,
        usuarioAuditoria,
      });

      console.log(detalles);

      for await (const item of detalles) {
        console.log('actualizando item', item);
        try {
          await this.tramiteDetalleRepository.actualizarValorPorCampoTramite(
            item,
          );
        } catch (error) {
          console.log('Sucedió un error... ', error);
          throw new PreconditionFailedException(
            'No se pudo actualizar la información de contacto',
          );
        }
      }
    }

    return this.construirRespuestaCrearTramite(
      tramite,
      catalogoTramite,
      datosForm,
    );
  }

  /**
   * Metodo para actualizar datos de direción de tramite de inscripcion
   * @param datosForm datos de direccion y contacto
   * @param idTramite identificador del tramite en base de datos
   * @param usuarioAuditoria usuario que ejecuta la accion
   * @returns objeto tramite
   */
  async actualizarDatosDireccionContacto(
    datosForm: direccionTramiteRegistroUnipersonalDto,
    idTramite: number,
    usuarioAuditoria: string,
  ) {
    const tramite = await this.tramiteRepository.findOne(idTramite);

    if (!tramite) throw new EntityNotFoundException();

    const catalogoTramite = await this.parametricaRepository.findOne(
      tramite.idParametrica,
    );

    if (!catalogoTramite)
      throw new PreconditionFailedException(
        'No se encontro el tramite solicitado',
      );

    // Actualizar datos de paso 3 - direccion y contacto de direccion
    const detallesDireccion = [];
    if (datosForm.idDepartamento) {
      detallesDireccion.push({
        campo: 'cod_departamento',
        valor: datosForm.idDepartamento,
      });
    }
    if (datosForm.idProvincia) {
      detallesDireccion.push({
        campo: 'cod_provincia',
        valor: datosForm.idProvincia,
      });
    }
    if (datosForm.idMunicipio) {
      detallesDireccion.push({
        campo: 'cod_municipio',
        valor: datosForm.idMunicipio,
      });
    }
    if (datosForm.tipoDivision) {
      detallesDireccion.push({
        campo: 'cod_tipo_subdivision_geografica',
        valor: datosForm.tipoDivision,
      });
    }
    if (datosForm.nombreDivision) {
      detallesDireccion.push({
        campo: 'nombre_subdivision_geografica',
        valor: datosForm.nombreDivision,
      });
    }
    if (datosForm.tipoVia) {
      detallesDireccion.push({
        campo: 'cod_tipo_via',
        valor: datosForm.tipoVia,
      });
    }
    if (datosForm.nombreVia) {
      detallesDireccion.push({
        campo: 'nombre_via',
        valor: datosForm.nombreVia,
      });
    }
    if (datosForm.direccionReferencial) {
      detallesDireccion.push({
        campo: 'direccion_referencial',
        valor: datosForm.direccionReferencial,
      });
    }
    if (datosForm.numeroDomicilio) {
      detallesDireccion.push({
        campo: 'numero_domicilio',
        valor: datosForm.numeroDomicilio,
      });
    }
    if (datosForm.edificio) {
      detallesDireccion.push({
        campo: 'edificio',
        valor: datosForm.edificio,
      });
    }
    if (datosForm.piso) {
      detallesDireccion.push({
        campo: 'piso',
        valor: datosForm.piso,
      });
    }
    if (datosForm.tipoAmbiente) {
      detallesDireccion.push({
        campo: 'cod_tipo_ambiente',
        valor: datosForm.tipoAmbiente,
      });
    }
    if (datosForm.numeroAmbiente) {
      detallesDireccion.push({
        campo: 'numero_nombre_ambiente',
        valor: datosForm.numeroAmbiente,
      });
    }
    if (datosForm.position) {
      if (datosForm.position.lat) {
        detallesDireccion.push({
          campo: 'latitud',
          valor: String(datosForm.position.lat),
        });
      }
      if (datosForm.position.lng) {
        detallesDireccion.push({
          campo: 'longitud',
          valor: String(datosForm.position.lng),
        });
      }
    }

    detallesDireccion.map((d) => {
      d.idTramite = tramite.id;
      d.usuarioAuditoria = usuarioAuditoria;
      return d;
    });

    // console.log(detallesDireccion);

    // contacto de direccion
    const detallesContacto = [];
    const valor = {
      correoElectronico: datosForm.correoElectronico ?? null,
      telefono1: datosForm.telefono1 ?? null,
      telefono2: datosForm.telefono2 ?? null,
      telefono3: datosForm.telefono3 ?? null,
    };

    // if (datosForm.correoElectronico) {
    //   valor.correoElectronico = datosForm.correoElectronico;
    // }
    // if (datosForm.telefono1) {
    //   valor.telefono1 = datosForm.telefono1;
    // }
    // if (datosForm.telefono2) {
    //   valor.telefono2 = datosForm.telefono2;
    // }
    // if (datosForm.telefono3) {
    //   valor.telefono3 = datosForm.telefono3;
    // }

    detallesContacto.push({
      campo: 'contacto_descripcion',
      valorComplejo: valor,
      idTramite: tramite.id,
      usuarioAuditoria,
    });

    // console.log(detallesContacto);

    const detalles = detallesDireccion.concat(detallesContacto);
    console.log(detalles);

    for await (const item of detalles) {
      console.log('actualizando item', item);
      try {
        await this.tramiteDetalleRepository.actualizarValorPorCampoTramite(
          item,
        );
      } catch (error) {
        console.log('Sucedió un error... ', error);
        throw new PreconditionFailedException(
          `No se pudo actualizar la información de ${item.campo}`,
        );
      }
    }

    return this.construirRespuestaCrearTramite(
      tramite,
      catalogoTramite,
      datosForm,
    );
  }

  /**
   * Metodo para construir la respuesta de crear tramite
   * @param tramite Objeto con los valores de un tramite
   * @param catalogoTramite Objeto catalogo tramite (grupo->seccion->campo)
   * @param datos Objeto con los datos del formulario
   * @returns Objeto (tramite)
   */
  construirRespuestaCrearTramite(
    tramite: any,
    catalogoTramite: Parametrica,
    datos: any,
  ) {
    const result: any = {};
    result.id = tramite.id;
    result.codigo = tramite.codigo;
    result.nombreTramite = catalogoTramite.nombre;
    result.api = catalogoTramite.api;
    result.estado = tramite.estado;
    result.datos = datos;
    return result;
  }

  async obtenerDocByTramite(id: number) {
    const doc =
      await this.tramiteDocumentoSoporteRepository.obtenerDocByTramite(id);
    if (!doc) {
      return null;
    }
    return doc;
  }

  async cambiarEstadoDocSoporte(
    usuarioAuditoria: any,
    id: number,
    estado: any,
  ) {
    const result = await this.tramiteDocumentoSoporteRepository.update(
      { id },
      {
        usuarioActualizacion: usuarioAuditoria,
        estado,
      },
    );
    return result;
  }
}
