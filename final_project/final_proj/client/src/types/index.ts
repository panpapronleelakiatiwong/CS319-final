export type Role = "DONOR" | "VOLUNTEER" | "ADMIN";
export type ItemStatus = "AVAILABLE" | "RESERVED" | "USED";
export type CaseStatus = "OPEN" | "IN_PROGRESS" | "DONE";
export type ReservationStatus = "RESERVED" | "PICKED_UP" | "CANCELLED";

export interface Category {
  id: number;
  name: string;
}

export interface UserLite {
  id: number;
  name: string;
  role: Role;
  phone?: string | null;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  spec: string;
  quantity: number;
  unit: string;
  condition: string;
  imageUrl: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  addressDetail: string;
  pickupAddress: string;
  contactPhone: string;
  status: ItemStatus;
  categoryId: number;
  donorId: number;
  createdAt: string;
  category?: Category;
  donor?: { id: number; name: string };
}

export interface RepairCase {
  id: number;
  title: string;
  description: string;
  location: string;
  ownerName: string;
  status: CaseStatus;
  volunteerId: number | null;
  volunteer?: { id: number; name: string } | null;
  _count?: { reservations: number };
}

export interface Reservation {
  id: number;
  itemId: number;
  caseId: number;
  quantity: number;
  status: ReservationStatus;
  createdAt: string;
  item?: Item;
  repairCase?: RepairCase;
}

export interface CaseDetail extends RepairCase {
  createdAt: string;
  reservations: (Reservation & { item?: Pick<Item, "id" | "title" | "unit" | "imageUrl"> })[];
}

export interface ItemDetail extends Item {
  reservations: Reservation[];
}

export interface Stats {
  totalItems: number;
  availableItems: number;
  openCases: number;
  doneCases: number;
  totalReservations: number;
  pickedUp: number;
  donors: number;
}

export interface ItemInput {
  title: string;
  description: string;
  spec: string;
  quantity: number;
  unit: string;
  condition: string;
  imageUrl: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  addressDetail: string;
  pickupAddress: string;
  contactPhone: string;
  status?: ItemStatus;
  categoryId: number;
  donorId?: number;
  donorName?: string; // พิมพ์ชื่อเอง: ไม่มีในระบบจะสร้างผู้บริจาคใหม่
}

export interface CaseInput {
  title: string;
  description: string;
  location: string;
  ownerName: string;
  status?: CaseStatus;
  volunteerId?: number | null;
}

export interface ReservationInput {
  itemId: number;
  caseId: number;
  quantity: number;
}
