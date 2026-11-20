import { z } from "zod";

export const itemSchema = z.object({
  title: z.string().trim().min(2, "ชื่อวัสดุต้องมีอย่างน้อย 2 ตัวอักษร").max(120),
  description: z.string().trim().max(1000).default(""),
  spec: z.string().trim().max(500).default(""),
  quantity: z.coerce.number().int("ต้องเป็นจำนวนเต็ม").min(0, "ห้ามติดลบ"),
  unit: z.string().trim().min(1, "ระบุหน่วย").max(20),
  condition: z.string().trim().max(60).default("ดี"),
  imageUrl: z.string().trim().max(500).default(""),
  pickupAddress: z.string().trim().min(2, "ระบุจุดรับของ").max(300),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  status: z.enum(["AVAILABLE", "RESERVED", "USED"]).optional(),
  categoryId: z.coerce.number().int().positive(),
  donorId: z.coerce.number().int().positive(),
});
export const itemUpdateSchema = itemSchema.partial();

export const caseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).default(""),
  location: z.string().trim().min(2).max(300),
  ownerName: z.string().trim().min(2).max(100),
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE"]).optional(),
  volunteerId: z.coerce.number().int().positive().nullable().optional(),
});
export const caseUpdateSchema = caseSchema.partial();

export const reservationSchema = z.object({
  itemId: z.coerce.number().int().positive(),
  caseId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1, "ต้องจองอย่างน้อย 1"),
});
