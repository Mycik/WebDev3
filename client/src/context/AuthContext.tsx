import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({ user });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false); // to prevent flash

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me"); // You should create this endpoint
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoaded(true);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
