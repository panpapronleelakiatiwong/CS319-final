const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

interface ErrorBody {
  error?: string;
  details?: { field: string; message: string }[];
}

export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: options.method ?? "GET",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบเครือข่าย", 0);
  }

  if (!res.ok) {
    let message = `เกิดข้อผิดพลาด (${res.status})`;
    try {
      const data = (await res.json()) as ErrorBody;
      if (data.error) {
        message = data.details?.length
          ? `${data.error}: ${data.details.map((d) => `${d.field} ${d.message}`).join(", ")}`
          : data.error;
      }
    } catch {
      /* ไม่มี body */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
