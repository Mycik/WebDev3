import { createUser, loginUser } from '../../src/user/services/UserServices';
import UserModel from '../../src/user/models/UserModel';
import { RefreshTokenModel } from '../../src/user/models/RefreshTokenModel';

jest.mock('../../src/user/models/UserModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../../src/user/models/RefreshTokenModel', () => ({
  RefreshTokenModel: {
    create: jest.fn(),
  },
}));

jest.mock('../../src/shared/jwt', () => ({
  signAccess: jest.fn(() => 'mockAccessToken'),
  signRefresh: jest.fn(() => 'mockRefreshToken'),
}));

describe('UserServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user if email is not taken', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (UserModel.create as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com' });

      const user = await createUser('test@test.com', 'password');
      expect(user.email).toBe('test@test.com');
      expect(UserModel.create).toHaveBeenCalled();
    });

    it('should throw if email already exists', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({ email: 'test@test.com' });
      await expect(createUser('test@test.com', 'password')).rejects.toThrow('User with such email already exists.');
    });
  });

  describe('loginUser', () => {
    it('should login successfully with correct credentials', async () => {
      const fakeUser = { id: '1', email: 'test@test.com', password: 'pass' };
      (UserModel.findOne as jest.Mock).mockResolvedValue(fakeUser);
      (RefreshTokenModel.create as jest.Mock).mockResolvedValue(null);

      const result = await loginUser('test@test.com', 'pass');
      expect(result.accessToken).toBe('mockAccessToken');
      expect(result.user.id).toBe('1');
    });

    it('should throw on invalid password', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com', password: 'wrong' });

      await expect(loginUser('test@test.com', 'pass')).rejects.toThrow('Invalid credentials');
    });
  });
});
