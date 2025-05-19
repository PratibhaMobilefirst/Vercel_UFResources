import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  role: string;
  permissions: string[];
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
      },
      clearAuth: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-store", // The key for localStorage
      getStorage: () => localStorage, // You can change this to sessionStorage if needed
    } as any
  )
);
