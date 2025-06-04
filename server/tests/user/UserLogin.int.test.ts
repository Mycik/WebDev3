import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { LoginUserController } from '../../src/user/controllers/UserControllers';

jest.mock('../../src/user/services/UserServices', () => ({
  loginUser: jest.fn(() => ({
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: { id: '1' },
  })),
}));

describe('LoginUserController', () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.post('/login', LoginUserController);

  it('should login and set cookies', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: '123' });

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe('1');
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
