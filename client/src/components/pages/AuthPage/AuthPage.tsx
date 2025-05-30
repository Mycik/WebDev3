import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { login, register } from "../../../api/api";
import "./styles.css";

const AuthPage = () => {
  const user = useAuthStore((state) => state.user);
  const loaded = useAuthStore((state) => state.loaded);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (loaded && user) {
    return <Navigate to=".." />;
  }

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);
      await register({ email, password });
      fetchUser();
      navigate("..");
      setLoading(false);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await login({ email, password });
      fetchUser();
      navigate("..");
      setLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="auth">
      <h1>Login or Register</h1>
      <input
        className="auth__input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="auth__input"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <div className="auth__error">{error}</div>}

      <button
        className="auth__button"
        onClick={handleRegister}
        disabled={loading}
      >
        Register
      </button>
      <button className="auth__button" onClick={handleLogin} disabled={loading}>
        Login
      </button>
    </div>
  );
};

export default AuthPage;
