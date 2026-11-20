import { useState } from "react";
import type { Category, Item, ItemInput, UserLite } from "../types";

interface Props {
  categories: Category[];
  users: UserLite[];
  initial?: Item;
  submitting: boolean;
  onSubmit: (input: ItemInput) => void;
  onCancel: () => void;
}

const field = "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

export default function ItemForm({ categories, users, initial, submitting, onSubmit, onCancel }: Props) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    categoryId: String(initial?.categoryId ?? categories[0]?.id ?? ""),
    donorId: String(initial?.donorId ?? users.find((u) => u.role === "DONOR")?.id ?? ""),
    quantity: String(initial?.quantity ?? 1),
    unit: initial?.unit ?? "ชิ้น",
    condition: initial?.condition ?? "ดี",
    spec: initial?.spec ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    pickupAddress: initial?.pickupAddress ?? "",
    lat: initial?.lat != null ? String(initial.lat) : "",
    lng: initial?.lng != null ? String(initial.lng) : "",
  });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: f.title,
      description: f.description,
      spec: f.spec,
      quantity: Number(f.quantity),
      unit: f.unit,
      condition: f.condition,
      imageUrl: f.imageUrl,
      pickupAddress: f.pickupAddress,
      lat: f.lat ? Number(f.lat) : undefined,
      lng: f.lng ? Number(f.lng) : undefined,
      categoryId: Number(f.categoryId),
      donorId: Number(f.donorId),
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-2">
      <h3 className="font-semibold sm:col-span-2">{initial ? "แก้ไขวัสดุ" : "ลงประกาศวัสดุเหลือใช้"}</h3>
      <label className="text-sm sm:col-span-2">
        ชื่อวัสดุ
        <input required className={field} value={f.title} onChange={set("title")} />
      </label>
      <label className="text-sm">
        หมวดหมู่
        <select className={field} value={f.categoryId} onChange={set("categoryId")}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        ผู้บริจาค
        <select className={field} value={f.donorId} onChange={set("donorId")}>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        จำนวน
        <input required type="number" min={0} className={field} value={f.quantity} onChange={set("quantity")} />
      </label>
      <label className="text-sm">
        หน่วย
        <input required className={field} value={f.unit} onChange={set("unit")} />
      </label>
      <label className="text-sm">
        สภาพ
        <input className={field} value={f.condition} onChange={set("condition")} />
      </label>
      <label className="text-sm">
        ลิงก์รูปภาพ
        <input className={field} value={f.imageUrl} onChange={set("imageUrl")} placeholder="https://..." />
      </label>
      <label className="text-sm sm:col-span-2">
        สเปก/ขนาด
        <input className={field} value={f.spec} onChange={set("spec")} />
      </label>
      <label className="text-sm sm:col-span-2">
        รายละเอียด
        <textarea rows={2} className={field} value={f.description} onChange={set("description")} />
      </label>
      <label className="text-sm sm:col-span-2">
        จุดรับของ
        <input required className={field} value={f.pickupAddress} onChange={set("pickupAddress")} />
      </label>
      <label className="text-sm">
        ละติจูด
        <input type="number" step="any" className={field} value={f.lat} onChange={set("lat")} />
      </label>
      <label className="text-sm">
        ลองจิจูด
        <input type="number" step="any" className={field} value={f.lng} onChange={set("lng")} />
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <button disabled={submitting} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50">
          {submitting ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
