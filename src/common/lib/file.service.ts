import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  // eslint-disable-next-line max-params
  guardar(archivo: string, ruta: string, nombre?: string, isBase64 = true) {
    if (!nombre) nombre = `FILE_${Date.now()}`;
    if (!fs.existsSync(ruta)) {
      fs.mkdirSync(ruta);
    }
    let buffer;
    if (isBase64) buffer = Buffer.from(archivo, 'base64');
    const pathFile = path.resolve(ruta, nombre);
    fs.writeFileSync(pathFile, isBase64 ? buffer : archivo);
    return isBase64 ? pathFile : nombre;
  }

  async buscarDocumento(ruta: string) {
    try {
      await fs.promises.access(ruta);
      return {
        existe: true,
        ruta: path.resolve(ruta),
      };
    } catch {
      return {
        existe: false,
      };
    }
  }
}
