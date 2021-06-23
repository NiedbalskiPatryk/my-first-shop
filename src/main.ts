import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { IamTeapotExceptionFilter } from './filters/i-am-teapot-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     disableErrorMessages: true,
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );
  // app.useGlobalFilters(new IamTeapotExceptionFilter());
  // app.useGlobalFilters(new GlobalExceptionFilter());
  // (app as NestExpressApplication).use(helmet());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
