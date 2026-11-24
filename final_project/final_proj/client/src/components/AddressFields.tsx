import { useEffect, useMemo, useRef, useState } from "react";

// ข้อมูลจังหวัด/อำเภอ/ตำบล: [จังหวัด, [[อำเภอ, [[ตำบล, รหัสไปรษณีย์], ...]], ...]][]
type ThaiAddressData = [string, [string, [string, string][]][]][];

export interface AreaValue {
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
}

interface Option {
  key: string;
  label: string;
  hint?: string;
  value: Partial<AreaValue>;
}

const MAX_OPTIONS = 30;
const field =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-forest-500 focus:outline-none";

// โหลดข้อมูลครั้งเดียวแบบ lazy (แยกไฟล์ ไม่ทำให้หน้าแรกโหลดช้า)
let dataPromise: Promise<ThaiAddressData> | null = null;
const loadData = () =>
  (dataPromise ??= import("../data/thai-address.json").then((m) => m.default as unknown as ThaiAddressData));

function useThaiAddress() {
  const [data, setData] = useState<ThaiAddressData | null>(null);
  useEffect(() => {
    let alive = true;
    loadData().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);
  return useMemo(() => {
    if (!data) return null;
    const provinces = data.map(([p]) => p);
    const districts = data.flatMap(([p, ds]) => ds.map(([d]) => ({ p, d })));
    const subdistricts = data.flatMap(([p, ds]) => ds.flatMap(([d, ss]) => ss.map(([s, z]) => ({ p, d, s, z }))));
    return { provinces, districts, subdistricts };
  }, [data]);
}

// ตัดคำนำหน้าที่ผู้ใช้อาจพิมพ์มาเอง (เฉพาะของแต่ละระดับ เพราะมีตำบลชื่อ "จ.ป.ร.")
const strip = (re: RegExp) => (s: string) => s.trim().replace(re, "");
const normProvince = strip(/^(จังหวัด|จ\.)\s*/);
const normDistrict = strip(/^(อำเภอ|อ\.|เขต)\s*/);
const normSubdistrict = strip(/^(ตำบล|ต\.|แขวง)\s*/);
const matches = (name: string, q: string) => !q || name.includes(q);
// ชื่อที่ขึ้นต้นด้วยคำค้นแสดงก่อน
const rank = (name: string, q: string) => (q && name.startsWith(q) ? 0 : 1);

function Combobox({
  label,
  value,
  placeholder,
  options,
  onType,
  onPick,
  numeric,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: Option[];
  onType: (text: string) => void;
  onPick: (o: Option) => void;
  numeric?: boolean; // ช่องตัวเลข 5 หลัก (รหัสไปรษณีย์)
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => setActive(0), [options]);
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const pick = (o: Option) => {
    onPick(o);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || options.length === 0) {
      if (e.key === "ArrowDown") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <label className="relative text-sm">
      {label}
      <input
        required
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        className={field}
        value={value}
        placeholder={placeholder}
        {...(numeric && { inputMode: "numeric" as const, maxLength: 5, pattern: "[0-9]{5}", title: "ตัวเลข 5 หลัก" })}
        onChange={(e) => {
          onType(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {open && options.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
        >
          {options.map((o, i) => (
            <li
              key={o.key}
              role="option"
              aria-selected={i === active}
              // ใช้ onMouseDown เพื่อเลือกก่อนที่ input จะ blur
              onMouseDown={(e) => {
                e.preventDefault();
                pick(o);
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-3 py-1.5 ${i === active ? "bg-forest-50 text-forest-800" : ""}`}
            >
              {o.label}
              {o.hint && <span className="ml-1 text-xs text-stone-400">{o.hint}</span>}
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}

/**
 * ช่องกรอก จังหวัด · เขต/อำเภอ · แขวง/ตำบล · รหัสไปรษณีย์
 * พิมพ์ได้อิสระ และมีรายการแนะนำตามตัวอักษรที่พิมพ์ (กรองตามช่องที่กรอกไว้แล้ว)
 * เลือกตำบลแล้วจะเติมอำเภอ/จังหวัด/รหัสไปรษณีย์ให้อัตโนมัติ
 * พิมพ์รหัสไปรษณีย์แล้วจะแนะนำตำบลที่ใช้รหัสนั้น
 */
export default function AddressFields({ value, onChange }: { value: AreaValue; onChange: (v: AreaValue) => void }) {
  const db = useThaiAddress();
  const p = normProvince(value.province);
  const d = normDistrict(value.district);
  const s = normSubdistrict(value.subdistrict);
  const z = value.postalCode.trim();

  const provinceOptions = useMemo<Option[]>(() => {
    if (!db) return [];
    return db.provinces
      .filter((x) => matches(x, p))
      .sort((a, b) => rank(a, p) - rank(b, p))
      .slice(0, MAX_OPTIONS)
      .map((x) => ({ key: x, label: x, value: { province: x } }));
  }, [db, p]);

  const districtOptions = useMemo<Option[]>(() => {
    if (!db) return [];
    const inProvince = db.provinces.includes(p);
    if (!d && !inProvince) return [];
    return db.districts
      .filter((x) => (!inProvince || x.p === p) && matches(x.d, d))
      .sort((a, b) => rank(a.d, d) - rank(b.d, d))
      .slice(0, MAX_OPTIONS)
      .map((x) => ({ key: `${x.p}|${x.d}`, label: x.d, hint: inProvince ? undefined : x.p, value: { district: x.d, province: x.p } }));
  }, [db, p, d]);

  const subdistrictOptions = useMemo<Option[]>(() => {
    if (!db) return [];
    const knownDistrict = db.districts.some((x) => x.d === d && (!p || x.p === p));
    const inProvince = db.provinces.includes(p);
    if (!s && !knownDistrict) return [];
    return db.subdistricts
      .filter((x) => (!knownDistrict || x.d === d) && (!inProvince || x.p === p) && matches(x.s, s))
      .sort((a, b) => rank(a.s, s) - rank(b.s, s))
      .slice(0, MAX_OPTIONS)
      .map((x) => ({
        key: `${x.p}|${x.d}|${x.s}`,
        label: x.s,
        hint: knownDistrict ? x.z : `${x.d} » ${x.p} · ${x.z}`,
        value: { subdistrict: x.s, district: x.d, province: x.p, postalCode: x.z },
      }));
  }, [db, p, d, s]);

  const postalOptions = useMemo<Option[]>(() => {
    if (!db) return [];
    const inProvince = db.provinces.includes(p);
    const knownDistrict = db.districts.some((x) => x.d === d && (!inProvince || x.p === p));
    const knownSub = db.subdistricts.some((x) => x.s === s && (!knownDistrict || x.d === d));
    // ยังไม่ได้พิมพ์และยังไม่รู้พื้นที่ -> ไม่ต้องแสดง (มีหลายพันรายการ)
    if (!z && !knownDistrict) return [];
    return db.subdistricts
      .filter(
        (x) =>
          (!z || x.z.startsWith(z)) &&
          (!inProvince || x.p === p) &&
          (!knownDistrict || x.d === d) &&
          (!knownSub || x.s === s),
      )
      .slice(0, MAX_OPTIONS)
      .map((x) => ({
        key: `${x.p}|${x.d}|${x.s}`,
        label: x.z,
        hint: `${x.s} » ${x.d} » ${x.p}`,
        value: { postalCode: x.z, subdistrict: x.s, district: x.d, province: x.p },
      }));
  }, [db, p, d, s, z]);

  // เมื่อเลือกค่าระดับบน ถ้าค่าระดับล่างไม่อยู่ในพื้นที่นั้นแล้ว ให้ล้างออก
  const pick = (next: Partial<AreaValue>) => {
    const v = { ...value, ...next };
    if (db && next.province && !next.district) {
      const ok = db.districts.some((x) => x.p === v.province && x.d === normDistrict(v.district));
      if (!ok) Object.assign(v, { district: "", subdistrict: "", postalCode: "" });
    }
    if (db && next.district && !next.subdistrict) {
      const ok = db.subdistricts.some((x) => x.d === v.district && x.p === v.province && x.s === normSubdistrict(v.subdistrict));
      if (!ok) Object.assign(v, { subdistrict: "", postalCode: "" });
    }
    onChange(v);
  };

  return (
    <>
      <Combobox
        label="จังหวัด"
        value={value.province}
        placeholder="พิมพ์ชื่อจังหวัด"
        options={provinceOptions}
        onType={(t) => onChange({ ...value, province: t })}
        onPick={(o) => pick(o.value)}
      />
      <Combobox
        label="เขต/อำเภอ"
        value={value.district}
        placeholder="พิมพ์ชื่อเขต/อำเภอ"
        options={districtOptions}
        onType={(t) => onChange({ ...value, district: t })}
        onPick={(o) => pick(o.value)}
      />
      <Combobox
        label="แขวง/ตำบล"
        value={value.subdistrict}
        placeholder="พิมพ์ชื่อแขวง/ตำบล"
        options={subdistrictOptions}
        onType={(t) => onChange({ ...value, subdistrict: t })}
        onPick={(o) => pick(o.value)}
      />
      <Combobox
        label="รหัสไปรษณีย์"
        value={value.postalCode}
        placeholder="เช่น 10260"
        numeric
        options={postalOptions}
        onType={(t) => onChange({ ...value, postalCode: t.replace(/\D/g, "").slice(0, 5) })}
        onPick={(o) => pick(o.value)}
      />
    </>
  );
}
