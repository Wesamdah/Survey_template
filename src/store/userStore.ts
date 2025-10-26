import { create } from "zustand";

interface UserStore {
  full_name: string;
  email: string;
  phone: string;
  work_status: string;
  education: string;
  birth_date: Date | null;
  address: string;
  gender: string;
  setUserData: (data: Partial<UserStore>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  full_name: "",
  email: "",
  phone: "",
  work_status: "",
  education: "",
  birth_date: null,
  address: "",
  gender: "",
  setUserData: (data) => set((state) => ({ ...state, ...data })),
}));

interface UserLoginStore {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
}

export const useUserLoginStore = create<UserLoginStore>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
}));
