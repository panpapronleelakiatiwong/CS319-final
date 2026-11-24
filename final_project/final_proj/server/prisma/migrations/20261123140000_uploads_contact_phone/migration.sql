-- เบอร์โทรติดต่อของแต่ละประกาศ (เติมจากเบอร์ผู้บริจาคเดิม)
ALTER TABLE "Item" ADD COLUMN "contactPhone" TEXT NOT NULL DEFAULT '';
UPDATE "Item" i SET "contactPhone" = u."phone" FROM "User" u WHERE i."donorId" = u."id" AND u."phone" IS NOT NULL;

-- ตารางเก็บรูปภาพที่อัปโหลด
CREATE TABLE "Upload" (
    "id" SERIAL NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);
