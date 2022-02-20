import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';

import { TramiteGenericoService } from '../services/tramite-generico/tramite-generico.service';
import { TramiteGenericoCamposService } from '../services/tramite-generico/tramite-generico-campos.service';

import {
  editFileName,
  pdfFileFilter,
} from '../../../common/utils/file-upload.utils';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';

@ApiTags('Tramite')
@Controller('tramites')
export class TramiteGenericoController extends AbstractController {
  constructor(
    private tramiteGenericoService: TramiteGenericoService,
    private tramiteGenericoCamposService: TramiteGenericoCamposService,
  ) {
    super();
  }
  @Get(':idTramite/genericos')
  async consultaCatalogoTramite(@Param('idTramite') idTramite: string) {
    const result =
      await this.tramiteGenericoService.consultarTramiteCatalogoTramite(
        Number(idTramite),
      );
    return this.successList(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('genericos/:idCatalogoTramite')
  async crearSolicitudTramite(
    @Param('idCatalogoTramite') idCatalogoTramite: string,
    @Body() body: any,
    @Req() req,
  ) {
    const idEmpresa = 1;
    const { idEstablecimiento } = body;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.tramiteGenericoService.crearTramite({
      idEmpresa,
      idEstablecimiento,
      idCatalogoTramite: Number(idCatalogoTramite),
      usuarioAuditoria,
    });
    return this.successCreate(result);
  }

  // eslint-disable-next-line max-params
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: process.env.DOCUMENTOS_SOPORTE_DEST,
        filename: editFileName,
      }),
      fileFilter: pdfFileFilter,
    }),
  )
  @Post('/:idTramite/genericos')
  // @UseInterceptors(AnyFilesInterceptor())
  async guardarCampos(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('idTramite') idTramite: string,
    @Query('secciones') secciones: string,
    @Body() body,
  ) {
    let seccion = [];
    if (secciones) {
      seccion = secciones.split(',');
    }
    const usuarioAuditoria = '1';
    const result =
      await this.tramiteGenericoCamposService.procesarRegistroCampos(
        Number(idTramite),
        { data: body, files, usuarioAuditoria },
        seccion,
      );
    return this.successUpdate(result);
  }

  @ApiOperation({
    summary: 'Obtener los datos de la empresa para un tramite de edicion',
  })
  // @UseGuards(JwtAuthGuard)
  @Get('/:idTramite/datosEmpresa')
  async recuperarInformacionEmpresa(@Param('idTramite') idTramite: string) {
    const result =
      await this.tramiteGenericoService.obtenerDatosTramiteActuales(
        Number(idTramite),
      );
    return this.successList(result);
  }
}
