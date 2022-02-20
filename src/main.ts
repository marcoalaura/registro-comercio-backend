import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
import { Logger } from 'nestjs-pino';
import { expressMiddleware } from 'cls-rtracer';
import * as soap from 'soap';
import * as fs from 'fs';

import { Session } from './core/authentication/entity/session.entity';
import { ServiciosIopService } from './application/servicios-iop/soap/servicios-soap.service';

import {
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_ROOT,
} from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: true });

  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  // swagger
  createSwagger(app);

  // configuration app
  const repository = getConnection().getRepository(Session);
  app.use(expressMiddleware());

  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'base.connect.sid',
      cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
      },
      store: new TypeormStore({ repository, expirationInterval: 3600000 }), //ms
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(helmet.hidePoweredBy());
  app.use(helmet());
  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN'));
  const port = configService.get('PORT');

  const xml = fs.readFileSync('xml/webServiceRCB.wsdl', 'utf8');
  // const xml = fs.readFileSync('xml/service.wsdl', 'utf8');
  const serviciosIopService = app.get(ServiciosIopService);

  await app.listen(port, () => {
    const wsdlPath = `/${process.env.WSDL_PATH}`;
    const serviceObject = serviciosIopService.serviciosIop();
    soap.listen(app.getHttpServer(), wsdlPath, serviceObject, xml);
    console.log(`SERVICIOS SOAP IOP: http://localhost:${port}${wsdlPath}?wsdl`);
  });
  console.log(
    `APLICACIÓN INICIADA EN EL PUERTO: ${port} Y SUBDOMINIO: /${configService.get(
      'PATH_SUBDOMAIN',
    )}`,
  );
}

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
}
bootstrap();
