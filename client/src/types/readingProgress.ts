import type { BookType } from "./books";

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  updated_at: string;
  book?: BookType;
}
