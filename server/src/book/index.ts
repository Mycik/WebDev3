import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { sequelize } from "../shared/database";
import { authWithHeader } from "../gateway/middleware/authMiddleware";
import {
  AddBookController,
  EditBookController,
  GetBookController,
  GetBooksController,
} from "./controllers/BookControllers";
import cookieParser from "cookie-parser";
import BookModel from "./models/BookModel";
import { v4 as uuidv4 } from "uuid";

const randomBooks = [
  {
    id: uuidv4(),
    title: "Тигролови",
    author: "Іван Багряний",
    genre: "Пригоди",
    description: "Роман про боротьбу за волю та втечу з радянського полону.",
    publication_year: 1944,
    file_url: "https://youtube.com/",
    pagesCount: 320,
    image_url:
      "https://ridna-mova.com/image/cache/catalog/vidomitanezvidani/tygrolovy-1500x2250.png",
    created_at: new Date(),
  },
  {
    id: uuidv4(),
    title: "Залишенець. Чорний ворон",
    author: "Василь Шкляр",
    genre: "Історичний роман",
    description: "Героїчна боротьба українських повстанців у 1920-х роках.",
    publication_year: 2009,
    file_url: "https://youtube.com/",
    pagesCount: 368,
    image_url: "https://historybooks.com.ua/PicPod/zal.jpg",
    created_at: new Date(),
  },
  {
    id: uuidv4(),
    title: "Не озирайся і мовчи",
    author: "Макс Кідрук",
    genre: "Трилер",
    description:
      "Напружений психологічний трилер про юну дівчину, яка стає мимовільною учасницею небезпечної гри.",
    publication_year: 2017,
    file_url: "https://youtube.com/",
    pagesCount: 400,
    image_url:
      "https://textbook.com.ua/covers/568495324/ne-ozyraysya-i-movchy-cover.jpeg",
    created_at: new Date(),
  },
];

dotenv.config();

(async () => {
  const app = express();
  const port = process.env.BOOK_SERVICE_PORT || 8082;

  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const books = await BookModel.count();

  if (books === 0) {
    console.log("No books found, seeding initial data...");
    await BookModel.bulkCreate(randomBooks);
    console.log("Books seeded successfully");
  }

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.post("/", authWithHeader, AddBookController);
  app.get("/", GetBooksController);
  app.get("/:id", GetBookController);
  app.put("/:id", authWithHeader, EditBookController);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
