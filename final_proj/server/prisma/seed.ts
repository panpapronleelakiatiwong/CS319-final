import { CaseStatus, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

type Row = [title: string, cat: number, qty: number, unit: string, condition: string, spec: string];

const categories = ["สีและเคมีภัณฑ์", "ไม้และโครงสร้าง", "กระเบื้องและวัสดุปูพื้น", "อุปกรณ์ฮาร์ดแวร์"];

const rows: Row[] = [
  ["สีน้ำอะคริลิกสีขาว", 1, 3, "ลิตร", "ดี (เปิดแล้ว)", "กระป๋อง 3.5 ลิตร เหลือประมาณ 3 ลิตร ใช้ทาภายใน"],
  ["สีทาภายนอกสีครีม", 1, 8, "ลิตร", "ดี (ไม่เคยเปิด)", "กระป๋อง 9 ลิตร ทนแดดทนฝน"],
  ["สีรองพื้นปูนใหม่", 1, 4, "ลิตร", "ดี", "รองพื้นปูนกันด่าง ก่อนทาสีทับหน้า"],
  ["สีน้ำมันสีเขียว", 1, 1, "ลิตร", "พอใช้", "ใช้กับเหล็กและไม้ เหลือครึ่งกระป๋อง"],
  ["สีกันสนิมสีแดง", 1, 2, "ลิตร", "ดี", "ทาเหล็กโครงหลังคาหรือรั้วเหล็ก"],
  ["น้ำยากันซึมทาดาดฟ้า", 1, 5, "กก.", "ดี", "ชนิดยืดหยุ่น ใช้ซ่อมรอยรั่วซึม"],
  ["แปรงและลูกกลิ้งทาสี", 1, 6, "ชิ้น", "ใช้แล้วล้างสะอาด", "คละขนาด 2-4 นิ้ว"],
  ["ทินเนอร์ผสมสี", 1, 2, "ลิตร", "ดี", "ใช้ผสมสีน้ำมันและล้างอุปกรณ์"],
  ["ไม้โครง 1x2 นิ้ว ยาว 2 เมตร", 2, 12, "เส้น", "ดี", "ไม้เนื้อแข็ง ผ่านการอบแห้ง"],
  ["ไม้โครง 2x4 นิ้ว ยาว 3 เมตร", 2, 6, "เส้น", "ดี", "ใช้ทำโครงฝาและโครงหลังคา"],
  ["แผ่นไม้อัดหนา 10 มม.", 2, 4, "แผ่น", "ดี", "ขนาด 120x240 ซม. มีรอยตัดเล็กน้อย"],
  ["ไม้พื้นลามิเนต", 2, 15, "แผ่น", "ดี", "ลายไม้โอ๊ค แผ่นละ 20x120 ซม."],
  ["ไม้ระแนง 1x1 นิ้ว", 2, 20, "เส้น", "พอใช้", "ยาว 1.5-2 เมตร คละความยาว"],
  ["แผ่นสมาร์ทบอร์ด 6 มม.", 2, 5, "แผ่น", "ดี", "ใช้ทำฝาผนังหรือฝ้าเพดาน"],
  ["ประตูไม้บานเปลือย", 2, 1, "บาน", "ดี", "ขนาด 80x200 ซม."],
  ["กรอบหน้าต่างไม้พร้อมบาน", 2, 2, "ชุด", "พอใช้", "ขนาด 90x110 ซม. ยังไม่ใส่กระจก"],
  ["กระเบื้องพื้น 60x60 สีเทา", 3, 3, "แผ่น", "ดี", "เหลือจากงานรีโนเวทคอนโด"],
  ["กระเบื้องห้องน้ำ 30x60 สีขาว", 3, 10, "แผ่น", "ดี", "ผิวเงา กันลื่นระดับ R9"],
  ["กระเบื้องหลังคาลอนคู่", 3, 14, "แผ่น", "ดี", "สีแดงอิฐ ไม่มีรอยร้าว"],
  ["กระเบื้องยางลายไม้", 3, 18, "แผ่น", "ดี", "ติดตั้งแบบกาวในตัว"],
  ["กระเบื้องโมเสกผนัง", 3, 6, "แผ่น", "ดี", "แผ่นละ 30x30 ซม."],
  ["ปูนกาวกระเบื้อง", 3, 2, "ถุง", "ดี", "ถุง 20 กก. ยังไม่เปิด"],
  ["ยาแนวกระเบื้องสีขาว", 3, 3, "ถุง", "ดี", "ถุง 1 กก."],
  ["สกรูเกลียวปล่อย 1.5 นิ้ว", 4, 200, "ตัว", "ดี", "หัวแฉก ใช้ยึดไม้และแผ่นยิปซัม"],
  ["น็อตสตัดพร้อมแหวน M10", 4, 40, "ชุด", "ดี", "ยาว 10 ซม. ชุบกัลวาไนซ์"],
  ["ตะปูตอกไม้ 2 นิ้ว", 4, 1, "กก.", "ดี", "ตะปูเหล็กเกลียว"],
  ["บานพับประตูสแตนเลส", 4, 8, "ตัว", "ดี", "ขนาด 4 นิ้ว"],
  ["ท่อพีวีซี 1/2 นิ้ว ยาว 4 เมตร", 4, 5, "เส้น", "ดี", "ชั้นคุณภาพ 8.5"],
  ["สายไฟ VAF 2x1.5", 4, 20, "เมตร", "ดี", "ม้วนเหลือจากงานเดินไฟ"],
  ["ก๊อกน้ำสนามทองเหลือง", 4, 3, "ตัว", "ดี", "เกลียว 1/2 นิ้ว"],
];

const areas = ["เขตบางนา กรุงเทพฯ", "เขตลาดพร้าว กรุงเทพฯ", "เขตธนบุรี กรุงเทพฯ", "อ.เมือง จ.นนทบุรี", "เขตบางกะปิ กรุงเทพฯ", "อ.พระประแดง จ.สมุทรปราการ"];

async function main() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Reservation","RepairCase","Item","Category","User" RESTART IDENTITY CASCADE',
  );

  await prisma.category.createMany({ data: categories.map((name) => ({ name })) });

  await prisma.user.createMany({
    data: [
      { name: "สมชาย ใจดี", email: "somchai@example.com", phone: "081-111-1111", role: Role.DONOR },
      { name: "วิภา รักษ์โลก", email: "wipa@example.com", phone: "081-222-2222", role: Role.DONOR },
      { name: "ร้านวัสดุเจริญชัย", email: "charoen@example.com", phone: "02-333-3333", role: Role.DONOR },
      { name: "ช่างบุญ อาสา", email: "boon@example.com", phone: "089-444-4444", role: Role.VOLUNTEER },
      { name: "ช่างนภา ซ่อมสุข", email: "napa@example.com", phone: "089-555-5555", role: Role.VOLUNTEER },
      { name: "ผู้ดูแลระบบ", email: "admin@example.com", role: Role.ADMIN },
    ],
  });

  await prisma.item.createMany({
    data: rows.map(([title, cat, qty, unit, condition, spec], i) => ({
      title,
      description: `${title} เหลือจากงานก่อสร้าง/รีโนเวท พร้อมส่งต่อให้ช่างอาสา`,
      spec,
      quantity: qty,
      unit,
      condition,
      imageUrl: `https://picsum.photos/seed/material${i + 1}/600/400`,
      pickupAddress: areas[i % areas.length],
      lat: 13.65 + (i % 10) * 0.012,
      lng: 100.5 + (i % 7) * 0.012,
      categoryId: cat,
      donorId: (i % 3) + 1,
    })),
  });

  await prisma.repairCase.createMany({
    data: [
      { title: "ซ่อมหลังคารั่วบ้านคุณยายสำลี", ownerName: "ยายสำลี แก้วใส", location: "ชุมชนคลองเตย กรุงเทพฯ", description: "หลังคากระเบื้องแตกหลายแผ่น ฝนตกน้ำรั่วเข้าห้องนอน", volunteerId: 4 },
      { title: "ทาสีและเปลี่ยนพื้นห้องน้ำ", ownerName: "ตาสมศักดิ์ ดีงาม", location: "ชุมชนบางกอกน้อย กรุงเทพฯ", description: "ผนังชื้นเป็นรา พื้นห้องน้ำแตกลื่น", volunteerId: 5 },
      { title: "เปลี่ยนประตูและบานพับ", ownerName: "ป้าจันทร์ เรืองศรี", location: "ชุมชนบางกะปิ กรุงเทพฯ", description: "ประตูหน้าบ้านผุพัง ล็อกไม่ได้", volunteerId: 4 },
      { title: "ซ่อมฝาผนังไม้", ownerName: "ลุงมานะ ใจเย็น", location: "อ.พระประแดง จ.สมุทรปราการ", description: "ฝาไม้ผุทะลุหลายจุด", volunteerId: 5 },
      { title: "ต่อเติมกันสาดบ้านผู้สูงอายุ", ownerName: "ยายบัว ทองคำ", location: "อ.เมือง จ.นนทบุรี", description: "ไม่มีกันสาด ฝนสาดเข้าบ้าน", volunteerId: null },
      { title: "เดินท่อน้ำและเปลี่ยนก๊อก", ownerName: "ตาหวัง สุขสบาย", location: "เขตลาดพร้าว กรุงเทพฯ", description: "ท่อรั่วและก๊อกน้ำพัง", volunteerId: null },
      { title: "ปูพื้นห้องนั่งเล่น", ownerName: "ป้าสุดา ใจงาม", location: "เขตบางนา กรุงเทพฯ", description: "พื้นปูนแตกร้าวเป็นหลุม", volunteerId: 4, status: CaseStatus.DONE },
      { title: "ซ่อมรั้วเหล็กและทาสีกันสนิม", ownerName: "ลุงเก่ง มั่นคง", location: "เขตธนบุรี กรุงเทพฯ", description: "รั้วเหล็กขึ้นสนิมผุกร่อน", volunteerId: null },
    ],
  });

  // การจองตัวอย่าง (ตัดจำนวนคงเหลือให้สอดคล้องกัน)
  const reservations: [itemId: number, caseId: number, qty: number][] = [
    [19, 1, 10], [18, 2, 6], [1, 2, 2], [9, 4, 6], [15, 3, 1], [27, 3, 4], [17, 7, 3], [5, 8, 2],
  ];
  for (const [itemId, caseId, quantity] of reservations) {
    const item = await prisma.item.findUniqueOrThrow({ where: { id: itemId } });
    const remaining = item.quantity - quantity;
    await prisma.item.update({
      where: { id: itemId },
      data: {
        quantity: remaining,
        status: remaining === 0 ? (caseId === 7 ? "USED" : "RESERVED") : "AVAILABLE",
      },
    });
    await prisma.reservation.create({
      data: { itemId, caseId, quantity, status: caseId === 7 ? "PICKED_UP" : "RESERVED" },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
