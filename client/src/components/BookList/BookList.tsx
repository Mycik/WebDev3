import { useEffect, useMemo, useState } from "react";
import type { BookType } from "../../types/books";
import { fetchBooks } from "../../api/api";
import Book from "../Book/Book";
import "./styles.css";

const BookList = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [genreFilter, setGenreFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const uniqueGenres = useMemo(() => {
    const genres = books.map((book) => book.genre);
    return ["All", ...Array.from(new Set(genres))];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];
    if (genreFilter !== "All") {
      result = result.filter((book) => book.genre === genreFilter);
    }

    result.sort((a, b) => {
      return sortOrder === "asc"
        ? a.publication_year - b.publication_year
        : b.publication_year - a.publication_year;
    });

    return result;
  }, [books, genreFilter, sortOrder]);

  if (loading) return <p className="book-list">Loading books...</p>;
  if (books.length === 0)
    return <p className="book-list">No books available.</p>;

  return (
    <div className="book-list">
      <h1 className="book-list__header">Library</h1>

      <div className="book-list__controls">
        <label>
          Genre:
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort by Year:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Oldest First</option>
            <option value="desc">Newest First</option>
          </select>
        </label>
      </div>

      <div className="book-list__grid">
        {filteredBooks.map((book) => (
          <Book key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookList;
