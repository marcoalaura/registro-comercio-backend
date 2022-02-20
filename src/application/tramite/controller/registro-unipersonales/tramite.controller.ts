import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  PreconditionFailedException,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  pdfFileFilter,
  sha256,
} from 'src/common/utils/file-upload.utils';
import { readFileSync } from 'fs';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import {
  CrearTramiteRegistroUnipersonalDto,
  personaTramiteRegistroUnipersonalDto,
  direccionTramiteRegistroUnipersonalDto,
  documentoTramiteRegistroUnipersonalDto,
  cambiarEstadoDocumentoDto,
} from '../../dto/registro-unipersonal/tramite.dto';
import { TramiteRegistroUnipersonalesService } from '../../services/registro-unipersonales/tramite.service';
import { SegipService } from 'src/core/external-services/iop/segip/segip.service';
import { UsuarioService } from 'src/core/usuario/service/usuario.service';
import * as dotenv from 'dotenv';

dotenv.config();

@ApiTags('Tramite Registro Unipersonales')
@Controller('tramites/registro-unipersonales')
export class TramiteRegistroUnipersonalesController extends AbstractController {
  constructor(
    private tramiteService: TramiteRegistroUnipersonalesService,
    private segipService: SegipService,
    private usuarioService: UsuarioService,
  ) {
    super();
  }

