import type { CaseStatus, ItemStatus, ReservationStatus } from "../types";

function Badge({ label, tone }: { label: string; tone: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>{label}</span>;
}

const item: Record<ItemStatus, [string, string]> = {
  AVAILABLE: ["พร้อมให้จอง", "bg-emerald-100 text-emerald-700"],
  RESERVED: ["ถูกจองหมดแล้ว", "bg-amber-100 text-amber-700"],
  USED: ["ใช้แล้ว", "bg-stone-200 text-stone-600"],
};
const caseS: Record<CaseStatus, [string, string]> = {
  OPEN: ["รอวัสดุ", "bg-rose-100 text-rose-700"],
  IN_PROGRESS: ["กำลังซ่อม", "bg-sky-100 text-sky-700"],
  DONE: ["ซ่อมเสร็จ", "bg-emerald-100 text-emerald-700"],
};
const resv: Record<ReservationStatus, [string, string]> = {
  RESERVED: ["รอรับของ", "bg-amber-100 text-amber-700"],
  PICKED_UP: ["รับของแล้ว", "bg-emerald-100 text-emerald-700"],
  CANCELLED: ["ยกเลิก", "bg-stone-200 text-stone-600"],
};

export const ItemStatusBadge = ({ status }: { status: ItemStatus }) => <Badge label={item[status][0]} tone={item[status][1]} />;
export const CaseStatusBadge = ({ status }: { status: CaseStatus }) => <Badge label={caseS[status][0]} tone={caseS[status][1]} />;
export const ReservationStatusBadge = ({ status }: { status: ReservationStatus }) => (
  <Badge label={resv[status][0]} tone={resv[status][1]} />
);
export const caseStatusLabels = Object.fromEntries(Object.entries(caseS).map(([k, v]) => [k, v[0]])) as Record<CaseStatus, string>;
