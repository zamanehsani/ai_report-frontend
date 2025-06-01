import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface userType {
  firstName?: string;
  lastName?: string;
  middlename?: string;
  email?: string;
  phone?: string;
  id?: string;
}

export interface AuthState {
  user: userType;
  token: string;
  isAuthenticated: boolean;
  authenticate: (auth: boolean) => void;
  logout: () => void;
  removeUser: () => void;
  setUser: (newUser: userType) => void;
}

export const useStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: {
          firstName: "Zaman",
          lastName: "Ehsani",
        },
        token: "",
        isAuthenticated: false,
        authenticate: (auth) => set({ isAuthenticated: auth }),
        logout: () => set({ isAuthenticated: false }),
        removeUser: () => set({ user: {} }),
        setUser: (newUser) => set({ user: newUser }),
      }),
      { name: "AuthStore" }
    )
  )
);
