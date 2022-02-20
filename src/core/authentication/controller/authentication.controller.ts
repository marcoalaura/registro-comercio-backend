import {
  Controller,
  Get,
  Inject,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Issuer } from 'openid-client';
import { CookieService } from '../../../common/lib/cookie.service';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { OidcAuthGuard } from '../guards/oidc-auth.guard';
import { AuthenticationService } from '../service/authentication.service';
import { RefreshTokensService } from '../service/refreshTokens.service';
import { PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

import { OrigenLogin } from '../../../common/constants';

@Controller()
export class AuthenticationController {
  static staticLogger: PinoLogger;

  // eslint-disable-next-line max-params
  constructor(
    private readonly autenticacionService: AuthenticationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly logger: PinoLogger,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AuthenticationController.name);
    AuthenticationController.staticLogger = this.logger;
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req, @Res() res: Response) {
    const result = await this.autenticacionService.autenticar(req.user);
    this.logger.info(`Usuario: ${result.data.id} ingreso al sistema`);
    /* sendRefreshToken(res, result.refresh_token.id); */
    const refreshToken = result.refresh_token.id;
    return res
      .cookie(
        this.configService.get('REFRESH_TOKEN_NAME'),
        refreshToken,
        CookieService.makeConfig(this.configService),
      )
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: result.data });
  }

  @Get('ciudadania-auth')
  async obtenerOrigen(@Request() req, @Res() res: Response) {
    console.log(req.query);
    const { origen } = req.query;
    req.session.origen = null;
    if (origen && origen === OrigenLogin.HABILITACION) {
      req.session.origen = origen;
    }
    if (origen && origen === OrigenLogin.INTERNO) {
      req.session.origen = origen;
    }

    console.log(req.session);
    res.redirect('ciudadania-oauth');
  }

  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-oauth')
  async loginCiudadania() {
    //
  }

  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-callback')
  async loginCiudadaniaCallback(@Request() req, @Res() res: Response) {
    const { origen } = req.session;
    const elOrigen =
      origen === OrigenLogin.HABILITACION
        ? OrigenLogin.HABILITACION
        : OrigenLogin.NORMAL;
    if (req.user) {
      const result = await this.autenticacionService.autenticarOidc(req.user);
      // sendRefreshToken(res, result.refresh_token.id);
      const refreshToken = result.refresh_token.id;

      let redirect = `${this.configService.get('URL_FRONTEND')}/#/login?code=${
        result.data.access_token
      }&origen=${elOrigen}`;
      if (origen === OrigenLogin.INTERNO) {
        redirect = `${this.configService.get(
          'URL_FRONTEND_INTERNO',
        )}/#/login?code=${result.data.access_token}&origen=${elOrigen}`;
      }
      res
        .cookie(
          this.configService.get('REFRESH_TOKEN_NAME'),
          refreshToken,
          CookieService.makeConfig(this.configService),
        )
        .cookie(
          'origen',
          elOrigen,
          CookieService.makeConfigHttpOnlyFalse(this.configService),
        )
        .status(200)
        .redirect(redirect);
    } else {
      res.redirect(this.configService.get('URL_FRONTEND'));
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logoutCiudadania(@Request() req, @Res() res: Response) {
    const { origen } = req.session;
    const jid = req.cookies.jid || '';
    if (jid != '') {
      this.refreshTokensService.removeByid(jid);
    }
    const idToken =
      req.user && req.user.idToken
        ? req.user.idToken
        : req.session && req.session.passport && req.session.passport.user
        ? req.session.passport.user.idToken
        : null;
    // req.logout();
    req.session = null;
    const issuer = await Issuer.discover(this.configService.get('OIDC_ISSUER'));
    const url = issuer.metadata.end_session_endpoint;
    res.clearCookie('connect.sid');
    res.clearCookie('jid', jid);
    const idUsuario = JSON.parse(
      Buffer.from(req.headers.authorization.split('.')[1], 'base64').toString(),
    ).id;
    this.logger.info(`Usuario: ${idUsuario} salio del sistema`);

    if (url && idToken) {
      if (origen === OrigenLogin.INTERNO) {
        return res.status(200).json({
          url: `${url}?post_logout_redirect_uri=${this.configService.get(
            'OIDC_POST_LOGOUT_REDIRECT_URI_INTERNO',
          )}&id_token_hint=${idToken}`,
        });
      }
      return res.status(200).json({
        url: `${url}?post_logout_redirect_uri=${this.configService.get(
          'OIDC_POST_LOGOUT_REDIRECT_URI',
        )}&id_token_hint=${idToken}`,
      });
    } else {
      return res.status(200).json();
    }
  }
}
