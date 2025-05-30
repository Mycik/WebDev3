import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import type { ReadingProgress } from "../../types/readingProgress";
import { fetchBooks, fetchUserProgress } from "../../api/api";
import AddProgress from "../AddProgress/AddProgress";
import Reading from "../Reading/Reading";
import "./styles.css";

const ReadingProgressList = () => {
  const user = useAuthStore((state) => state.user);
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    try {
      if (!user) return;
      const [progressData, books] = await Promise.all([
        fetchUserProgress(user.id),
        fetchBooks(),
      ]);

      const enriched = progressData.map((p) => ({
        ...p,
        book: books.find((b) => b.id === p.book_id),
      }));

      setProgress(enriched);
    } catch (err) {
      console.error("Failed to load reading progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  if (loading)
    return <p className="reading-progress">Loading reading progress...</p>;

  return (
    <div className="reading-progress">
      <AddProgress onSuccess={loadProgress} />

      {progress.length === 0 && <p>You haven't read anything!</p>}

      {progress.map((p) => (
        <Reading key={p.id} item={p} onUpdated={loadProgress} />
      ))}
    </div>
  );
};

export default ReadingProgressList;
