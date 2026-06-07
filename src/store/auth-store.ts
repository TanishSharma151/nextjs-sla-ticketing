import { create } from 'zustand';

type User = {
  id: string;

  email: string;

  memberships?: {
    role: string;
  }[];
};

type AuthStore = {
  user: User | null;

  setUser: (
    user: User | null,
  ) => void;
};

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: null,

    setUser: (user) =>
      set({ user }),
  }));