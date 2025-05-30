import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize } from "../shared/database";
import {
  LoginUserController,
  LogoutController,
  MeController,
  RegisterUserController,
} from "./controllers/UserControllers";

dotenv.config();

(async () => {
  const app = express();
  const port = process.env.USER_SERVICE_PORT || 8081;

  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.post("/register", RegisterUserController);
  app.post("/login", LoginUserController);
  app.post("/logout", LogoutController);
  app.get("/me", MeController);

  app.listen(port, () => {
    console.log(`User service running on http://localhost:${port}`);
  });
})();
