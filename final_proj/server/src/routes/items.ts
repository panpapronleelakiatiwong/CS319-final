import { ItemStatus, Prisma } from "@prisma/client";
import { Router } from "express";
import { HttpError, asyncHandler, parseId } from "../lib/http";
import { prisma } from "../lib/prisma";
import { itemSchema, itemUpdateSchema } from "../schemas";

const router = Router();
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
    const data = itemSchema.parse(req.body);
    const item = await prisma.item.create({ data, include });
    res.status(201).json(item);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = itemUpdateSchema.parse(req.body);
    const item = await prisma.item.update({ where: { id: parseId(req.params.id) }, data, include });
    res.json(item);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.item.delete({ where: { id: parseId(req.params.id) } });
    res.status(204).end();
  }),
);

export default router;
