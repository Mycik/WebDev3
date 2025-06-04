import request from 'supertest';
import { readyApp } from '../../src/user/realApp';
import type { Express } from 'express';

let app: Express;
let email: string;
let password = 'testpass123';

beforeAll(async () => {
  app = await readyApp();

  // Створюємо користувача перед логіном
  email = `akajzafivemin@gmail.com`;

  await request(app)
    .post('/register')
    .send({ email, password });
});

describe('REAL LOGIN TEST', () => {
  it('should login and return tokens', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user).toHaveProperty('id');
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email, password: 'dsfdwfdsfdsfdsf' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
