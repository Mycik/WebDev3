import express from 'express';
import cookieParser from 'cookie-parser';
import { RegisterUserController } from './controllers/UserControllers';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/register', RegisterUserController);

export default app;
