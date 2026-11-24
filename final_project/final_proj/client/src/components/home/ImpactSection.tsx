import { HomeIcon, LeafIcon, RecycleIcon, UsersIcon } from "./icons";

const impacts = [
  { icon: RecycleIcon, text: "ลดปริมาณขยะจากการก่อสร้าง" },
  { icon: HomeIcon, text: "ช่วยให้ผู้สูงอายุและผู้ยากไร้มีบ้านที่ปลอดภัย" },
  { icon: UsersIcon, text: "สนับสนุนช่างอาสาในชุมชน" },
  { icon: LeafIcon, text: "ใช้ทรัพยากรอย่างคุ้มค่าเพื่อสิ่งแวดล้อม" },
];

export default function ImpactSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
      <h2 className="text-xl font-bold leading-snug text-forest-700 sm:text-2xl">
        การแบ่งปันของคุณ
        <br />
        สร้างผลลัพธ์ที่ยิ่งใหญ่ได้
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-0 md:divide-x md:divide-stone-300/70">
        {impacts.map((it) => (
          <li key={it.text} className="flex flex-col items-center gap-3 rounded-2xl bg-white/60 p-4 text-center md:rounded-none md:bg-transparent md:px-4 md:py-2">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-50 text-forest-600">
              <it.icon className="h-6 w-6" />
            </span>
            <p className="text-sm leading-relaxed text-stone-600">{it.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
