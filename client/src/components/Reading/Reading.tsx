import { useState } from "react";
import type { ReadingProgress } from "../../types/readingProgress";
import { updateReadingProgress, deleteReadingProgress } from "../../api/api";

import "./styles.css";

interface ReadingProps {
  item: ReadingProgress;
  onUpdated: () => void;
}

const Reading = ({ item, onUpdated }: ReadingProps) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    current_page: item.current_page.toString(),
  });

  const handleUpdate = async () => {
    try {
      await updateReadingProgress(item.id, {
        current_page: parseInt(formData.current_page),
      });
      setEditing(false);
      onUpdated();
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this progress?")) {
      try {
        await deleteReadingProgress(item.id);
        onUpdated();
      } catch (err) {
        console.error("Failed to delete progress:", err);
      }
    }
  };

  return (
    <div className="reading-progress__item">
      <h2>{item.book?.title ?? "Unknown Book"}</h2>
      <p className="reading-progress__info">
        <strong>Author:</strong> {item.book?.author}
      </p>

      {editing ? (
        <>
          <label className="reading-progress__label">
            Current Page:
            <input
              className="reading-progress__input"
              type="number"
              value={formData.current_page}
              onChange={(e) => setFormData({ current_page: e.target.value })}
            />
          </label>

          <button className="reading-progress__button" onClick={handleUpdate}>
            Save
          </button>
          <button
            className="reading-progress__button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="reading-progress__info">
            <strong>Current Page:</strong> {item.current_page}
          </p>
          <p className="reading-progress__info">
            <strong>Progress:</strong>{" "}
            {Math.round(
              (item.current_page / (item.book?.pagesCount || 1)) * 100
            )}
            %
          </p>
          <p className="reading-progress__info">
            <strong>Last Updated:</strong>{" "}
            {new Date(item.updated_at).toLocaleString()}
          </p>
          <button
            className="reading-progress__button"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            className="reading-progress__button delete"
            onClick={handleDelete}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default Reading;
