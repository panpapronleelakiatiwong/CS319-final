import { Router } from "express";
import { HttpError, asyncHandler, parseId } from "../lib/http";
import { prisma } from "../lib/prisma";
import { reservationSchema } from "../schemas";

const router = Router();
const include = { item: true, repairCase: true };

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.reservation.findMany({ include, orderBy: { createdAt: "desc" } }));
  }),
);

// จองวัสดุให้เคส: ตัดจำนวนคงเหลือทันทีภายใน transaction
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = reservationSchema.parse(req.body);
    const created = await prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { id: data.itemId } });
      if (!item) throw new HttpError(404, "ไม่พบวัสดุ");
      const repairCase = await tx.repairCase.findUnique({ where: { id: data.caseId } });
      if (!repairCase) throw new HttpError(404, "ไม่พบเคสซ่อมบ้าน");
      if (item.status === "USED" || item.quantity < data.quantity) {
        throw new HttpError(409, `วัสดุคงเหลือไม่พอ (เหลือ ${item.quantity} ${item.unit})`);
      }
      const dup = await tx.reservation.findUnique({
        where: { itemId_caseId: { itemId: data.itemId, caseId: data.caseId } },
      });
      if (dup) throw new HttpError(409, "เคสนี้จองวัสดุชิ้นนี้ไว้แล้ว");

      const remaining = item.quantity - data.quantity;
      await tx.item.update({
        where: { id: item.id },
        data: { quantity: remaining, status: remaining === 0 ? "RESERVED" : item.status },
      });
      if (repairCase.status === "OPEN") {
        await tx.repairCase.update({ where: { id: repairCase.id }, data: { status: "IN_PROGRESS" } });
      }
      return tx.reservation.create({ data, include });
    });
    res.status(201).json(created);
  }),
);

// ช่างมารับของจริง: เปลี่ยนสถานะเป็น PICKED_UP และปิดสต็อกเมื่อของหมดและไม่มีการจองค้าง
router.patch(
  "/:id/pickup",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const result = await prisma.$transaction(async (tx) => {
      const r = await tx.reservation.findUnique({ where: { id } });
      if (!r) throw new HttpError(404, "ไม่พบรายการจอง");
      if (r.status !== "RESERVED") throw new HttpError(409, "รายการนี้ไม่อยู่ในสถานะรอรับของ");
      const updated = await tx.reservation.update({ where: { id }, data: { status: "PICKED_UP" }, include });
      const pending = await tx.reservation.count({ where: { itemId: r.itemId, status: "RESERVED" } });
      if (updated.item.quantity === 0 && pending === 0) {
        await tx.item.update({ where: { id: r.itemId }, data: { status: "USED" } });
      }
      return updated;
    });
    res.json(result);
  }),
);

router.patch(
  "/:id/cancel",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const result = await prisma.$transaction(async (tx) => {
      const r = await tx.reservation.findUnique({ where: { id } });
      if (!r) throw new HttpError(404, "ไม่พบรายการจอง");
      if (r.status !== "RESERVED") throw new HttpError(409, "ยกเลิกได้เฉพาะรายการที่รอรับของ");
      await tx.item.update({
        where: { id: r.itemId },
        data: { quantity: { increment: r.quantity }, status: "AVAILABLE" },
      });
      return tx.reservation.update({ where: { id }, data: { status: "CANCELLED" }, include });
    });
    res.json(result);
  }),
);

export default router;
