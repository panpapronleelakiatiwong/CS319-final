import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUiStore } from "../stores/uiStore";
import type {
  CaseInput,
  Category,
  Item,
  ItemDetail,
  ItemInput,
  RepairCase,
  Reservation,
  ReservationInput,
  Stats,
  UserLite,
} from "../types";
import { api } from "./client";

export interface ItemFilters {
  search: string;
  categoryId: string;
  status: string;
}

// ---------- Queries (Server Cache) ----------
export const useCategories = () => useQuery({ queryKey: ["categories"], queryFn: () => api<Category[]>("/categories") });
export const useUsers = () => useQuery({ queryKey: ["users"], queryFn: () => api<UserLite[]>("/users") });
export const useStats = () => useQuery({ queryKey: ["stats"], queryFn: () => api<Stats>("/stats") });
export const useCases = () => useQuery({ queryKey: ["cases"], queryFn: () => api<RepairCase[]>("/cases") });
export const useReservations = () =>
  useQuery({ queryKey: ["reservations"], queryFn: () => api<Reservation[]>("/reservations") });

export function useItems(filters: Partial<ItemFilters> = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return useQuery({ queryKey: ["items", filters], queryFn: () => api<Item[]>(`/items${qs ? `?${qs}` : ""}`) });
}

export const useItem = (id: number) =>
  useQuery({ queryKey: ["item", id], queryFn: () => api<ItemDetail>(`/items/${id}`), enabled: Number.isInteger(id) && id > 0 });

// ---------- Mutations (Zero-Refresh: invalidate แล้ว UI อัปเดตเอง) ----------
const ALL_KEYS = ["items", "item", "cases", "reservations", "stats"];

function useMutate<TVars, TRes>(fn: (vars: TVars) => Promise<TRes>, successMessage: string) {
  const qc = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation<TRes, Error, TVars>({
    mutationFn: fn,
    onSuccess: async () => {
      await Promise.all(ALL_KEYS.map((k) => qc.invalidateQueries({ queryKey: [k] })));
      showToast("success", successMessage);
    },
    onError: (e) => showToast("error", e.message),
  });
}

export const useCreateItem = () =>
  useMutate((body: ItemInput) => api<Item>("/items", { method: "POST", body }), "เพิ่มวัสดุเรียบร้อย");
export const useUpdateItem = () =>
  useMutate(
    ({ id, data }: { id: number; data: Partial<ItemInput> }) => api<Item>(`/items/${id}`, { method: "PUT", body: data }),
    "บันทึกการแก้ไขเรียบร้อย",
  );
export const useDeleteItem = () =>
  useMutate((id: number) => api<void>(`/items/${id}`, { method: "DELETE" }), "ลบวัสดุเรียบร้อย");

export const useCreateCase = () =>
  useMutate((body: CaseInput) => api<RepairCase>("/cases", { method: "POST", body }), "เพิ่มเคสซ่อมบ้านเรียบร้อย");
export const useUpdateCase = () =>
  useMutate(
    ({ id, data }: { id: number; data: Partial<CaseInput> }) =>
      api<RepairCase>(`/cases/${id}`, { method: "PUT", body: data }),
    "อัปเดตเคสเรียบร้อย",
  );
export const useDeleteCase = () =>
  useMutate((id: number) => api<void>(`/cases/${id}`, { method: "DELETE" }), "ลบเคสเรียบร้อย");

export const useReserve = () =>
  useMutate((body: ReservationInput) => api<Reservation>("/reservations", { method: "POST", body }), "จองวัสดุสำเร็จ");
export const usePickup = () =>
  useMutate((id: number) => api<Reservation>(`/reservations/${id}/pickup`, { method: "PATCH" }), "ตัดสต็อกเรียบร้อย (รับของแล้ว)");
export const useCancelReservation = () =>
  useMutate((id: number) => api<Reservation>(`/reservations/${id}/cancel`, { method: "PATCH" }), "ยกเลิกการจองแล้ว คืนจำนวนเข้าสต็อก");
