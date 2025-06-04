// tests/user/UserRoutes.int.test.ts
import request from 'supertest';
import app from '../../src/user/testApp';

jest.mock('../../src/user/services/UserServices', () => ({
  createUser: jest.fn((email, password) => ({ id: '1', email, password })),
}));

jest.mock('../../src/user/models/RefreshTokenModel', () => ({
  RefreshTokenModel: {
    create: jest.fn(),
  },
}));

jest.mock('../../src/shared/jwt', () => ({
  signAccess: jest.fn(() => 'access-token'),
  signRefresh: jest.fn(() => 'refresh-token'),
}));

describe('POST /register', () => {
  it('should register a new user and set cookie', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: '123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user.id');
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
