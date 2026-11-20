import { Link } from "react-router";
import type { Item } from "../types";
import { ItemStatusBadge } from "./StatusBadge";

export const FALLBACK_IMG = "https://placehold.co/600x400?text=No+Image";

export default function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <img src={item.imageUrl || FALLBACK_IMG} alt={item.title} loading="lazy" className="h-40 w-full bg-stone-100 object-cover" />
      <div className="space-y-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{item.title}</h3>
          <ItemStatusBadge status={item.status} />
        </div>
        <p className="text-sm text-stone-500">{item.category?.name}</p>
        <p className="text-sm">
          คงเหลือ <b>{item.quantity}</b> {item.unit}
        </p>
        <p className="truncate text-xs text-stone-400">📍 {item.pickupAddress}</p>
      </div>
    </Link>
  );
}
