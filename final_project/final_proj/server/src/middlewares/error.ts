import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/http";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "ไม่พบเส้นทางที่ร้องขอ" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "ข้อมูลไม่ถูกต้อง",
      details: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "ไม่พบข้อมูล" });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({ error: "ข้อมูลซ้ำกับที่มีอยู่แล้ว" });
      return;
    }
    if (err.code === "P2003") {
      res.status(400).json({ error: "อ้างอิงข้อมูลที่ไม่มีอยู่จริง" });
      return;
    }
  }
  console.error(err);
  res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
};
