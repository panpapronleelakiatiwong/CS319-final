import { useRef, useState } from "react";
import { uploadImage } from "../api/client";
import { FALLBACK_IMG, onImgError } from "../lib/itemImages";
import { resizeImage } from "../lib/resizeImage";

const MAX_ORIGINAL_MB = 20;

interface Props {
  value: string; // URL รูปปัจจุบัน (ว่าง = ไม่มีรูป)
  previewUrl?: string; // รูปที่ใช้แสดงตัวอย่าง (ถ้าต่างจาก value)
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function ImageUpload({ value, previewUrl, onChange, onUploadingChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) return setError("กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WEBP)");
    if (file.size > MAX_ORIGINAL_MB * 1024 * 1024) return setError(`ไฟล์ใหญ่เกิน ${MAX_ORIGINAL_MB} MB`);
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const blob = await resizeImage(file);
      onChange(await uploadImage(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const shown = previewUrl ?? value;

  return (
    <div className="text-sm">
      <span>รูปภาพวัสดุ</span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`mt-1 flex items-center gap-3 rounded-lg border border-dashed p-2 ${
          dragOver ? "border-forest-500 bg-forest-50" : "border-stone-300 bg-white"
        }`}
      >
        <img
          src={shown || FALLBACK_IMG}
          alt="ตัวอย่างรูป"
          onError={onImgError}
          className={`h-20 w-28 shrink-0 rounded-md bg-stone-100 object-cover ${uploading ? "opacity-40" : ""}`}
        />
        <div className="flex flex-col items-start gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-forest-600 px-3 py-1.5 text-xs font-medium text-forest-700 hover:bg-forest-50 disabled:opacity-50"
          >
            {uploading ? "กำลังอัปโหลด..." : shown ? "เปลี่ยนรูป" : "เลือกรูปภาพ"}
          </button>
          {value && !uploading && (
            <button type="button" onClick={() => onChange("")} className="text-xs text-rose-700 hover:underline">
              ลบรูป
            </button>
          )}
          <span className="text-xs text-stone-500">หรือลากไฟล์มาวาง · JPG/PNG/WEBP</span>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-rose-700">{error}</p>}
    </div>
  );
}
