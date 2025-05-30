import type { BookType } from "../../types/books";
import "./styles.css";

const Book = ({ book }: { book: BookType }) => {
  return (
    <div className="book">
      <div className="book__content">
        <div className="book__details">
          <h2 className="book__title">{book.title}</h2>
          <p className="book__info">
            <strong>Author:</strong> {book.author}
          </p>
          <p className="book__info">
            <strong>Genre:</strong> {book.genre}
          </p>
          <p className="book__info">
            <strong>Year:</strong> {book.publication_year}
          </p>
          <p className="book__description">{book.description}</p>
          <a
            className="book__link"
            href={book.file_url}
            target="_blank"
            rel="noreferrer"
          >
            Read Book
          </a>
        </div>
        <img className="book__image" src={book.image_url} alt={book.title} />
      </div>
    </div>
  );
};

export default Book;
