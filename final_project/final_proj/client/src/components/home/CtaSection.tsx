import { Link } from "react-router";
import { ArrowRightIcon, LeafIcon } from "./icons";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-forest-600 px-6 py-9 text-stone-50 sm:px-10">
      <LeafIcon className="absolute -left-4 -top-4 h-28 w-28 rotate-12 text-forest-500/60" />
      <svg viewBox="0 0 160 80" className="absolute -bottom-1 right-4 hidden h-24 w-48 text-forest-400/60 md:block" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M2 78h156" />
          <path d="M40 78V44l26-20 26 20v34M58 78V60h16v18" />
          <circle cx="122" cy="52" r="14" />
          <path d="M122 66v12M16 78V62M8 70l8-8 8 8" />
        </g>
      </svg>
      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:pr-48">
        <div className="md:pl-10">
          <h2 className="text-xl font-bold leading-snug sm:text-2xl">วัสดุที่คุณไม่ได้ใช้ อาจมีค่ามากสำหรับใครบางคน</h2>
          <p className="mt-2 text-sage-200">ร่วมเป็นส่วนหนึ่งในการส่งต่อวัสดุและสร้างสังคมแห่งการแบ่งปัน</p>
        </div>
        <Link
          to="/dashboard?new=1"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sand-300 px-6 py-3 font-semibold text-forest-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sand-200"
        >
          เริ่มบริจาควัสดุ
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
