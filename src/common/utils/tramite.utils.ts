import { DocumentoSoporteFields } from '../constants';

/**
 * Metodo para obtener el campo de un documento soporte a patir de un atributo
 * ejem: atributo: certificado_nro_documento -> campo documento soporte: certificado
 * @param atributo atributo del documento soporte
 * @returns Objeto con el valor del campo y atributoEntity
 */
export const obtenerCampoDesdeAtributo = (atributo: string) => {
  const result: any = {};
  if (atributo.includes(DocumentoSoporteFields.NRO_DOCUMENTO)) {
    result.campo = atributo.split(DocumentoSoporteFields.NRO_DOCUMENTO)[0];
    result.atributo = DocumentoSoporteFields.NRO_DOCUMENTO_ENTITY;
  }
  if (atributo.includes(DocumentoSoporteFields.EMISOR)) {
    result.campo = atributo.split(DocumentoSoporteFields.EMISOR)[0];
    result.atributo = DocumentoSoporteFields.EMISOR_ENTITY;
  }
  if (atributo.includes(DocumentoSoporteFields.FECHA_EMSION)) {
    result.campo = atributo.split(DocumentoSoporteFields.FECHA_EMSION)[0];
    result.atributo = DocumentoSoporteFields.FECHA_EMSION_ENTITY;
  }
  return result;
};
