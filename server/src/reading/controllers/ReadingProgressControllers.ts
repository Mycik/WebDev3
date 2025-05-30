import { RequestHandler } from "express";
import Joi from "joi";
import {
  createReadingProgress,
  CreateReadingProgressDTO,
  deleteReadingProgress,
  listReadingProgressByUser,
  updateReadingProgress,
} from "../services/ReadingServices";

const CreateSchema = Joi.object<CreateReadingProgressDTO>({
  user_id: Joi.string().uuid().required(),
  book_id: Joi.string().uuid().required(),
  current_page: Joi.number().integer().min(0).required(),
});

const UpdateSchema = Joi.object({
  current_page: Joi.number().integer().min(0).optional(),
}).min(1);

export const AddProgressController: RequestHandler = async (req, res) => {
  const { error, value } = CreateSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }
  try {
    const rec = await createReadingProgress(value);
    res.status(201).json(rec);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const GetProgressByUserController: RequestHandler = async (req, res) => {
  try {
    const list = await listReadingProgressByUser(req.params.userId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const EditProgressController: RequestHandler = async (req, res) => {
  const { error, value } = UpdateSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }
  try {
    const updated = await updateReadingProgress(req.params.id, value);
    res.json(updated);
  } catch (err) {
    const msg = (err as Error).message;
    res.status(msg.includes("not found") ? 404 : 500).json({ message: msg });
  }
};

export const DeleteProgressController: RequestHandler = async (req, res) => {
  try {
    await deleteReadingProgress(req.params.id);
    res.status(204).send();
  } catch (err) {
    const msg = (err as Error).message;
    res.status(msg.includes("not found") ? 404 : 500).json({ message: msg });
  }
};
