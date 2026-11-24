import { Link } from "react-router";
import { useCase, useCases } from "../../api/hooks";
import type { RepairCase } from "../../types";
import ErrorBox from "../ErrorBox";
import { Skeleton } from "../Skeleton";
import { CaseStatusBadge } from "../StatusBadge";
import { ArrowRightIcon, HomeIcon, PinIcon, UsersIcon } from "./icons";

// ภาพประกอบบ้านไม้ที่กำลังรอซ่อม (ไม่มีรูปเคสในระบบ จึงใช้ภาพวาดแทนรูปบุคคลจริง)
function HouseIllustration() {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5eadc" />
          <stop offset="1" stopColor="#ecd9c1" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#sky)" />
      <circle cx="320" cy="62" r="30" fill="#dcbc98" opacity=".7" />
      {/* เนิน */}
      <path d="M0 200c80-30 160-26 240-10s120 6 160-4v74H0Z" fill="#9eab8c" opacity=".55" />
      <path d="M0 222c100-18 220-10 400-6v44H0Z" fill="#768765" opacity=".6" />
      {/* ต้นไม้ */}
      <circle cx="58" cy="150" r="34" fill="#536446" />
      <circle cx="84" cy="168" r="24" fill="#768765" />
      <rect x="55" y="170" width="6" height="40" fill="#5f3f2a" />
      <circle cx="350" cy="160" r="26" fill="#536446" />
      <rect x="347" y="176" width="6" height="34" fill="#5f3f2a" />
      {/* บ้าน (ยกใต้ถุน) */}
      <g>
        <rect x="140" y="186" width="6" height="30" fill="#7c5235" />
        <rect x="254" y="186" width="6" height="30" fill="#7c5235" />
        <rect x="198" y="186" width="6" height="30" fill="#7c5235" />
        <rect x="128" y="120" width="144" height="70" rx="2" fill="#b5804f" />
        <g stroke="#9a6840" strokeWidth="2">
          <path d="M128 134h144M128 148h144M128 162h144M128 176h144" />
        </g>
        <rect x="150" y="138" width="30" height="26" fill="#463020" />
        <path d="M165 138v26M150 151h30" stroke="#c99d6f" strokeWidth="2" />
        <rect x="206" y="140" width="28" height="50" fill="#5f3f2a" />
        {/* หลังคาที่มีรอยชำรุด */}
        <path d="M112 124 200 72l88 52Z" fill="#646754" />
        <path d="M112 124 200 72l88 52" fill="none" stroke="#3a3c32" strokeWidth="4" strokeLinejoin="round" />
        <path d="M222 96l14 8-6 10-12-6Z" fill="#ecd9c1" />
        <path d="M168 100l10-4 4 8-10 4Z" fill="#ecd9c1" />
        {/* แผ่นหลังคาใหม่ที่กำลังซ่อม */}
        <rect x="238" y="80" width="40" height="10" rx="2" transform="rotate(-30 258 85)" fill="#dcbc98" stroke="#7c5235" strokeWidth="1.5" />
      </g>
      {/* หัวใจ */}
      <path d="M200 50s-14-8-14-18a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 10-14 18-14 18Z" fill="#2a3723" opacity=".85" />
    </svg>
  );
}

function pickFeatured(cases: RepairCase[]) {
  return cases.find((c) => c.status === "OPEN") ?? cases.find((c) => c.status === "IN_PROGRESS") ?? cases[0];
}

export default function RepairCaseSection() {
  const { data: cases, isLoading, isError, error, refetch } = useCases();
  const featured = cases ? pickFeatured(cases) : undefined;
  const { data: detail, isLoading: detailLoading } = useCase(featured?.id ?? 0);
  const others = (cases ?? []).filter((c) => c.id !== featured?.id && c.status !== "DONE").slice(0, 2);

  if (isError) return <ErrorBox message={error.message} onRetry={() => refetch()} />;
  if (isLoading) return <Skeleton className="h-72 rounded-[28px]" />;

  if (!featured) {
    return (
      <section className="rounded-[28px] border-2 border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
        <HomeIcon className="mx-auto h-10 w-10 text-sage-400" />
        <p className="mt-3 font-semibold text-forest-700">ยังไม่มีเคสที่รอความช่วยเหลือ</p>
        <p className="mt-1 text-sm text-stone-500">เมื่อมีเคสบ้านที่ต้องการซ่อมแซม จะแสดงที่นี่</p>
      </section>
    );
  }

  const materials = detail?.reservations.filter((r) => r.status !== "CANCELLED") ?? [];

  return (
    <section className="space-y-4">
      <article className="grid overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-stone-200/80 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative h-52 md:h-auto md:min-h-[280px]">
          <HouseIllustration />
          <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-r from-transparent to-white md:block" />
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-stone-500">เคสที่กำลังรอความช่วยเหลือ</p>
            <CaseStatusBadge status={featured.status} />
          </div>
          <h2 className="mt-2 text-xl font-bold text-forest-700 sm:text-2xl">{featured.title}</h2>
          <p className="mt-2 line-clamp-3 leading-relaxed text-stone-600">{featured.description}</p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <PinIcon className="h-4 w-4 text-forest-500" />
              {featured.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersIcon className="h-4 w-4 text-forest-500" />
              ช่างอาสา: {featured.volunteer?.name ?? "กำลังหาช่างอาสา"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-stone-500">วัสดุที่จองไว้:</span>
            {detailLoading ? (
              <Skeleton className="h-6 w-40 rounded-full" />
            ) : materials.length ? (
              materials.map((r) => (
                <span key={r.id} className="rounded-full bg-sand-100 px-3 py-1 text-xs font-medium text-sand-800">
                  {r.item?.title ?? `วัสดุ #${r.itemId}`} × {r.quantity}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-500">ยังไม่มีวัสดุ — ช่วยส่งต่อวัสดุได้</span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 md:mt-auto md:pt-6">
            <Link
              to={`/cases/${featured.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700"
            >
              ดูรายละเอียดเคส
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/cases" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-forest-700 ring-1 ring-forest-200 hover:bg-forest-50">
              ดูเคสทั้งหมด
            </Link>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((c) => (
            <Link
              key={c.id}
              to={`/cases/${c.id}`}
              className="flex items-center gap-4 rounded-2xl bg-white/70 p-4 ring-1 ring-stone-200/80 transition hover:bg-white hover:shadow-md"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sand-100 text-sand-700">
                <HomeIcon className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-stone-900">{c.title}</p>
                <p className="truncate text-xs text-stone-500">{c.location}</p>
              </div>
              <CaseStatusBadge status={c.status} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
