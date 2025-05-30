import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { sequelize } from "../shared/database";
import {
  AddProgressController,
  DeleteProgressController,
  EditProgressController,
  GetProgressByUserController,
} from "./controllers/ReadingProgressControllers";
import cookieParser from "cookie-parser";

dotenv.config();

(async () => {
  const app = express();
  const port = process.env.READING_SERVICE_PORT || 8083;

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

  app.post("/", AddProgressController);
  app.get("/:userId", GetProgressByUserController);
  app.put("/:id", EditProgressController);
  app.delete("/:id", DeleteProgressController);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
