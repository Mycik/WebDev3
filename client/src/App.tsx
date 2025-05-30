import { Route, Routes } from "react-router-dom";
import AuthPage from "./components/pages/AuthPage/AuthPage";
import { MainPage } from "./components/pages/MainPage/MainPage";
import ProtectedRoute from "./components/utils/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
