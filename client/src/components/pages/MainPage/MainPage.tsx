import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import BookList from "../../BookList/BookList";
import ReadingProgressList from "../../ReadingProgressList/ReadingProgressList";
import "./styles.css";

export const MainPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <>
      <div className="main-page__header">
        <button className="main-page__logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="main-page">
        <div className="main-page__column">
          <BookList />
        </div>
        <div className="main-page__column">
          <ReadingProgressList />
        </div>
      </div>
    </>
  );
};
