-- เปลี่ยนพิกัด lat/lng เป็นที่อยู่แบบไทย (จังหวัด / เขต-อำเภอ / แขวง-ตำบล / รายละเอียด) + จุดรับของ
ALTER TABLE "Item"
  ADD COLUMN "province" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "district" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "subdistrict" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "addressDetail" TEXT NOT NULL DEFAULT '',
  ALTER COLUMN "pickupAddress" SET DEFAULT '';

-- ย้ายข้อมูลเดิมจาก seed (pickupAddress เดิมเก็บ "เขต... จังหวัด") มาลงช่องใหม่
UPDATE "Item" SET "subdistrict" = 'บางนาเหนือ', "district" = 'บางนา', "province" = 'กรุงเทพมหานคร', "addressDetail" = '12/3 ซอยสุขุมวิท 105', "pickupAddress" = 'หน้าบ้าน ประตูรั้วสีเขียว (โทรนัดก่อนรับ)' WHERE "pickupAddress" = 'เขตบางนา กรุงเทพฯ';
UPDATE "Item" SET "subdistrict" = 'จรเข้บัว', "district" = 'ลาดพร้าว', "province" = 'กรุงเทพมหานคร', "addressDetail" = '88 ซอยลาดพร้าว 101', "pickupAddress" = 'โกดังหลังบ้าน เปิด 09:00-17:00' WHERE "pickupAddress" = 'เขตลาดพร้าว กรุงเทพฯ';
UPDATE "Item" SET "subdistrict" = 'ตลาดพลู', "district" = 'ธนบุรี', "province" = 'กรุงเทพมหานคร', "addressDetail" = '45 ถนนเทอดไท', "pickupAddress" = 'ร้านวัสดุก่อสร้าง ติดต่อพนักงานหน้าร้าน' WHERE "pickupAddress" = 'เขตธนบุรี กรุงเทพฯ';
UPDATE "Item" SET "subdistrict" = 'บางกระสอ', "district" = 'เมืองนนทบุรี', "province" = 'นนทบุรี', "addressDetail" = '199/7 ถนนรัตนาธิเบศร์', "pickupAddress" = 'ลานจอดรถหน้าคอนโด แจ้ง รปภ. ก่อนเข้า' WHERE "pickupAddress" = 'อ.เมือง จ.นนทบุรี';
UPDATE "Item" SET "subdistrict" = 'หัวหมาก', "district" = 'บางกะปิ', "province" = 'กรุงเทพมหานคร', "addressDetail" = '32 ซอยรามคำแหง 24', "pickupAddress" = 'ไซต์งานรีโนเวท ติดต่อหัวหน้าช่าง' WHERE "pickupAddress" = 'เขตบางกะปิ กรุงเทพฯ';
UPDATE "Item" SET "subdistrict" = 'บางหญ้าแพรก', "district" = 'พระประแดง', "province" = 'สมุทรปราการ', "addressDetail" = '7 ถนนสุขสวัสดิ์', "pickupAddress" = 'ใต้ถุนบ้าน (มีที่จอดรถกระบะ)' WHERE "pickupAddress" = 'อ.พระประแดง จ.สมุทรปราการ';

ALTER TABLE "Item" DROP COLUMN "lat", DROP COLUMN "lng";
