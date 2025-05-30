import { create } from "zustand";
import { api } from "../api/api";

export interface User {
  id: string;
  name: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  loaded: boolean;

  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loaded: false,

  fetchUser: async () => {
    try {
      const res = await api.get<{ user: User }>("/users/me");
      set({ user: res.data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ loaded: true });
    }
  },

  setUser: (user) => set({ user }),
  logout: async () => {
    await api.post("/users/logout");
    set({ user: null });
  },
}));
