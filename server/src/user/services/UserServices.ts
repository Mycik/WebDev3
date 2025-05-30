import Joi from "joi";
import { Op } from "sequelize";
import { signAccess, signRefresh } from "../../shared/jwt";
import UserModel from "../models/UserModel";
import { RefreshTokenModel } from "../models/RefreshTokenModel";

export const createUser = async (email: string, password: string) => {
  const existingUser = await UserModel.findOne({
    where: {
      [Op.or]: [{ email }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("User with such email already exists.");
    }
  }

  const newUser = await UserModel.create({
    email,
    password,
  });

  return newUser;
};

const LoginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
}).unknown(true);

export const loginUser = async (
  email: string,
  password: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: { id: string };
}> => {
  const { error } = LoginUserSchema.validate({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  const user = await UserModel.findOne({ where: { email } });

  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccess({ id: user.id });
  const refreshToken = signRefresh({ id: user.id });

  await RefreshTokenModel.create({
    userId: user.id,
    token: refreshToken,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id.toString(),
    },
  };
};
