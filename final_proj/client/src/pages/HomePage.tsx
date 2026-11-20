import { Link } from "react-router";
import { useStats } from "../api/hooks";
import ErrorBox from "../components/ErrorBox";
import { Skeleton } from "../components/Skeleton";

export default function HomePage() {
  const { data, isLoading, isError, error, refetch } = useStats();

  const cards = data
    ? [
        ["วัสดุทั้งหมด", data.totalItems],
        ["พร้อมให้จอง", data.availableItems],
        ["เคสที่รอซ่อม", data.openCases],
        ["ซ่อมเสร็จแล้ว", data.doneCases],
        ["จองทั้งหมด", data.totalReservations],
        ["รับของไปใช้จริง", data.pickedUp],
      ]
    : [];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-emerald-600 px-6 py-10 text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">เศษวัสดุเหลือใช้ของคุณ คือบ้านที่ปลอดภัยของใครบางคน</h1>
        <p className="mt-2 max-w-2xl text-emerald-50">
          ส่งต่อกระเบื้อง สี ไม้ และอุปกรณ์ที่เหลือจากงานก่อสร้าง ให้ช่างอาสานำไปซ่อมแซมบ้านของผู้สูงอายุและผู้ยากไร้ในชุมชน
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/items" className="rounded-lg bg-white px-4 py-2 font-medium text-emerald-700">
            ดูวัสดุที่มี
          </Link>
          <Link to="/dashboard" className="rounded-lg border border-white px-4 py-2">
            ลงประกาศบริจาค
          </Link>
        </div>
      </section>

      {isError ? (
        <ErrorBox message={error.message} onRetry={() => refetch()} />
      ) : (
        <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-24" />)
            : cards.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-stone-200 bg-white p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-700">{value}</p>
                  <p className="text-sm text-stone-500">{label}</p>
                </div>
              ))}
        </section>
      )}
    </div>
  );
}
