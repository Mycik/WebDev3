import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { LogoutController } from '../../src/user/controllers/UserControllers';

jest.mock('../../src/user/models/RefreshTokenModel', () => ({
  RefreshTokenModel: {
    destroy: jest.fn(),
  },
}));

describe('LogoutController', () => {
  const app = express();
  app.use(cookieParser());
  app.post('/logout', LogoutController);

  it('should clear cookies and respond with status ok', async () => {
    const res = await request(app)
      .post('/logout')
      .set('Cookie', ['refreshToken=fake-refresh-token']);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
