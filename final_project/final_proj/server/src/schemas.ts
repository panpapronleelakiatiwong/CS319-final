import { z } from "zod";

const itemFields = z.object({
  title: z.string().trim().min(2, "ชื่อวัสดุต้องมีอย่างน้อย 2 ตัวอักษร").max(120),
  description: z.string().trim().max(1000).default(""),
  spec: z.string().trim().max(500).default(""),
  quantity: z.coerce.number().int("ต้องเป็นจำนวนเต็ม").min(0, "ห้ามติดลบ"),
  unit: z.string().trim().min(1, "ระบุหน่วย").max(20),
  condition: z.string().trim().max(60).default("ดี"),
  imageUrl: z.string().trim().max(500).default(""),
  province: z.string({ required_error: "ระบุจังหวัด" }).trim().min(1, "ระบุจังหวัด").max(100),
  district: z.string({ required_error: "ระบุเขต/อำเภอ" }).trim().min(1, "ระบุเขต/อำเภอ").max(100),
  subdistrict: z.string({ required_error: "ระบุแขวง/ตำบล" }).trim().min(1, "ระบุแขวง/ตำบล").max(100),
  postalCode: z
    .string({ required_error: "ระบุรหัสไปรษณีย์" })
    .trim()
    .regex(/^\d{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก"),
  addressDetail: z.string().trim().max(300).default(""),
  pickupAddress: z.string().trim().max(300).default(""),
  contactPhone: z
    .string({ required_error: "ระบุเบอร์โทรติดต่อ" })
    .trim()
    .refine((v) => /^0\d{8,9}$/.test(v.replace(/[\s-]/g, "")), "เบอร์โทรไม่ถูกต้อง (เช่น 081-234-5678 หรือ 02-123-4567)"),
  status: z.enum(["AVAILABLE", "RESERVED", "USED"]).optional(),
  categoryId: z.coerce.number().int().positive(),
  donorId: z.coerce.number().int().positive().optional(),
  // พิมพ์ชื่อผู้บริจาคได้เอง: ถ้าชื่อตรงกับผู้ใช้ที่มีอยู่จะใช้คนนั้น ถ้าไม่มีจะสร้างผู้บริจาคใหม่
  donorName: z.string().trim().min(2, "ชื่อผู้บริจาคต้องมีอย่างน้อย 2 ตัวอักษร").max(100).optional(),
});
export const itemSchema = itemFields.refine((v) => v.donorId || v.donorName, {
  message: "ระบุชื่อผู้บริจาค",
  path: ["donorName"],
});
export const itemUpdateSchema = itemFields.partial();

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
