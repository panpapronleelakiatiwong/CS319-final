import { useState } from "react";
import type { Category, Item, ItemInput, UserLite } from "../types";
import AddressFields from "./AddressFields";
import ImageUpload from "./ImageUpload";

interface Props {
  categories: Category[];
  users: UserLite[];
  initial?: Item;
  submitting: boolean;
  onSubmit: (input: ItemInput) => void;
  onCancel: () => void;
}

const field = "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-forest-500 focus:outline-none";

export default function ItemForm({ categories, users, initial, submitting, onSubmit, onCancel }: Props) {
  const donors = users.filter((u) => u.role === "DONOR");
  const findDonor = (name: string) => users.find((u) => u.name.trim().toLowerCase() === name.trim().toLowerCase());
  const phoneOf = (name: string) => findDonor(name)?.phone ?? "";
  const [uploading, setUploading] = useState(false);
  const [f, setF] = useState(() => {
    const donorName = initial?.donor?.name ?? users.find((u) => u.id === initial?.donorId)?.name ?? "";
    return {
      title: initial?.title ?? "",
      categoryId: String(initial?.categoryId ?? categories[0]?.id ?? ""),
      donorName,
      quantity: String(initial?.quantity ?? 1),
      unit: initial?.unit ?? "ชิ้น",
      condition: initial?.condition ?? "ดี",
      spec: initial?.spec ?? "",
      description: initial?.description ?? "",
      imageUrl: initial?.imageUrl ?? "",
      province: initial?.province ?? "",
      district: initial?.district ?? "",
      subdistrict: initial?.subdistrict ?? "",
      postalCode: initial?.postalCode ?? "",
      addressDetail: initial?.addressDetail ?? "",
      pickupAddress: initial?.pickupAddress ?? "",
      contactPhone: initial?.contactPhone ?? "",
    };
  });

  // พิมพ์ชื่อผู้บริจาค: ถ้าตรงกับผู้บริจาคเดิม และเบอร์ยังว่าง/เป็นของคนก่อนหน้า ให้เติมเบอร์ของคนนั้น
  const changeDonor = (e: { target: { value: string } }) => {
    const donorName = e.target.value;
    setF((p) => ({
      ...p,
      donorName,
      contactPhone: !p.contactPhone || p.contactPhone === phoneOf(p.donorName) ? phoneOf(donorName) || p.contactPhone : p.contactPhone,
    }));
  };
  const isNewDonor = f.donorName.trim().length >= 2 && !findDonor(f.donorName);
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
      province: f.province,
      district: f.district,
      subdistrict: f.subdistrict,
      postalCode: f.postalCode,
      addressDetail: f.addressDetail,
      pickupAddress: f.pickupAddress,
      contactPhone: f.contactPhone,
      categoryId: Number(f.categoryId),
      donorName: f.donorName.trim(),
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
        <input
          required
          minLength={2}
          list="donor-options"
          autoComplete="off"
          className={field}
          value={f.donorName}
          onChange={changeDonor}
          placeholder="พิมพ์ชื่อผู้บริจาค หรือเลือกจากรายชื่อ"
        />
        <datalist id="donor-options">
          {donors.map((u) => (
            <option key={u.id} value={u.name} />
          ))}
        </datalist>
        {isNewDonor && <span className="mt-0.5 block text-xs text-forest-600">+ จะเพิ่มเป็นผู้บริจาครายใหม่</span>}
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
        เบอร์โทรติดต่อ
        <input
          required
          type="tel"
          inputMode="tel"
          pattern="0[0-9\s\-]{8,11}"
          title="เบอร์โทร 9-10 หลัก ขึ้นต้นด้วย 0 เช่น 081-234-5678"
          className={field}
          value={f.contactPhone}
          onChange={set("contactPhone")}
          placeholder="081-234-5678"
        />
      </label>
      <div className="sm:col-span-2">
        <ImageUpload
          value={f.imageUrl}
          onChange={(url) => setF((p) => ({ ...p, imageUrl: url }))}
          onUploadingChange={setUploading}
        />
      </div>
      <label className="text-sm sm:col-span-2">
        สเปก/ขนาด
        <input className={field} value={f.spec} onChange={set("spec")} />
      </label>
      <label className="text-sm sm:col-span-2">
        รายละเอียด
        <textarea rows={2} className={field} value={f.description} onChange={set("description")} />
      </label>
      <fieldset className="grid gap-3 rounded-lg border border-stone-200 p-3 sm:col-span-2 sm:grid-cols-2">
        <legend className="px-1 text-sm font-medium">ที่อยู่สำหรับรับของ</legend>
        <AddressFields
          value={{ province: f.province, district: f.district, subdistrict: f.subdistrict, postalCode: f.postalCode }}
          onChange={(v) => setF((p) => ({ ...p, ...v }))}
        />
        <label className="text-sm sm:col-span-2">
          รายละเอียดที่อยู่เพิ่มเติม
          <input
            className={field}
            value={f.addressDetail}
            onChange={set("addressDetail")}
            placeholder="บ้านเลขที่ หมู่บ้าน ซอย ถนน"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          จุดรับของ
          <input
            className={field}
            value={f.pickupAddress}
            onChange={set("pickupAddress")}
            placeholder="เช่น หน้าบ้าน ประตูสีเขียว / โกดังหลังบ้าน เปิด 09:00-17:00"
          />
        </label>
      </fieldset>
      <div className="flex gap-2 sm:col-span-2">
        <button disabled={submitting || uploading} className="rounded-lg bg-forest-600 px-4 py-2 text-sm text-white hover:bg-forest-700 disabled:opacity-50">
          {submitting ? "กำลังบันทึก..." : uploading ? "รออัปโหลดรูป..." : "บันทึก"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
