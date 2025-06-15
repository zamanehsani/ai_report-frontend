import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface userType {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phone?: string;
  id?: string;
  address?: string;
  photoUrl?: string;
  isActive?: boolean;
  userType?: string;
}

export interface AuthState {
  user: userType;
  users: userType[];
  token: string;
  isAuthenticated: boolean;
  authenticate: (auth: boolean) => void;
  logout: () => void;
  removeUser: () => void;
  setUser: (newUser: userType) => void;
  setToken: (token: string) => void;
  removeToken: () => void;
  updateUser: (updatedFields: Partial<userType>) => void;
  setUsers: (obj: userType[]) => void;
  removeUsers: () => void;
  addUsers: (u: userType) => void;
  updateUsers: (u: userType) => void;
  deleteUsers: (id: string) => void;
}

export const useStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: {},
        users: [],
        token: "",
        isAuthenticated: false,
        authenticate: (auth) => set({ isAuthenticated: auth }),
        logout: () => set({ isAuthenticated: false }),
        removeUser: () => set({ user: {} }),
        setUser: (newUser) => set({ user: newUser }),
        setToken: (newToken) => set({ token: newToken }),
        removeToken: () => set({ token: "" }),
        updateUser: (updatedFields: Partial<userType>) =>
          set((state) => ({
            user: { ...state.user, ...updatedFields },
          })),

        setUsers: (objects: userType[]) => set({ users: objects }),
        removeUsers: () => set({ users: [] }),
        addUsers: (u: userType) => set({ users: [...get().users, u] }),
        updateUsers: (new_obj: userType) =>
          set({
            users: get().users.map((instance: userType) =>
              instance.id === new_obj.id ? new_obj : instance
            ),
          }),
        deleteUsers: (id: string) =>
          set({
            users: get().users.filter((u: userType) => u.id !== id),
          }),
      }),
      { name: "AuthStore" }
    )
  )
);
