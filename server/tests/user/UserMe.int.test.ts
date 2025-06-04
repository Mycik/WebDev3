import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { MeController } from '../../src/user/controllers/UserControllers';

jest.mock('../../src/shared/jwt', () => ({
  verifyAccess: jest.fn(() => ({ id: '1' })),
}));

jest.mock('../../src/user/models/UserModel', () => ({
  __esModule: true,
  default: {
    findByPk: jest.fn(() => ({ id: '1', email: 'test@example.com' })),
  },
}));

describe('MeController', () => {
  const app = express();
  app.use(cookieParser());
  app.get('/me', MeController);

  it('should return user data when authenticated', async () => {
    const res = await request(app)
      .get('/me')
      .set('Cookie', ['accessToken=fake-token']);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should return 401 if token is missing', async () => {
    const res = await request(app).get('/me');
    expect(res.status).toBe(401);
  });
});
