import express from 'express';
import cookieParser from 'cookie-parser';
import { RegisterUserController } from './controllers/UserControllers';
import { sequelize } from '../shared/database';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/login', RegisterUserController);

export const readyApp = async () => {
  await sequelize.sync();
  return app;
};