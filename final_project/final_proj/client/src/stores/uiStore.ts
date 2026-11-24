import { create } from "zustand";

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

// Client State เท่านั้น: ตัวกรอง UI และ toast (ข้อมูลจากเซิร์ฟเวอร์อยู่ใน TanStack Query)
interface UiState {
  search: string;
  categoryId: string;
  status: string;
  toast: Toast | null;
  setSearch: (v: string) => void;
  setCategoryId: (v: string) => void;
  setStatus: (v: string) => void;
  resetFilters: () => void;
  showToast: (type: Toast["type"], message: string) => void;
  clearToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  search: "",
  categoryId: "",
  status: "",
  toast: null,
  setSearch: (search) => set({ search }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setStatus: (status) => set({ status }),
  resetFilters: () => set({ search: "", categoryId: "", status: "" }),
  showToast: (type, message) => set({ toast: { id: Date.now(), type, message } }),
  clearToast: () => set({ toast: null }),
}));
