import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhooksController } from './webhooks/webhooks.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carrega o .env
    HttpModule, // Permite que o Nest envie mensagens para o Discord
  ],
  controllers: [AppController, WebhooksController],
  providers: [AppService],
})
export class AppModule {}
