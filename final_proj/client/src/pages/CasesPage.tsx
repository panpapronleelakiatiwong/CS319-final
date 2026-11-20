import { useCases } from "../api/hooks";
import ErrorBox from "../components/ErrorBox";
import { Skeleton } from "../components/Skeleton";
import { CaseStatusBadge } from "../components/StatusBadge";

export default function CasesPage() {
  const { data, isLoading, isError, error, refetch } = useCases();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">เคสซ่อมแซมบ้านในชุมชน</h1>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : isError ? (
        <ErrorBox message={error.message} onRetry={() => refetch()} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((c) => (
            <article key={c.id} className="space-y-1 rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{c.title}</h2>
                <CaseStatusBadge status={c.status} />
              </div>
              <p className="text-sm text-stone-600">{c.description}</p>
              <p className="text-xs text-stone-500">
                เจ้าของบ้าน: {c.ownerName} · 📍 {c.location}
              </p>
              <p className="text-xs text-stone-500">
                ช่างอาสา: {c.volunteer?.name ?? "ยังไม่มี"} · วัสดุที่จองแล้ว {c._count?.reservations ?? 0} รายการ
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
