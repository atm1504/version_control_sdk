import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  let app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: "GET,PUT,PATCH,POST,DELETE,OPTIONS",
    maxAge: 63072000,
  });
  const configService = app.get<ConfigService>(ConfigService); await app.listen(4000);
}
bootstrap();
