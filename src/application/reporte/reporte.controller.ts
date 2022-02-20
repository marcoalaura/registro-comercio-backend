import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';
import { AbstractController } from '../../common/dto/abstract-controller.dto';
import { tipoArchivo } from '../../common/lib/tipoArchivo.module';
import { ReporteService } from './reporte.service';

@Controller('reporte')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ReporteController extends AbstractController {
  static staticLogger: PinoLogger;

  constructor(
    private reporteService: ReporteService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }

  @Get('generar/:tipo')
  @HttpCode(HttpStatus.OK)
  async generar(@Res() res: Response, @Param('tipo') tipo: string) {
    const nombreArchivo = `reporte${tipo}.pdf`;
    const plantillaHtml = 'src/templates/default.html';
    const rutaGuardadoPdf = `${process.env.PDF_PATH}${nombreArchivo}`;
    const configPagina = {
      pageSize: 'Letter',
      orientation: 'portrait',
      marginLeft: '0.5cm',
      marginRight: '0.5cm',
      marginTop: '0.5cm',
      marginBottom: '0.5cm',
      output: rutaGuardadoPdf,
    };
    const parametros = {
      titulo: `Pagina de Prueba ${tipo}`,
    };
    await this.reporteService.generar(
      plantillaHtml,
      parametros,
      rutaGuardadoPdf,
      configPagina,
    );

    if (tipo === 'base64') {
      const resultado = await this.reporteService.descargarBase64(
        rutaGuardadoPdf,
      );
      res.status(HttpStatus.OK).json({ data: resultado });
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${nombreArchivo}`,
      );
      res.download(rutaGuardadoPdf);
    }
  }

  // eslint-disable-next-line max-params
  // @Get('matricula/:tipoMatricula/empresa/:idEmpresa')
  // @HttpCode(HttpStatus.OK)
  // async certificado(
  //   @Res() res: Response,
  //   @Param('tipoMatricula') tipoMatricula: string,
  //   @Param('idEmpresa') idEmpresa: number,
  //   @Query('tipo') tipo: string,
  // ) {
  //   const { rutaGuardadoPdf, nombreArchivo } =
  //     await this.reporteService.generarMatricula(idEmpresa, tipoMatricula);

  //   if (tipo === 'base64') {
  //     const resultado = await this.reporteService.descargarBase64(
  //       rutaGuardadoPdf,
  //     );
  //     res.status(HttpStatus.OK).json({ data: resultado });
  //   } else {
  //     res.setHeader('Content-Type', 'application/pdf');
  //     res.setHeader(
  //       'Content-Disposition',
  //       `attachment; filename=${nombreArchivo}`,
  //     );
  //     res.download(rutaGuardadoPdf);
  //   }
  // }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('matricula/:idEmpresa')
  async obtenerDatosEmpresa(
    @Param('idEmpresa') idEmpresa: number,
    @Res() res: Response,
    @Req() req,
  ) {
    const result = await this.reporteService.obtenerDatosEmpresa(idEmpresa);
    this.logger.info(
      `El usuario id ${this.getUser(req)} generó el pdf de matricula.`,
    );
    const format = 'pdf';
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="matricula.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }
}
