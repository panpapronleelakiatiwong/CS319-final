import { Link } from "react-router";
import { useItems } from "../../api/hooks";
import { FALLBACK_IMG, getItemImage, onImgError } from "../../lib/itemImages";
import type { Item } from "../../types";
import ErrorBox from "../ErrorBox";
import { CardSkeleton } from "../Skeleton";
import { ItemStatusBadge } from "../StatusBadge";
import { ArrowRightIcon, BoxIcon } from "./icons";

// เลือกวัสดุตัวอย่างให้หลากหลาย: หมวดละ 1 ชิ้นก่อน แล้วค่อยเติมให้ครบ
function pickFeatured(items: Item[], count: number): Item[] {
  const byCategory = new Map<number, Item>();
  for (const it of items) if (!byCategory.has(it.categoryId)) byCategory.set(it.categoryId, it);
  const picked = [...byCategory.values()].slice(0, count);
  for (const it of items) {
    if (picked.length >= count) break;
    if (!picked.includes(it)) picked.push(it);
  }
  return picked;
}

function MaterialCard({ item }: { item: Item }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={getItemImage(item) || FALLBACK_IMG}
          alt={item.title}
          loading="lazy"
          onError={onImgError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {item.category && (
          <span className="absolute left-2.5 top-2.5 max-w-[85%] truncate rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-forest-700 backdrop-blur">
            {item.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-stone-900 sm:text-base">{item.title}</h3>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-stone-500 sm:text-sm">
            เหลือ <b className="text-forest-700">{item.quantity}</b> {item.unit}
          </p>
          <ItemStatusBadge status={item.status} />
        </div>
        <span className="mt-3 inline-flex items-center justify-center gap-1 rounded-lg bg-forest-50 py-2 text-xs font-medium text-forest-700 transition group-hover:bg-forest-600 group-hover:text-white sm:text-sm">
          ดูรายละเอียด
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function MaterialsSection() {
  const { data, isLoading, isError, error, refetch } = useItems({ status: "AVAILABLE" });
  const featured = data ? pickFeatured(data, 4) : [];

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-forest-700 sm:text-2xl">
          <BoxIcon className="h-6 w-6" />
          วัสดุที่กำลังเปิดรับบริจาค
        </h2>
        <Link to="/items" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-800 hover:underline">
          ดูวัสดุทั้งหมด
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {isError ? (
        <ErrorBox message={error.message} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : featured.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
          <BoxIcon className="mx-auto h-10 w-10 text-sage-400" />
          <p className="mt-3 font-semibold text-forest-700">ยังไม่มีวัสดุที่พร้อมให้จองในตอนนี้</p>
          <p className="mt-1 text-sm text-stone-500">เป็นคนแรกที่ส่งต่อวัสดุเหลือใช้ให้ชุมชน</p>
          <Link to="/dashboard?new=1" className="mt-4 inline-block rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-700">
            ลงประกาศวัสดุ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((it) => (
            <MaterialCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </section>
  );
}
