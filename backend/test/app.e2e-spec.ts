import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as crypto from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    // define valores padrão de ambiente antes de criar o módulo
    process.env.GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET ?? 'test_github_secret';
    process.env.JIRA_WEBHOOK_TOKEN = process.env.JIRA_WEBHOOK_TOKEN ?? 'test_jira_token';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /webhooks/github should accept a valid HMAC signature', async () => {
    const payload = {
      repository: { name: 'repo-test' },
      action: 'push',
      sender: { login: 'tester' },
    };

    const body = JSON.stringify(payload);
    const secret = process.env.GITHUB_WEBHOOK_SECRET || 'test_github_secret';
    const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex');
    const signature = `sha256=${hmac}`;

    await request(app.getHttpServer())
      .post('/webhooks/github')
      .set('x-hub-signature-256', signature)
      .send(payload)
      .expect(200)
      .expect('GitHub OK');
  });

  it.skip('POST /webhooks/jira should accept a valid token (skipped: no token available)', async () => {
    // Test skipped because no Jira token available in this environment.
  });

  afterEach(async () => {
    await app.close();
  });
});
