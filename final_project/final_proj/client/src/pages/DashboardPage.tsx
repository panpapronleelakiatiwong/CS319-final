import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  useCancelReservation,
  useCases,
  useCategories,
  useCreateCase,
  useCreateItem,
  useDeleteCase,
  useDeleteItem,
  useItems,
  usePickup,
  useReservations,
  useUpdateCase,
  useUpdateItem,
  useUsers,
} from "../api/hooks";
import ErrorBox from "../components/ErrorBox";
import ItemForm from "../components/ItemForm";
import { Skeleton } from "../components/Skeleton";
import { CaseStatusBadge, ItemStatusBadge, ReservationStatusBadge, caseStatusLabels } from "../components/StatusBadge";
import type { CaseStatus, Item } from "../types";

type Tab = "items" | "reservations" | "cases";
const field = "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm";
const btn = "rounded-md px-2.5 py-1 text-xs";

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-10" />
      ))}
    </div>
  );
}

function ItemsTab() {
  const { data: items, isLoading, isError, error, refetch } = useItems({});
  const { data: categories } = useCategories();
  const { data: users } = useUsers();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const [searchParams] = useSearchParams();
  const [editing, setEditing] = useState<Item | "new" | null>(searchParams.get("new") ? "new" : null);

  const close = () => setEditing(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">ลงประกาศ / จัดการวัสดุ (ผู้บริจาค)</h2>
        <button onClick={() => setEditing("new")} className="rounded-lg bg-forest-600 px-3 py-2 text-sm text-white hover:bg-forest-700">
          + ลงประกาศวัสดุ
        </button>
      </div>

      {editing && categories && users && (
        <ItemForm
          key={editing === "new" ? "new" : editing.id}
          categories={categories}
          users={users}
          initial={editing === "new" ? undefined : editing}
          submitting={createItem.isPending || updateItem.isPending}
          onCancel={close}
          onSubmit={(input) =>
            editing === "new"
              ? createItem.mutate(input, { onSuccess: close })
              : updateItem.mutate({ id: editing.id, data: input }, { onSuccess: close })
          }
        />
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorBox message={error.message} onRetry={() => refetch()} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-stone-100 text-stone-600">
              <tr>
                <th className="px-3 py-2">วัสดุ</th>
                <th className="px-3 py-2">หมวดหมู่</th>
                <th className="px-3 py-2">คงเหลือ</th>
                <th className="px-3 py-2">สถานะ</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items?.map((it) => (
                <tr key={it.id}>
                  <td className="px-3 py-2">
                    <Link to={`/items/${it.id}`} className="text-forest-700 hover:underline">
                      {it.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{it.category?.name}</td>
                  <td className="px-3 py-2">
                    {it.quantity} {it.unit}
                  </td>
                  <td className="px-3 py-2">
                    <ItemStatusBadge status={it.status} />
                  </td>
                  <td className="space-x-1 px-3 py-2 text-right">
                    <button className={`${btn} border border-stone-300 hover:bg-stone-100`} onClick={() => setEditing(it)}>
                      แก้ไข
                    </button>
                    <button
                      className={`${btn} bg-rose-600 text-white hover:bg-rose-700`}
                      disabled={deleteItem.isPending}
                      onClick={() => window.confirm(`ลบ "${it.title}" ?`) && deleteItem.mutate(it.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReservationsTab() {
  const { data, isLoading, isError, error, refetch } = useReservations();
  const pickup = usePickup();
  const cancel = useCancelReservation();

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">ตัดสต็อกเมื่อรับของ (ช่างอาสา)</h2>
      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorBox message={error.message} onRetry={() => refetch()} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-stone-100 text-stone-600">
              <tr>
                <th className="px-3 py-2">วัสดุ</th>
                <th className="px-3 py-2">เคส</th>
                <th className="px-3 py-2">จำนวน</th>
                <th className="px-3 py-2">สถานะ</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data?.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2">{r.item?.title}</td>
                  <td className="px-3 py-2">{r.repairCase?.title}</td>
                  <td className="px-3 py-2">
                    {r.quantity} {r.item?.unit}
                  </td>
                  <td className="px-3 py-2">
                    <ReservationStatusBadge status={r.status} />
                  </td>
                  <td className="space-x-1 px-3 py-2 text-right">
                    {r.status === "RESERVED" && (
                      <>
                        <button className={`${btn} bg-forest-600 text-white hover:bg-forest-700`} disabled={pickup.isPending} onClick={() => pickup.mutate(r.id)}>
                          รับของแล้ว (ตัดสต็อก)
                        </button>
                        <button className={`${btn} border border-stone-300 hover:bg-stone-100`} disabled={cancel.isPending} onClick={() => cancel.mutate(r.id)}>
                          ยกเลิก
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CasesTab() {
  const { data, isLoading, isError, error, refetch } = useCases();
  const { data: users } = useUsers();
  const createCase = useCreateCase();
  const updateCase = useUpdateCase();
  const deleteCase = useDeleteCase();
  const [f, setF] = useState({ title: "", ownerName: "", location: "", description: "", volunteerId: "" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createCase.mutate(
      {
        title: f.title,
        ownerName: f.ownerName,
        location: f.location,
        description: f.description,
        volunteerId: f.volunteerId ? Number(f.volunteerId) : null,
      },
      { onSuccess: () => setF({ title: "", ownerName: "", location: "", description: "", volunteerId: "" }) },
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">เคสซ่อมแซมบ้าน</h2>
      <form onSubmit={submit} className="grid gap-2 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-2">
        <input required placeholder="ชื่อเคส" className={field} value={f.title} onChange={set("title")} />
        <input required placeholder="ชื่อเจ้าของบ้าน" className={field} value={f.ownerName} onChange={set("ownerName")} />
        <input required placeholder="สถานที่" className={field} value={f.location} onChange={set("location")} />
        <select className={field} value={f.volunteerId} onChange={set("volunteerId")}>
          <option value="">ช่างอาสา: ยังไม่ระบุ</option>
          {users
            ?.filter((u) => u.role === "VOLUNTEER")
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </select>
        <textarea placeholder="รายละเอียดความเสียหาย" rows={2} className={`${field} sm:col-span-2`} value={f.description} onChange={set("description")} />
        <button disabled={createCase.isPending} className="rounded-lg bg-forest-600 px-4 py-2 text-sm text-white hover:bg-forest-700 disabled:opacity-50 sm:col-span-2">
          {createCase.isPending ? "กำลังบันทึก..." : "+ เพิ่มเคส"}
        </button>
      </form>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorBox message={error.message} onRetry={() => refetch()} />
      ) : (
        <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
          {data?.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-stone-500">
                  {c.ownerName} · {c.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CaseStatusBadge status={c.status} />
                <select
                  className="rounded-md border border-stone-300 px-2 py-1 text-xs"
                  value={c.status}
                  onChange={(e) => updateCase.mutate({ id: c.id, data: { status: e.target.value as CaseStatus } })}
                >
                  {(Object.keys(caseStatusLabels) as CaseStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {caseStatusLabels[s]}
                    </option>
                  ))}
                </select>
                <button
                  className={`${btn} bg-rose-600 text-white hover:bg-rose-700`}
                  disabled={deleteCase.isPending}
                  onClick={() => window.confirm(`ลบเคส "${c.title}" ?`) && deleteCase.mutate(c.id)}
                >
                  ลบ
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("items");
  const tabs: [Tab, string][] = [
    ["items", "วัสดุ (ผู้บริจาค)"],
    ["reservations", "การจอง / ตัดสต็อก"],
    ["cases", "เคสซ่อมบ้าน"],
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">จัดการระบบ</h1>
      <div className="flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-sm ${tab === key ? "bg-forest-600 text-white" : "border border-stone-300 bg-white hover:bg-stone-100"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "items" && <ItemsTab />}
      {tab === "reservations" && <ReservationsTab />}
      {tab === "cases" && <CasesTab />}
    </div>
  );
}
