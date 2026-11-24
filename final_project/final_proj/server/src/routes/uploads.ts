import express, { Router } from "express";
import { HttpError, asyncHandler, parseId } from "../lib/http";
import { prisma } from "../lib/prisma";

// อัปโหลดรูปภาพ: ส่งไฟล์เป็น body ตรง ๆ (Content-Type: image/jpeg|png|webp) เก็บลงตาราง Upload ใน Postgres
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const router = Router();

router.post(
  "/",
  express.raw({ type: () => true, limit: MAX_UPLOAD_BYTES }),
  asyncHandler(async (req, res) => {
    const mimeType = (req.headers["content-type"] ?? "").split(";")[0].trim();
    if (!ALLOWED.includes(mimeType)) throw new HttpError(400, "รองรับเฉพาะไฟล์ JPG, PNG หรือ WEBP");
    const data = req.body as Buffer;
    if (!Buffer.isBuffer(data) || data.length === 0) throw new HttpError(400, "ไม่พบไฟล์รูปภาพ");
    const upload = await prisma.upload.create({
      data: { mimeType, size: data.length, data: new Uint8Array(data) },
      select: { id: true },
    });
    res.status(201).json({ id: upload.id, url: `/api/uploads/${upload.id}` });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const upload = await prisma.upload.findUnique({ where: { id: parseId(req.params.id) } });
    if (!upload) throw new HttpError(404, "ไม่พบรูปภาพ");
    res.set("Content-Type", upload.mimeType);
    res.set("Cache-Control", "public, max-age=31536000, immutable"); // รูปแต่ละ id ไม่เปลี่ยนแล้ว
    res.send(Buffer.from(upload.data));
  }),
);

export default router;

// ลบรูปที่อัปโหลดไว้ เมื่อวัสดุถูกลบหรือเปลี่ยนรูปใหม่ (ไม่ให้มีไฟล์ค้างในฐานข้อมูล)
export async function deleteUploadByUrl(url: string | null | undefined) {
  const m = url?.match(/^\/api\/uploads\/(\d+)$/);
  if (m) await prisma.upload.deleteMany({ where: { id: Number(m[1]) } });
}
