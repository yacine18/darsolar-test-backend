import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as express from "express"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.use('/uploads',express.static(join(process.cwd(), 'uploads')));
  app.enableCors()
  await app.listen(3001);
}
bootstrap();
