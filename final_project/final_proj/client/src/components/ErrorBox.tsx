export default function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
      <p className="font-medium text-rose-700">โหลดข้อมูลไม่สำเร็จ</p>
      <p className="mt-1 text-sm text-rose-600">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">
          ลองใหม่
        </button>
      )}
    </div>
  );
}
