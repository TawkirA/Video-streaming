import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);
  app.use(
    urlencoded({ extended: true })
  );
  app.enableCors();  
  app.use(json());
  
  
  await app.listen(3000);
}
bootstrap();
