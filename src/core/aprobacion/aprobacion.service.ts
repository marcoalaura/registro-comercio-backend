import { Injectable } from '@nestjs/common';
import { AprobacionDocumentosService } from '../external-services/iop/aprobacion/aprobacion.service';
import { UsuarioService } from '../usuario/service/usuario.service';
// import { datosSolicitudAprobacionDTO } from '../external-services/iop/aprobacion/aprobacion.dto';
import { sha256 } from 'src/common/utils/file-upload.utils';
import { readFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AprobacionService {
  constructor(
    private readonly aprobacionDocumentosService: AprobacionDocumentosService,
    private readonly usuarioService: UsuarioService,
  ) {}
  /**
   * @title Aprobación
   * @description Metodo para verificar si la información de una persona coincide con un registro en el SEGIP
   * @param datosPersona Objeto de datos con la información de la persona
   * @param retornarPrimerError Bandera para retornar primer error en contrastacion o retornar todos
   */
  async enviarSolicitud(datosSolicitud: any) {
    try {
      const base64 = readFileSync(datosSolicitud.pathFile).toString('base64');
      const accessToken = await this.usuarioService.obtenerAccessTokenCD(
        datosSolicitud.idUsuario,
      );
      const datosSolicitudIOP = {
        tipoDocumento: 'PDF',
        documento: base64,
        hashDocumento: sha256(base64),
        idTramite: uuidv4(),
        descripcion: `Àprobación del trámite ${datosSolicitud.idTramite}`,
        token: accessToken,
      };
      return await this.aprobacionDocumentosService.solicitar(
        datosSolicitudIOP,
      );
    } catch (error) {
      throw new error();
    }
  }
}
