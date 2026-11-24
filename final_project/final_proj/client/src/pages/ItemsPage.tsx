import { useDeferredValue } from "react";
import { useCategories, useItems } from "../api/hooks";
import ErrorBox from "../components/ErrorBox";
import ItemCard from "../components/ItemCard";
import { CardGridSkeleton } from "../components/Skeleton";
import { useUiStore } from "../stores/uiStore";

const field = "rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm";

export default function ItemsPage() {
  const { search, categoryId, status, setSearch, setCategoryId, setStatus, resetFilters } = useUiStore();
  const deferredSearch = useDeferredValue(search);
  const { data: categories } = useCategories();
  const { data: items, isLoading, isError, error, refetch } = useItems({ search: deferredSearch, categoryId, status });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">วัสดุเหลือใช้ที่รอส่งต่อ</h1>

      <div className="grid gap-2 sm:grid-cols-4">
        <input className={`${field} sm:col-span-2`} placeholder="ค้นหาวัสดุ..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={field} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">ทุกหมวดหมู่</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">ทุกสถานะ</option>
          <option value="AVAILABLE">พร้อมให้จอง</option>
          <option value="RESERVED">ถูกจองหมดแล้ว</option>
          <option value="USED">ใช้แล้ว</option>
        </select>
      </div>

      {isLoading ? (
        <CardGridSkeleton />
      ) : isError ? (
        <ErrorBox message={error.message} onRetry={() => refetch()} />
      ) : items && items.length > 0 ? (
        <>
          <p className="text-sm text-stone-500">พบ {items.length} รายการ</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
          ไม่พบวัสดุตามเงื่อนไข{" "}
          <button className="text-forest-700 underline" onClick={resetFilters}>
            ล้างตัวกรอง
          </button>
        </div>
      )}
    </div>
  );
}
