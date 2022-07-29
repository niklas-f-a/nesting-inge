import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  const PORT = +configService.get('PORT') || 5000;
  await app.listen(PORT);
  console.log(`Server running on: ${await app.getUrl()}`);
}
bootstrap();
