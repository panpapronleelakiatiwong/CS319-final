import { Router } from "express";
import { asyncHandler } from "../lib/http";
import { prisma } from "../lib/prisma";

export const categoriesRouter = Router();
categoriesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.category.findMany({ orderBy: { id: "asc" } }));
  }),
);

export const usersRouter = Router();
usersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.user.findMany({ select: { id: true, name: true, role: true, phone: true }, orderBy: { id: "asc" } }));
  }),
);

export const statsRouter = Router();
statsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [totalItems, availableItems, openCases, doneCases, totalReservations, pickedUp, donors] =
      await Promise.all([
        prisma.item.count(),
        prisma.item.count({ where: { status: "AVAILABLE" } }),
        prisma.repairCase.count({ where: { status: { not: "DONE" } } }),
        prisma.repairCase.count({ where: { status: "DONE" } }),
        prisma.reservation.count(),
        prisma.reservation.count({ where: { status: "PICKED_UP" } }),
        prisma.user.count({ where: { role: "DONOR" } }),
      ]);
    res.json({ totalItems, availableItems, openCases, doneCases, totalReservations, pickedUp, donors });
  }),
);
