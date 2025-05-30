import axios from "axios";
import type { BookType } from "../types/books";
import type { ReadingProgress } from "../types/readingProgress";

export const api = axios.create({
  baseURL: "http://localhost:49200",
  withCredentials: true,
});

export const register = async (userData: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/users/register", userData);
  return res.data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/users/login", credentials);
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/users/logout");
  return res.data;
};

export const fetchBooks = async (): Promise<BookType[]> => {
  const res = await api.get<BookType[]>("/books");
  return res.data;
};

export const fetchUserProgress = async (
  userId: string
): Promise<ReadingProgress[]> => {
  const res = await api.get<ReadingProgress[]>(`/reading/${userId}`);
  return res.data;
};

export interface CreateReadingProgressDTO {
  user_id: string;
  book_id: string;
  current_page: number;
}

export const createReadingProgress = async (data: CreateReadingProgressDTO) => {
  const res = await api.post("/reading/", data);
  return res.data;
};

export const updateReadingProgress = async (
  id: string,
  updates: {
    current_page: number;
  }
) => {
  const res = await api.put(`/reading/${id}`, updates, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteReadingProgress = async (id: string) => {
  const res = await api.delete(`/reading/${id}`);
  return res.data;
};
