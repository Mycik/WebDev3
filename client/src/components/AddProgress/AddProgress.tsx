import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import type { BookType } from "../../types/books";
import { createReadingProgress, fetchBooks } from "../../api/api";

import "./styles.css";

const AddProgress = ({ onSuccess }: { onSuccess?: () => void }) => {
  const user = useAuthStore((state) => state.user);
  const [books, setBooks] = useState<BookType[]>([]);
  const [bookId, setBookId] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks().then(setBooks);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await createReadingProgress({
        user_id: user.id,
        book_id: bookId,
        current_page: parseInt(currentPage),
      });
      alert("Progress added!");
      setBookId("");
      setCurrentPage("");
      onSuccess?.();
    } catch (err) {
      console.error("Failed to add progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentBook = books.find((b) => b.id === bookId);

  return (
    <form onSubmit={handleSubmit} className="add-progress">
      <h2 className="add-progress__title">Add Reading Progress</h2>

      <div className="add-progress__field">
        <label className="add-progress__label">
          Book:
          <select
            className="add-progress__select"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.author})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="add-progress__field">
        <label className="add-progress__label">
          Current Page:
          <input
            className="add-progress__input"
            type="number"
            value={currentPage}
            onChange={(e) => setCurrentPage(e.target.value)}
            min={1}
            max={currentBook?.pagesCount || 1000}
            required
          />
        </label>
      </div>

      <button type="submit" className="add-progress__button" disabled={loading}>
        {loading ? "Saving..." : "Add Progress"}
      </button>
    </form>
  );
};

export default AddProgress;
