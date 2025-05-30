import { Request, RequestHandler, Response } from "express";

import { createUser, loginUser } from "../services/UserServices";
import { RefreshTokenModel } from "../models/RefreshTokenModel";
import { signAccess, signRefresh, verifyAccess } from "../../shared/jwt";
import UserModel from "../models/UserModel";

export const RegisterUserController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await createUser(email, password);

    const accessToken = signAccess({ id: user.id });
    const refreshToken = signRefresh({ id: user.id });

    await RefreshTokenModel.create({
      userId: user.id,
      token: refreshToken,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send({
      user: { id: user.id },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message,
    });
  }
};

export const LogoutController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await RefreshTokenModel.destroy({
        where: { token: refreshToken },
      });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.send({ status: "ok" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      status: "error",
      message: "Could not log out",
    });
  }
};

export const LoginUserController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send(result);
  } catch (error) {
    const message = (error as Error).message;
    const code = message.includes("credentials") ? 401 : 400;
    res.status(code).json({
      status: "error",
      message,
    });
  }
};

export const MeController = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.accessToken;
    console.log(token);
    if (!token) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const payload = verifyAccess(token) as { id: string };

    const user = await UserModel.findByPk(payload.id, {
      attributes: ["id", "email"],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Error in /me:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
