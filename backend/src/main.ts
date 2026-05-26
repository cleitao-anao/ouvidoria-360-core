import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ouvidoria 360 - API Core')
    .setDescription(
      'Documentação da API centralizada para gestão de ouvidoria (Jira/GitHub)',
    )
    .setVersion('1.0')
    .addTag('webhooks')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 Backend rodando em: http://localhost:${port}`);
  console.log(`📖 Documentação disponível em: http://localhost:${port}/api`);
}
bootstrap();
