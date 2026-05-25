import { Controller, Post, Req, Res, Headers, HttpStatus } from '@nestjs/common';
// Importação de tipo para satisfazer o 'isolatedModules: true' do seu tsconfig
import type { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as https from 'https';
import { lastValueFrom } from 'rxjs';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // --- WEBHOOK DO GITHUB ---
  @Post('github')
  async handleGitHub(
    @Req() req: Request, 
    @Res() res: Response, 
    @Headers('x-hub-signature-256') signature: string
  ) {
    const secret = this.configService.get<string>('GITHUB_WEBHOOK_SECRET');
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', secret || '');
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    // Validação de Segurança
    if (signature !== digest) {
      console.warn('⚠️ Tentativa de acesso não autorizada no Webhook do GitHub');
      return res.status(HttpStatus.UNAUTHORIZED).send('Erro: Assinatura inválida');
    }

    const repo = req.body.repository?.name || 'Repositório desconhecido';
    const action = req.body.action || 'push/evento';
    const sender = req.body.sender?.login || 'alguém';

    // Monta a mensagem para o Discord
    const message = `🚀 **GitHub Update**\n🔹 Repo: \`${repo}\`\n🔹 Ação: \`${action}\` por **${sender}**`;

    await this.sendToDiscord(message, 'DISCORD_GITHUB_WEB_URL');

    return res.status(HttpStatus.OK).send('GitHub OK');
  }

  // --- WEBHOOK DO JIRA ---
  @Post('jira')
  async handleJira(@Req() req: Request, @Res() res: Response) {
    const token = req.query.token;
    const validToken = this.configService.get<string>('JIRA_WEBHOOK_TOKEN');

    // Validação de Segurança via Query Param
    if (token !== validToken) {
      console.warn('⚠️ Tentativa de acesso não autorizada no Webhook do Jira');
      return res.status(HttpStatus.UNAUTHORIZED).send('Erro: Token inválido');
    }

    const issueKey = req.body.issue?.key || 'Tarefa';
    const summary = req.body.issue?.fields?.summary || 'Sem título';
    const event = req.body.webhookEvent?.replace('jira:', '') || 'updated';

    // Monta a mensagem para o Discord
    const message = `📋 **Jira Board**\n🔹 Tarefa: **${issueKey}**\n🔹 Evento: \`${event}\`\n🔹 Resumo: _${summary}_`;

    await this.sendToDiscord(message, 'DISCORD_JIRA_WEB_URL');

    return res.status(HttpStatus.OK).send('Jira OK');
  }

  // --- FUNÇÃO AUXILIAR PARA ENVIO AO DISCORD ---
  private async sendToDiscord(content: string, envKey: string) {
    const webhookUrl = this.configService.get<string>(envKey);

    if (!webhookUrl) {
      console.error(`❌ Erro: URL do Discord não encontrada para a chave ${envKey} no .env`);
      return;
    }

    try {
      await lastValueFrom(
        this.httpService.post(
          webhookUrl,
          { content },
          {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          },
        ),
      );
      console.log(`✅ Mensagem enviada com sucesso para o canal vinculado a ${envKey}`);
    } catch (err: any) {
      console.error(`❌ Falha ao enviar para o Discord (${envKey}):`, err.message);
    }
  }
}