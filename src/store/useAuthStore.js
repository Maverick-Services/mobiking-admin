// File:  store/useAuthStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,           // Will hold { _id, name, email, role, permissions }
    setUser: (userObj) => set({ user: userObj }),
    clearUser: () => set({ user: null }),
}));
