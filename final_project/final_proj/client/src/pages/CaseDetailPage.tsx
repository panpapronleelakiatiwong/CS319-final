import { Link, useParams } from "react-router";
import { useCase } from "../api/hooks";
import ErrorBox from "../components/ErrorBox";
import { Skeleton } from "../components/Skeleton";
import { CaseStatusBadge, ReservationStatusBadge } from "../components/StatusBadge";
import { FALLBACK_IMG, getItemImage, onImgError } from "../lib/itemImages";

export default function CaseDetailPage() {
  const { id } = useParams();
  const { data: c, isLoading, isError, error, refetch } = useCase(Number(id));

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32" />
      </div>
    );
  }
  if (isError || !c) {
    return <ErrorBox message={error?.message ?? "ไม่พบเคส"} onRetry={() => refetch()} />;
  }

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.location)}`;

  return (
    <div className="space-y-6">
      <Link to="/cases" className="text-sm text-forest-700 hover:underline">
        ← กลับไปรายการเคสซ่อมบ้าน
      </Link>

      <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">{c.title}</h1>
          <CaseStatusBadge status={c.status} />
        </div>
        <dl className="grid grid-cols-[7rem_1fr] gap-y-1.5 text-sm">
          <dt className="text-stone-500">เจ้าของบ้าน</dt>
          <dd>{c.ownerName}</dd>
          <dt className="text-stone-500">สถานที่</dt>
          <dd>
            {c.location}{" "}
            <a href={mapUrl} target="_blank" rel="noreferrer" className="text-forest-700 underline">
              เปิดแผนที่
            </a>
          </dd>
          <dt className="text-stone-500">ช่างอาสา</dt>
          <dd>{c.volunteer?.name ?? "ยังไม่มีช่างรับเคส"}</dd>
          <dt className="text-stone-500">วันที่แจ้ง</dt>
          <dd>{new Date(c.createdAt).toLocaleDateString("th-TH", { dateStyle: "long" })}</dd>
        </dl>
        <div>
          <h2 className="mb-1 text-sm font-semibold">รายละเอียดปัญหา</h2>
          <p className="whitespace-pre-line text-sm text-stone-700">{c.description || "-"}</p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">วัสดุที่จองไว้สำหรับเคสนี้ ({c.reservations.length} รายการ)</h2>
        {c.reservations.length === 0 ? (
          <p className="text-sm text-stone-500">
            ยังไม่มีการจองวัสดุ —{" "}
            <Link to="/items" className="text-forest-700 underline">
              ไปเลือกวัสดุเหลือใช้
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
            {c.reservations.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                {r.item && (
                  <img
                    src={getItemImage(r.item) || FALLBACK_IMG}
                    alt={r.item.title}
                    onError={onImgError}
                    className="h-12 w-16 rounded-md bg-stone-100 object-cover"
                  />
                )}
                <div className="flex-1">
                  {r.item ? (
                    <Link to={`/items/${r.item.id}`} className="font-medium hover:text-forest-700 hover:underline">
                      {r.item.title}
                    </Link>
                  ) : (
                    <span>วัสดุ #{r.itemId}</span>
                  )}
                  <p className="text-xs text-stone-500">
                    จำนวน {r.quantity} {r.item?.unit} · จองเมื่อ {new Date(r.createdAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
                <ReservationStatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
