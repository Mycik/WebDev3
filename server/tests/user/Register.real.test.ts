import request from 'supertest';
import { readyApp } from '../../src/user/realApp';
import type { Express } from 'express';

let app: Express;

beforeAll(async () => {
  app = await readyApp();
});

describe('REAL REGISTER TEST', () => {
  it('should create user in real database', async () => {
    const email = `real${Date.now()}@example.com`;
    const res = await request(app)
      .post('/register')
      .send({ email, password: 'testpass123' });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
  });
});
