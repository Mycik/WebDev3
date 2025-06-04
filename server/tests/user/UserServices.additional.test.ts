import { loginUser } from '../../src/user/services/UserServices';
import UserModel from '../../src/user/models/UserModel';

jest.mock('../../src/user/models/UserModel', () => ({
  findOne: jest.fn(),
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

describe('UserServices Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser - validation and missing user', () => {
    it('should throw if email is invalid', async () => {
      await expect(loginUser('not-an-email', 'password')).rejects.toThrow();
    });

    it('should throw if password is empty', async () => {
      await expect(loginUser('test@test.com', '')).rejects.toThrow();
    });

    it('should throw if user does not exist', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      await expect(loginUser('test@test.com', 'pass')).rejects.toThrow('Invalid credentials');
    });
  });
});
