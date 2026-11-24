import { Link } from "react-router";
import { itemImages, onImgError } from "../../lib/itemImages";
import { LeafIcon, PlusCircleIcon, SearchIcon } from "./icons";

// ภาพวัสดุจริงจากระบบ (ไม้ / สี / กระเบื้อง / น็อตสกรู)
const photos = {
  wood: { src: itemImages["ไม้โครง 1x2 นิ้ว ยาว 2 เมตร"], alt: "ไม้โครงเหลือใช้" },
  paint: { src: itemImages["สีน้ำมันสีเขียว"], alt: "สีทาผนัง" },
  tile: { src: itemImages["กระเบื้องหลังคาลอนคู่"], alt: "กระเบื้อง" },
  screw: { src: itemImages["น็อตสตัดพร้อมแหวน M10"], alt: "น็อตและสกรู" },
};

function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative min-h-0 overflow-hidden rounded-2xl shadow-[0_12px_30px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${className}`}>
      <img src={src} alt={alt} onError={onImgError} className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-forest-600 text-stone-50 shadow-[0_20px_50px_-25px_rgba(26,35,22,0.6)]">
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* ข้อความ */}
        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-forest-500/40 px-3 py-1 text-xs font-medium text-sand-200 ring-1 ring-forest-400/40 sm:text-sm">
            <LeafIcon className="h-4 w-4 text-forest-200" />
            ส่งต่อวัสดุ สร้างโอกาสใหม่
          </p>
          <h1 className="mt-5 text-[1.85rem] font-bold leading-[1.35] tracking-tight sm:text-4xl lg:text-[2.6rem]">
            ของเหลือจากบ้านคุณ
            <br />
            <span className="text-sand-300">อาจเป็นบ้านหลังใหม่</span>
            <br />
            ที่ปลอดภัยของใครอีกคน
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-sage-200 sm:text-base">
            เปลี่ยนเศษวัสดุก่อสร้างที่ไม่ได้ใช้งาน ให้กลายเป็นโอกาสในการซ่อมแซมบ้านแก่ผู้สูงอายุและครอบครัวผู้ยากไร้
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard?new=1"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sand-300 px-6 py-3 font-semibold text-forest-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sand-200"
            >
              <PlusCircleIcon className="h-5 w-5" />
              ส่งต่อวัสดุ
            </Link>
            <Link
              to="/items"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-100/70 px-6 py-3 font-semibold text-stone-50 transition hover:bg-stone-50/10"
            >
              <SearchIcon className="h-5 w-5" />
              ค้นหาวัสดุ
            </Link>
          </div>
        </div>

        {/* ภาพ: คอลลาจวัสดุจริง */}
        <div className="relative self-center px-6 pb-12 sm:px-10 lg:py-10 lg:pl-0 lg:pr-10">
          <div className="grid h-[280px] grid-cols-6 grid-rows-6 gap-3 sm:h-[360px] lg:h-[400px]">
            <Photo {...photos.wood} className="col-span-4 row-span-4" />
            <Photo {...photos.paint} className="col-span-2 row-span-3" />
            <Photo {...photos.tile} className="col-span-2 row-span-3" />
            <Photo {...photos.screw} className="col-span-4 row-span-2" />
          </div>
          <p className="absolute bottom-16 right-10 rotate-[-6deg] rounded-xl bg-forest-800/70 px-4 py-2 text-right text-base font-semibold leading-snug text-stone-50 backdrop-blur-sm sm:right-14 sm:text-lg lg:bottom-14 lg:right-14">
            วัสดุเหลือใช้
            <br />
            <span className="text-sand-200">…ยังมีคุณค่าเสมอ</span>
            <svg viewBox="0 0 120 10" className="ml-auto mt-0.5 h-2 w-24 text-sand-300" aria-hidden="true">
              <path d="M2 7c30-6 70-6 116-2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </p>
        </div>
      </div>

      {/* คลื่นด้านล่าง */}
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-px left-0 h-8 w-full text-sage-300/40" aria-hidden="true">
        <path d="M0 40C200 10 400 60 650 35S1050 10 1200 30V60H0Z" fill="currentColor" />
      </svg>
    </section>
  );
}
