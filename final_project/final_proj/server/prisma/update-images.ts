// อัปเดตรูปภาพของวัสดุที่มีอยู่แล้วในฐานข้อมูล โดยไม่ลบข้อมูลอื่น (ต่างจาก seed ที่ TRUNCATE ทุกตาราง)
// ใช้: npm run db:images
import { PrismaClient } from "@prisma/client";
import { itemImages } from "./item-images";

const prisma = new PrismaClient();

async function main() {
  let updated = 0;
  for (const [title, imageUrl] of Object.entries(itemImages)) {
    const r = await prisma.item.updateMany({ where: { title }, data: { imageUrl } });
    updated += r.count;
  }
  console.log(`Updated images for ${updated} items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
