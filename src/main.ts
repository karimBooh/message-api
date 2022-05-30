import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Messaging')
    .setDescription('Messaging API description')
    .setVersion('1.0')
    .addTag('messaging')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo5LCJuYW1lIjoidG90byIsInBob25lIjoiKzMzNjUxMzI4MTU5IiwiZW1haWwiOiJ0b3RvdEB0b3RvLmZyIn0sInN1YiI6OSwiaWF0IjoxNjUzNzc2Mjk1LCJleHAiOjE2NTQzODEwOTV9.9EwHnz4vjJVFs0snrV33gyMphGcWz1G-scXjuwt30xU
//+33652328158
