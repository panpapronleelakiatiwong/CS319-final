import { useState } from "react";
import { Link, useParams } from "react-router";
import { useCases, useItem, useReserve } from "../api/hooks";
import ErrorBox from "../components/ErrorBox";
import { FALLBACK_IMG, getItemImage, onImgError } from "../lib/itemImages";
import { formatFullAddress, mapSearchUrl } from "../lib/address";
import { Skeleton } from "../components/Skeleton";
import { ItemStatusBadge, ReservationStatusBadge } from "../components/StatusBadge";

export default function ItemDetailPage() {
  const { id } = useParams();
  const itemId = Number(id);
  const { data: item, isLoading, isError, error, refetch } = useItem(itemId);
  const { data: cases } = useCases();
  const reserve = useReserve();
  const [caseId, setCaseId] = useState("");
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-72" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }
  if (isError || !item) {
    return <ErrorBox message={error?.message ?? "ไม่พบวัสดุ"} onRetry={() => refetch()} />;
  }

  const openCases = cases?.filter((c) => c.status !== "DONE") ?? [];
  const canReserve = item.status === "AVAILABLE" && item.quantity > 0;
  const fullAddress = formatFullAddress(item);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    reserve.mutate({ itemId: item.id, caseId: Number(caseId), quantity: qty }, { onSuccess: () => setQty(1) });
  };

  return (
    <div className="space-y-6">
      <Link to="/items" className="text-sm text-forest-700 hover:underline">
        ← กลับไปรายการวัสดุ
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <img src={getItemImage(item) || FALLBACK_IMG} alt={item.title} onError={onImgError} className="h-72 w-full rounded-xl bg-stone-100 object-cover" />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <ItemStatusBadge status={item.status} />
          </div>
          <p className="text-sm text-stone-500">
            {item.category?.name} · ผู้บริจาค: {item.donor?.name}
          </p>
          <p className="text-lg">
            คงเหลือ <b>{item.quantity}</b> {item.unit}
          </p>
          <dl className="grid grid-cols-[7rem_1fr] gap-y-1 text-sm">
            <dt className="text-stone-500">สภาพ</dt>
            <dd>{item.condition}</dd>
            <dt className="text-stone-500">สเปก</dt>
            <dd>{item.spec || "-"}</dd>
          </dl>

          <section className="space-y-2 rounded-xl border border-forest-200 bg-forest-50/60 p-4 text-sm">
            <h2 className="font-semibold text-forest-900">📍 ที่อยู่สำหรับรับของ</h2>
            <dl className="grid grid-cols-[7rem_1fr] gap-y-1">
              <dt className="text-stone-500">ที่อยู่</dt>
              <dd>{item.addressDetail || "-"}</dd>
              <dt className="text-stone-500">จังหวัด</dt>
              <dd>{item.province || "-"}</dd>
              <dt className="text-stone-500">เขต/อำเภอ</dt>
              <dd>{item.district || "-"}</dd>
              <dt className="text-stone-500">แขวง/ตำบล</dt>
              <dd>{item.subdistrict || "-"}</dd>
              <dt className="text-stone-500">รหัสไปรษณีย์</dt>
              <dd>{item.postalCode || "-"}</dd>
              <dt className="text-stone-500">จุดรับของ</dt>
              <dd>{item.pickupAddress || "-"}</dd>
              <dt className="text-stone-500">เบอร์โทรติดต่อ</dt>
              <dd>
                {item.contactPhone ? (
                  <a href={`tel:${item.contactPhone.replace(/[\s-]/g, "")}`} className="font-medium text-forest-700 underline">
                    📞 {item.contactPhone}
                  </a>
                ) : (
                  "-"
                )}
              </dd>
            </dl>
            {fullAddress && (
              <a
                href={mapSearchUrl(item)}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-forest-700 underline hover:text-forest-900"
              >
                เปิดใน Google Maps
              </a>
            )}
          </section>
          <p className="text-sm text-stone-600">{item.description}</p>

          <form onSubmit={submit} className="space-y-2 rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="font-semibold">จองเพื่อนำไปซ่อมแซมเคส</h2>
            <select required value={caseId} onChange={(e) => setCaseId(e.target.value)} disabled={!canReserve} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm">
              <option value="">— เลือกเคสซ่อมบ้าน —</option>
              {openCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={item.quantity}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={!canReserve}
                className="w-24 rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <button
                disabled={!canReserve || reserve.isPending}
                className="flex-1 rounded-lg bg-forest-600 px-4 py-2 text-sm text-white hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reserve.isPending ? "กำลังจอง..." : canReserve ? "กดจองเพื่อนำไปใช้ซ่อมแซม" : "ไม่สามารถจองได้"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">ประวัติการจอง</h2>
        {item.reservations.length === 0 ? (
          <p className="text-sm text-stone-500">ยังไม่มีการจอง</p>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
            {item.reservations.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <span>
                  {r.repairCase?.title} — {r.quantity} {item.unit}
                </span>
                <ReservationStatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
