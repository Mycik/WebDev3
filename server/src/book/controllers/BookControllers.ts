import { RequestHandler } from "express";
import Joi from "joi";
import {
  createBook,
  listBooks,
  getBookById,
  updateBook,
  CreateBookDTO,
} from "../services/BookServices";

const BookSchema = Joi.object<CreateBookDTO>({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  description: Joi.string().required(),
  publication_year: Joi.number().integer().min(0).required(),
  file_url: Joi.string().uri().required(),
});

export const AddBookController: RequestHandler = async (req, res) => {
  const { error, value } = BookSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }
  try {
    const book = await createBook(value);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const GetBooksController: RequestHandler = async (_req, res) => {
  try {
    const books = await listBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const GetBookController: RequestHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const EditBookController: RequestHandler = async (req, res) => {
  const { error, value } = BookSchema.fork(
    ["title", "author", "genre", "description", "publication_year", "file_url"],
    (schema) => schema.optional()
  ).validate(req.body);

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  try {
    const updated = await updateBook(req.params.id, value);
    res.json(updated);
  } catch (err) {
    const msg = (err as Error).message;
    res.status(msg === "Book not found" ? 404 : 500).json({ message: msg });
  }
};
