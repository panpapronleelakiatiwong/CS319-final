-- รหัสไปรษณีย์ของที่อยู่รับของ
ALTER TABLE "Item" ADD COLUMN "postalCode" TEXT NOT NULL DEFAULT '';

-- เติมรหัสไปรษณีย์ให้ข้อมูลเดิม
UPDATE "Item" SET "postalCode" = '10260' WHERE "subdistrict" = 'บางนาเหนือ' AND "postalCode" = '';
UPDATE "Item" SET "postalCode" = '10230' WHERE "subdistrict" = 'จรเข้บัว' AND "postalCode" = '';
UPDATE "Item" SET "postalCode" = '10600' WHERE "subdistrict" = 'ตลาดพลู' AND "postalCode" = '';
UPDATE "Item" SET "postalCode" = '11000' WHERE "subdistrict" = 'บางกระสอ' AND "postalCode" = '';
UPDATE "Item" SET "postalCode" = '10240' WHERE "subdistrict" = 'หัวหมาก' AND "postalCode" = '';
UPDATE "Item" SET "postalCode" = '10130' WHERE "subdistrict" = 'บางหญ้าแพรก' AND "postalCode" = '';
