import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentosEmitidosService } from '../services/documentosEmitidos.service';

import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { FiltrosTramitesDto } from '../dto/filtros-tramites.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@ApiTags('Tramite')
@Controller('documentosEmitidos')
export class DocumentosEmitidosController extends AbstractController {
  constructor(private documentosEmitidosService: DocumentosEmitidosService) {
    super();
  }

  @ApiOperation({ summary: 'Listar tramites por Usuario, Empresa y Estado' })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/:idEmpresa')
  async listarPorUsuarioEmpresa(
    @Req() req,
    @Query() paginacionQueryDto: FiltrosTramitesDto,
    @Param() params,
  ) {
    const usuarioAuditoria = this.getUser(req);
    console.log('usuario id token ', usuarioAuditoria);
    const { idEmpresa } = params;
    const result = await this.documentosEmitidosService.listarPorUsuarioEmpresa(
      paginacionQueryDto,
      usuarioAuditoria,
      idEmpresa,
    );
    return this.successListRows(result);
  }
}
