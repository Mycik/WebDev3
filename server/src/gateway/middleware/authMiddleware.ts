import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const { JWT_ACCESS_SECRET } = process.env;
if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET must be defined in .env");
}

export interface AuthenticatedRequest extends Request {
  user?: { id: string; [key: string]: any };
}

export function authWithHeader(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7);
  let payload: JwtPayload;
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "secret123"
    ) as JwtPayload;
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  req.user = { id: payload.userId as string, ...payload };

  req.headers["x-user-id"] = String(payload.userId);

  next();
}
