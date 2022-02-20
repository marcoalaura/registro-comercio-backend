// swagger config
export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_API_NAME = 'Proyecto base';
export const SWAGGER_API_DESCRIPTION = 'Documentación de proyecto base';
export const SWAGGER_API_CURRENT_VERSION = '1.0';

export enum Status {
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO',
  CREATE = 'CREADO',
  PENDING = 'PENDIENTE',
  CANCEL = 'CANCELADO',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum TipoDocumento {
  CI = 'CI',
  PASAPORTE = 'PASAPORTE',
  OTRO = 'OTRO',
}

export enum Genero {
  M = 'M',
  F = 'F',
  OTRO = 'OTRO',
}

export const TRAMITE_ACTUALIZACION_MATRICULA = 1;

export enum TramiteParametricaTipo {
  EN_LINEA = 'EN_LINEA',
  SEMI_LINEA = 'SEMI_LINEA',
  PRESENCIAL = 'PRESENCIAL',
}

export enum TramiteParametricaTipoCatalogo {
  TRAMITE = 'TRAMITE',
  PUBLICACION = 'PUBLICACION',
}

export enum TramiteEstado {
  SOLICITUD = 'SOLICITUD',
  FINALIZADO = 'FINALIZADO',
  ACEPTADO = 'ACEPTADO',
  PAGADO = 'PAGADO',
  ASIGNADO = 'ASIGNADO',
  REVISION = 'REVISION',
  CONCLUIDO = 'CONCLUIDO',
  APROBADO = 'APROBADO',
  INSCRITO = 'INSCRITO',
  ANULADO = 'ANULADO',
  REINGRESADO = 'REINGRESADO',
  OBSERVADO = 'OBSERVADO',
  ELIMINADO = 'ELIMINADO',
  EN_CURSO = 'EN_CURSO',
  CONFIRMADO = 'CONFIRMADO',
  PUBLICADO = 'PUBLICADO',
  APROBANDO = 'APROBANDO',
  PRESENTADO = 'PRESENTADO',
}

export const TipoTramite = {
  TRAMITE: 1,
  PUBLICACION: 2,
};

export enum TramiteAcciones {
  PAGO_SOLICITADO = 'PAGO SOLICITADO',
  FACTURA_SOLICITADA = 'FACTURA SOLICITADA',
  FACTURA_ANULACION = 'EN ANULACION FACTURA',
  FACTURA_EMITIDA = 'FACTURA EMITIDA',
  FACTURA_ANULADA = 'FACTURA ANULADA',
}

export enum ObservacionEstado {
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO',
}

export const CATALOGO_TRAMITE_CAMPO = 'campo';
export const CAMPO_TIPO_ARCHIVO = 'file';

export const DOCUMENTO_SOPORTE_FIELD_NAME = 'fieldname';

export const DocumentoSoporteFields = {
  NRO_DOCUMENTO: '_nro_documento',
  EMISOR: '_emisor',
  FECHA_EMSION: '_fecha_emision',
  NRO_DOCUMENTO_ENTITY: 'nroDocumento',
  EMISOR_ENTITY: 'emisor',
  FECHA_EMSION_ENTITY: 'fechaEmision',
};

export const ParametrosFacturacion = {
  MUNICIPIO: 'LA PAZ',
  DEPARTAMENTO: 'LA PAZ',
  TELEFONO_CONTACTO: '22112211',
  CODIGO_SUCURSAL: 0,
  PUNTO_VENTA: 1,
  DOCUMENTO_SECTOR: 1,
  FORMATO_FACTURA: 'pagina',
  CORREO_CONTACTO: 'seprec.test@agetic.gob.bo',
  ACTIVIDAD_ECONOMICA: '841121',
  CODIGO_SIN: '91111',
};

export const GruposParametros = {
  TIPO_SOCIETARIO: 'C03_tipo_societario',
  DEPARTAMENTO: 'C08_departamentos',
  PROVINCIA: 'C09_provincias',
  MUNICIPIO: 'C10_municipios',
  TIPO_DOCUMENTO_ID: 'C15_tipo_documento_id',
  TIPO_SUBDIVISION_GEOGRAFICA: 'C102_subdivision_geografica',
  TIPO_VIA: 'C103_tipo_via',
  TIPO_AMBIENTE: 'C104_tipo_ambiente',
  TIPO_RAZON_SOCIAL: 'CA200_tipo_razon_social',
};

export const OrigenLogin = {
  HABILITACION: 'habilitacion',
  NORMAL: 'normal',
  INTERNO: 'interno',
};

export const FormatoRespuestaFUNDEMPRESA = {
  rutina: 'VRCONAG',
  sinCantidadPorDefecto: '0000',
  registroEncontrado: '0000',
  registroNoEncontrado: '0001',
};

export const RUTA_LOGO = './src/templates/logo.png';

export const RUTA_REPORTES = '/tmp/';
export const MAX_SIZE_LOGO = 700000;

export const CLASIFICADOR_ACTIVO = 'CAEB';

export enum TipoContacto {
  TELEFONO = 'TELEFONO',
  CORREO = 'CORREO',
}
