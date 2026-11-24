import { ChevronRightIcon, HomeIcon, LeafIcon, PlusCircleIcon, SearchIcon } from "./icons";

const steps = [
  {
    title: "ผู้บริจาคส่งต่อวัสดุ",
    desc: "ลงประกาศวัสดุที่เหลือจากการก่อสร้างหรือรีโนเวท",
    icon: PlusCircleIcon,
  },
  {
    title: "ช่างอาสาค้นหาและจองวัสดุ",
    desc: "เลือกวัสดุที่ต้องการนำไปใช้ซ่อมแซมบ้าน",
    icon: SearchIcon,
  },
  {
    title: "นำวัสดุไปซ่อมแซมบ้าน",
    desc: "ส่งต่อวัสดุเพื่อสร้างบ้านที่ปลอดภัยให้กับผู้ที่ต้องการความช่วยเหลือ",
    icon: HomeIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative grid gap-8 lg:grid-cols-[230px_1fr] lg:items-center">
      <div className="relative">
        <h2 className="text-2xl font-bold text-forest-700 sm:text-[1.7rem]">ส่งต่อวัสดุอย่างไร?</h2>
        <p className="mt-1 text-stone-500">ง่าย ๆ ใน 3 ขั้นตอน</p>
        <LeafIcon className="mt-4 hidden h-16 w-16 text-sage-300 lg:block" />
      </div>

      <ol className="grid gap-4 sm:grid-cols-3 sm:gap-2">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex sm:block">
            <div className="flex flex-1 items-start gap-4 rounded-2xl bg-white/60 p-4 sm:flex-col sm:items-center sm:bg-transparent sm:p-2 sm:text-center">
              <div className="relative shrink-0">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-sand-100 text-forest-600 ring-8 ring-sand-50 sm:h-20 sm:w-20">
                  <s.icon className="h-8 w-8 sm:h-9 sm:w-9" />
                </span>
                <span className="absolute -left-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-forest-500 text-sm font-bold text-white shadow">
                  {i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-forest-800 sm:mt-3">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">{s.desc}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <ChevronRightIcon className="absolute -right-3 top-9 hidden h-5 w-5 text-stone-400 sm:block" />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