  @ApiOperation({ summary: 'Obtener tramite por ID' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id')
  async buscarPorIdTramite(@Param('id') id: number) {
    const result = await this.tramiteService.buscarPorId(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Obtener datos tramite por ID, incluye parametros' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/resumen/:id')
  async buscarPorIdTramiteParametro(@Param('id') id: number) {
    const result = await this.tramiteService.buscarPorIdConParametro(id);
    return this.successList(result);
  }

  @ApiOperation({ summary: 'Crear Tramite' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async crear(
    @Req() req: any,
    @Body() tramiteDto: CrearTramiteRegistroUnipersonalDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('=============================> tramiteDto', tramiteDto);
    const result = await this.tramiteService.crearTramite(
      tramiteDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  @ApiOperation({ summary: 'Guardar datos de persona en tramite' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('datos-persona/:id')
  async agregarDatosPersona(
    @Req() req: any,
    @Param('id') idTramite: number,
    @Body() tramiteDto: personaTramiteRegistroUnipersonalDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('=============================> tramiteDto', tramiteDto);
    // const respuestaSegip = await this.segipService.contrastar(
    //   tramiteDto.persona,
    //   true,
    // );
    // console.log('-------------------', respuestaSegip);
    // if (!respuestaSegip || !respuestaSegip.finalizado) {
    //   throw new PreconditionFailedException(
    //     `Falló la contrastación con SEGIP, ${respuestaSegip.mensaje}`,
    //   );
    // }

    try {
      const respPersona = await this.usuarioService.actualizarDatosPersona(
        tramiteDto.persona,
      );
      console.log('------------', respPersona);
    } catch (error) {
      console.log('sucedió un problema al actualizar datos de persona', error);
    }

    const result = await this.tramiteService.agregarDatosContacto(
      tramiteDto,
      idTramite,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Guardar datos de direccion en tramite' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('datos-direccion/:id')
  async agregarDatosDireccion(
    @Req() req: any,
    @Param('id') idTramite: number,
    @Body() tramiteDto: direccionTramiteRegistroUnipersonalDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('=============================> tramiteDto', tramiteDto);

    const result = await this.tramiteService.agregarDatosDireccionContacto(
      tramiteDto,
      idTramite,
      usuarioAuditoria,
    );

    return this.successUpdate(result);
  }

  // eslint-disable-next-line max-params
  @ApiOperation({ summary: 'Guardar documento soporte de tramite' })
  @UseGuards(JwtAuthGuard)
  @Post('datos-documentos-soporte/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.PATH_TMP_DOC_SOPORTE,
        filename: editFileName,
      }),
      fileFilter: pdfFileFilter,
    }),
  )
  async uploadFile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() datos,
    @Param('id') idTramite: number,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const datosPost = JSON.parse(datos.data);
    const datosDocumento = new documentoTramiteRegistroUnipersonalDto();

    datosDocumento.emisor = datosPost.emisor;
    datosDocumento.fechaEmision = datosPost.fechaEmision;
    datosDocumento.nombreDocumento = file.filename ?? datosPost.nombreDocumento;
    datosDocumento.numeroDocumento = datosPost.numeroDocumento;
    datosDocumento.tipoDocumento = datosPost.tipoDocumento;
    datosDocumento.detalle = datosPost.detalle;

    console.log('Mis datos aqui... ', datosDocumento);
    console.log(idTramite);

    const base64 = readFileSync(file.path).toString('base64');
    const sha = sha256(base64);
    // console.log(file.filename);
    // console.log(file.path);
    // console.log('Mi hash ------------------', sha);

    const datosArchivo = {
      tipoDocumento: file.mimetype,
      hashDocumento: sha,
      ruta: file.path,
    };

    const result = await this.tramiteService.agregarDocumentoSoporte(
      datosDocumento,
      datosArchivo,
      idTramite,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Actualizar datos de tramite' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('/:id')
  async actualizar(
    @Req() req: any,
    @Body() tramiteDto: CrearTramiteRegistroUnipersonalDto,
    @Param('id') idTramite: number,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('=============================> tramiteDto', tramiteDto);
    console.log('=============================> idTramite', idTramite);
    const result = await this.tramiteService.actualizarTramite(
      tramiteDto,
      idTramite,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Actualizar datos de persona en tramite' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Put('datos-persona/:id')
  async actualizarDatosPersona(
    @Req() req: any,
    @Param('id') idTramite: number,
    @Body() tramiteDto: personaTramiteRegistroUnipersonalDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('=============================> tramiteDto', tramiteDto);
    // const respuestaSegip = await this.segipService.contrastar(
    //   tramiteDto.persona,
    //   true,
    // );
    // console.log('-------------------', respuestaSegip);
    // if (!respuestaSegip || !respuestaSegip.finalizado) {
    //   throw new PreconditionFailedException(
    //     `Falló la contrastación con SEGIP, ${respuestaSegip.mensaje}`,
    //   );
    // }

    try {
      const respPersona = await this.usuarioService.actualizarDatosPersona(
        tramiteDto.persona,
      );
      console.log('------------', respPersona);
    } catch (error) {
      console.log('sucedió un problema al actualizar datos de persona', error);
    }

    const result = await this.tramiteService.actualizarDatosContacto(
      tramiteDto,
      idTramite,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiOperation({ summary: 'Actualizar datos de direccion en tramite' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Put('datos-direccion/:id')
  async actualizarDatosDireccion(
    @Req() req: any,
    @Param('id') idTramite: number,
    @Body() tramiteDto: direccionTramiteRegistroUnipersonalDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('=============================> tramiteDto', tramiteDto);

    const result = await this.tramiteService.actualizarDatosDireccionContacto(
      tramiteDto,
      idTramite,
      usuarioAuditoria,
    );

    return this.successUpdate(result);
  }

  // TODO agregar CasbinGuard
  @UseGuards(JwtAuthGuard)
  @Get('datos-documentos-soporte/:id/tramite')
  async obtenerDocByTramite(@Param('id') idTramite: number) {
    const result = await this.tramiteService.obtenerDocByTramite(idTramite);
    return this.successList(result);
  }

  // TODO agregar CasbinGuard
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Patch('/datos-documentos-soporte')
  async cambiarEstadoDocSoporte(
    @Req() req,
    @Body() body: cambiarEstadoDocumentoDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const { id, estado } = body;
    const result = await this.tramiteService.cambiarEstadoDocSoporte(
      usuarioAuditoria,
      id,
      estado,
    );
    return this.successDelete(result);
  }
}
