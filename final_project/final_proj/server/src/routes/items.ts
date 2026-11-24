import { ItemStatus, Prisma } from "@prisma/client";
import { Router } from "express";
import { HttpError, asyncHandler, parseId } from "../lib/http";
import { prisma } from "../lib/prisma";
import { itemSchema, itemUpdateSchema } from "../schemas";
import { deleteUploadByUrl } from "./uploads";

const router = Router();

// แปลง donorName -> donorId (หาจากชื่อเดิม หรือสร้างผู้บริจาคใหม่พร้อมเบอร์โทร)
async function resolveDonor<T extends { donorId?: number; donorName?: string; contactPhone?: string }>(input: T) {
  const { donorName, ...data } = input;
  if (!donorName) return data;
  const existing = await prisma.user.findFirst({
    where: { name: { equals: donorName, mode: "insensitive" } },
    orderBy: { id: "asc" },
  });
  const donor =
    existing ??
    (await prisma.user.create({ data: { name: donorName, role: "DONOR", phone: data.contactPhone || null } }));
  return { ...data, donorId: donor.id };
}
const include = {
  category: true,
  donor: { select: { id: true, name: true } },
} satisfies Prisma.ItemInclude;

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q, categoryId, status } = req.query;
    const where: Prisma.ItemWhereInput = {};
    if (typeof q === "string" && q.trim()) {
      where.OR = [
        { title: { contains: q.trim(), mode: "insensitive" } },
        { description: { contains: q.trim(), mode: "insensitive" } },
        { province: { contains: q.trim(), mode: "insensitive" } },
        { district: { contains: q.trim(), mode: "insensitive" } },
        { subdistrict: { contains: q.trim(), mode: "insensitive" } },
      ];
    }
    if (typeof categoryId === "string" && categoryId) where.categoryId = parseId(categoryId);
    if (typeof status === "string" && status in ItemStatus) where.status = status as ItemStatus;
    const items = await prisma.item.findMany({ where, include, orderBy: { createdAt: "desc" } });
    res.json(items);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await prisma.item.findUnique({
      where: { id: parseId(req.params.id) },
      include: { ...include, reservations: { include: { repairCase: true }, orderBy: { createdAt: "desc" } } },
    });
    if (!item) throw new HttpError(404, "ไม่พบวัสดุ");
    res.json(item);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { donorId, ...data } = await resolveDonor(itemSchema.parse(req.body));
    if (!donorId) throw new HttpError(400, "ระบุชื่อผู้บริจาค");
    const item = await prisma.item.create({ data: { ...data, donorId }, include });
    res.status(201).json(item);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = await resolveDonor(itemUpdateSchema.parse(req.body));
    const id = parseId(req.params.id);
    const before = await prisma.item.findUnique({ where: { id }, select: { imageUrl: true } });
    const item = await prisma.item.update({ where: { id }, data, include });
    if (before && data.imageUrl !== undefined && data.imageUrl !== before.imageUrl) await deleteUploadByUrl(before.imageUrl);
    res.json(item);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await prisma.item.delete({ where: { id: parseId(req.params.id) } });
    await deleteUploadByUrl(item.imageUrl);
    res.status(204).end();
  }),
);

export default router;
