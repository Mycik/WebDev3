import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

(async () => {
  const app = express();
  const port = process.env.GATEWAY_SERVICE_PORT || 8080;

  app.use(morgan("tiny"));
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(
    "/users",
    createProxyMiddleware({
      target: `http://localhost:${process.env.USER_SERVICE_PORT}`,
      changeOrigin: true,
      pathRewrite: {
        "^/users": "",
      },
    })
  );
  app.use(
    "/books",
    createProxyMiddleware({
      target: `http://localhost:${process.env.BOOK_SERVICE_PORT}`,
      changeOrigin: true,
      pathRewrite: {
        "^/books": "",
      },
    })
  );
  app.use(
    "/reading",
    createProxyMiddleware({
      target: `http://localhost:${process.env.READING_SERVICE_PORT}`,
      changeOrigin: true,
      pathRewrite: {
        "^/reading": "",
      },
    })
  );

  app.use(express.json());

  app.listen(port, () => {
    console.log(`Gateway running on http://localhost:${port}`);
  });
})();
