import { useStats } from "../../api/hooks";
import ErrorBox from "../ErrorBox";
import { Skeleton } from "../Skeleton";
import { BoxIcon, CalendarIcon, CheckCircleIcon, HeartHandIcon, HomeIcon, WrenchIcon } from "./icons";

// ภาพลายเส้นเมือง + ต้นไม้ (ตกแต่ง)
function CityIllustration() {
  return (
    <svg viewBox="0 0 220 70" className="h-auto w-full max-w-[220px] text-forest-300" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M2 66h216" />
        <path d="M40 66V30h18v36M44 36h4M52 36h2M44 44h4M52 44h2M44 52h4M52 52h2" />
        <path d="M62 66V18h22v48M67 24h4M75 24h4M67 32h4M75 32h4M67 40h4M75 40h4M67 48h4M75 48h4" />
        <path d="M88 66V38l12-8 12 8v28M96 66v-9h8v9" />
        <path d="M116 66V24h16v42M120 30h3M126 30h3M120 38h3M126 38h3M120 46h3M126 46h3" />
        <path d="M136 66V42h24v24M141 48h5M150 48h5M141 56h5M150 56h5" />
      </g>
      <g fill="currentColor" opacity=".55">
        <circle cx="16" cy="50" r="10" />
        <circle cx="28" cy="56" r="7" />
        <circle cx="176" cy="48" r="11" />
        <circle cx="192" cy="55" r="8" />
        <circle cx="206" cy="58" r="6" />
      </g>
      <g stroke="currentColor" strokeWidth="1.4">
        <path d="M16 60v6M28 62v4M176 59v7M192 63v3" />
      </g>
    </svg>
  );
}

export default function StatsSection() {
  const { data, isLoading, isError, error, refetch } = useStats();

  // การ์ดสถิติเดิมทั้ง 6 ใบ (ข้อมูลจาก /api/stats)
  const cards = data
    ? [
        { label: "วัสดุทั้งหมด", value: data.totalItems, icon: BoxIcon },
        { label: "พร้อมให้จอง", value: data.availableItems, icon: CheckCircleIcon },
        { label: "เคสที่รอซ่อม", value: data.openCases, icon: HomeIcon },
        { label: "ซ่อมเสร็จแล้ว", value: data.doneCases, icon: WrenchIcon },
        { label: "จองทั้งหมด", value: data.totalReservations, icon: CalendarIcon },
        { label: "รับของไปใช้จริง", value: data.pickedUp, icon: HeartHandIcon },
      ]
    : [];

  return (
    <section className="grid gap-6 rounded-[28px] border border-stone-200/80 bg-sand-50/70 p-5 shadow-sm sm:p-7 lg:grid-cols-[240px_1fr] lg:items-center">
      <div className="flex items-end justify-between gap-4 lg:flex-col lg:items-start">
        <h2 className="text-xl font-bold leading-snug text-forest-700 sm:text-2xl">
          ผลลัพธ์จากการแบ่งปัน
          <br />
          ที่สร้างการเปลี่ยนแปลง
        </h2>
        <div className="hidden w-40 sm:block lg:w-full">
          <CityIllustration />
        </div>
      </div>

      {isError ? (
        <ErrorBox message={error.message} onRetry={() => refetch()} />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)
            : cards.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-md sm:gap-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-600 text-sand-200 sm:h-12 sm:w-12">
                    <c.icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold leading-none text-forest-700 sm:text-[1.75rem]">{c.value.toLocaleString("th-TH")}</p>
                    <p className="mt-1.5 text-xs leading-snug text-stone-500 sm:text-sm">{c.label}</p>
                  </div>
                </div>
              ))}
        </div>
      )}
    </section>
  );
}
