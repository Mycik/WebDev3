import ReadingProgressModel, {
  ReadingProgressAttributes,
} from "../models/ReadingProgressModel";

export interface CreateReadingProgressDTO {
  user_id: string;
  book_id: string;
  current_page: number;
}

export const createReadingProgress = async (
  data: CreateReadingProgressDTO
): Promise<ReadingProgressModel> => {
  return await ReadingProgressModel.create(data);
};

export const listReadingProgressByUser = async (
  userId: string
): Promise<ReadingProgressModel[]> => {
  return await ReadingProgressModel.findAll({
    where: { user_id: userId },
    order: [["updated_at", "DESC"]],
  });
};

export const updateReadingProgress = async (
  id: string,
  updates: Partial<Pick<ReadingProgressAttributes, "current_page">>
): Promise<ReadingProgressModel> => {
  const rec = await ReadingProgressModel.findByPk(id);
  if (!rec) throw new Error("Reading progress record not found");
  return await rec.update(updates);
};

export const deleteReadingProgress = async (id: string): Promise<void> => {
  const deletedCount = await ReadingProgressModel.destroy({
    where: { id },
  });

  if (deletedCount === 0) {
    throw new Error(`Reading progress with id ${id} not found`);
  }
};
