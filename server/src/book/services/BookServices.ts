import BookModel from "../models/BookModel";

export interface CreateBookDTO {
  title: string;
  author: string;
  genre: string;
  description: string;
  publication_year: number;
  file_url: string;
  pagesCount: number;
}

export const createBook = async (data: CreateBookDTO): Promise<BookModel> => {
  return await BookModel.create(data);
};

export const listBooks = async (): Promise<BookModel[]> => {
  return await BookModel.findAll({
    order: [["created_at", "DESC"]],
  });
};

export const getBookById = async (id: string): Promise<BookModel | null> => {
  return await BookModel.findByPk(id);
};

export const updateBook = async (
  id: string,
  updates: Partial<CreateBookDTO>
): Promise<BookModel> => {
  const book = await BookModel.findByPk(id);
  if (!book) {
    throw new Error("Book not found");
  }
  return await book.update(updates);
};
