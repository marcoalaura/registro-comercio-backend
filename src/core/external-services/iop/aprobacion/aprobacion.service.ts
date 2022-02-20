import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ExternalServiceException } from '../../../../common/exceptions/external-service.exception';
// import { datosSolicitudAprobacionIOPDTO } from './aprobacion.dto';

@Injectable()
export class AprobacionDocumentosService {
  constructor(private http: HttpService) {}

  /**
   * @title Aprobación
   * @description Metodo para verificar si la información de una persona coincide con un registro en el SEGIP
   * @param datosPersona Objeto de datos con la información de la persona
   * @param retornarPrimerError Bandera para retornar primer error en contrastacion o retornar todos
   */
  async solicitar(datosSolicitud: any) {
    try {
      const respuesta = await this.http
        .post('/v1/aprobaciones', datosSolicitud)
        .pipe(map((response) => response.data))
        .toPromise();
      return respuesta;
    } catch (error) {
      throw new ExternalServiceException('SEGIP:CONTRASTACION', error);
    }
  }
}
