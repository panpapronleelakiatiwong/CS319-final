import { Router } from "express";
import { HttpError, asyncHandler, parseId } from "../lib/http";
import { prisma } from "../lib/prisma";
import { caseSchema, caseUpdateSchema } from "../schemas";

const router = Router();
const include = {
  volunteer: { select: { id: true, name: true } },
  _count: { select: { reservations: true } },
};

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.repairCase.findMany({ include, orderBy: { createdAt: "desc" } }));
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const found = await prisma.repairCase.findUnique({
      where: { id: parseId(req.params.id) },
      include: {
        ...include,
        reservations: {
          include: { item: { select: { id: true, title: true, unit: true, imageUrl: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!found) throw new HttpError(404, "ไม่พบเคส");
    res.json(found);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = caseSchema.parse(req.body);
    res.status(201).json(await prisma.repairCase.create({ data, include }));
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = caseUpdateSchema.parse(req.body);
    res.json(await prisma.repairCase.update({ where: { id: parseId(req.params.id) }, data, include }));
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.repairCase.delete({ where: { id: parseId(req.params.id) } });
    res.status(204).end();
  }),
);

export default router;
