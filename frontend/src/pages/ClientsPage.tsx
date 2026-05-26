import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createClient,
  getClients,
  updateClient,
  type Client,
} from "../api/clientsApi";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { Toast } from "../components/ui/Toast";

const PAGE_LIMIT = 10;

type ClientFormState = {
  externalCode: string;
  name: string;
  primaryPhone: string;
  secondaryPhone: string;
  mobilePhone: string;
  institutionAddress: string;
  notes: string;
  isActive: boolean;
};

const emptyForm: ClientFormState = {
  externalCode: "",
  name: "",
  primaryPhone: "",
  secondaryPhone: "",
  mobilePhone: "",
  institutionAddress: "",
  notes: "",
  isActive: true,
};

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<"true" | "false" | "">("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState<ClientFormState>(emptyForm);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  async function loadClients() {
    try {
      setIsLoading(true);
      setError("");

      const result = await getClients({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        isActive: isActive || undefined,
      });

      setClients(result.data);
      setTotalPages(result.pagination.totalPages || 1);
    } catch {
      setError("לא הצלחנו לטעון את רשימת הלקוחות");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, [page, isActive]);

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    loadClients();
  }

  function openCreateForm() {
    setEditingClient(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditForm(client: Client) {
    setEditingClient(client);

    setForm({
      externalCode: client.externalCode,
      name: client.name,
      primaryPhone: client.primaryPhone || "",
      secondaryPhone: client.secondaryPhone || "",
      mobilePhone: client.mobilePhone || "",
      institutionAddress: client.institutionAddress || "",
      notes: client.notes || "",
      isActive: client.isActive,
    });

    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingClient(null);
    setForm(emptyForm);
    setIsFormOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.externalCode.trim() || !form.name.trim()) {
      setToastType("error");
      setToastMessage("קוד לקוח ושם לקוח הם שדות חובה");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        externalCode: form.externalCode.trim(),
        name: form.name.trim(),
        primaryPhone: form.primaryPhone.trim() || undefined,
        secondaryPhone: form.secondaryPhone.trim() || undefined,
        mobilePhone: form.mobilePhone.trim() || undefined,
        institutionAddress: form.institutionAddress.trim() || undefined,
        notes: form.notes.trim() || undefined,
        isActive: form.isActive,
      };

      if (editingClient) {
        await updateClient(editingClient.id, payload);
        setToastType("success");
        setToastMessage("הלקוח עודכן בהצלחה");
      } else {
        await createClient(payload);
        setToastType("success");
        setToastMessage("הלקוח נוצר בהצלחה");
      }

      closeForm();
      loadClients();
    } catch {
      setToastType("error");
      setToastMessage("לא הצלחנו לשמור את הלקוח");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <PageHeader
        title="לקוחות"
        description="ניהול מאגר הלקוחות של חברת ההסעות"
        actions={<Button onClick={openCreateForm}>הוספת לקוח</Button>}
      />

      <Card className="p-4">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">חיפוש</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder="שם, קוד לקוח או טלפון"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">סטטוס</label>
            <select
              value={isActive}
              onChange={(event) => {
                setIsActive(event.target.value as "true" | "false" | "");
                setPage(1);
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            >
              <option value="">כולם</option>
              <option value="true">פעילים</option>
              <option value="false">לא פעילים</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit">סינון</Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearch("");
                setIsActive("");
                setPage(1);
              }}
            >
              איפוס
            </Button>
          </div>
        </form>
      </Card>

      {isFormOpen && (
        <Card className="p-5">
          <h2 className="mb-4 text-lg font-semibold">
            {editingClient ? "עריכת לקוח" : "הוספת לקוח חדש"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">קוד לקוח</label>
              <input
                value={form.externalCode}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    externalCode: event.target.value,
                  }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">שם לקוח</label>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">טלפון ראשי</label>
              <input
                value={form.primaryPhone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    primaryPhone: event.target.value,
                  }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">טלפון נוסף</label>
              <input
                value={form.secondaryPhone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    secondaryPhone: event.target.value,
                  }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">טלפון נייד</label>
              <input
                value={form.mobilePhone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mobilePhone: event.target.value,
                  }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">כתובת מוסד</label>
              <input
                value={form.institutionAddress}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    institutionAddress: event.target.value,
                  }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">הערות</label>
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="min-h-24 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isActive: event.target.checked,
                  }))
                }
              />

              <label htmlFor="isActive" className="text-sm">
                לקוח פעיל
              </label>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <Button disabled={isSaving}>
                {isSaving ? "שומר..." : "שמירה"}
              </Button>

              <Button type="button" variant="secondary" onClick={closeForm}>
                ביטול
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading && <LoadingState text="טוען לקוחות..." />}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {!isLoading && !error && clients.length === 0 && (
        <EmptyState
          title="לא נמצאו לקוחות"
          description="אפשר להוסיף לקוח חדש או לשנות את תנאי החיפוש."
          action={<Button onClick={openCreateForm}>הוספת לקוח</Button>}
        />
      )}

      {!isLoading && !error && clients.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 z-10 border-b bg-gray-50">
                <tr>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    קוד לקוח
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    שם לקוח
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    טלפון ראשי
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    טלפון נייד
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    כתובת מוסד
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    סטטוס
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    פעולות
                  </th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b last:border-b-0">
                    <td className="p-3 font-medium">{client.externalCode}</td>
                    <td className="p-3">{client.name}</td>
                    <td className="p-3">{client.primaryPhone || "-"}</td>
                    <td className="p-3">{client.mobilePhone || "-"}</td>
                    <td className="p-3">{client.institutionAddress || "-"}</td>
                    <td className="p-3">
                      {client.isActive ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                          פעיל
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                          לא פעיל
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="secondary"
                        onClick={() => openEditForm(client)}
                      >
                        עריכה
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              הקודם
            </Button>

            <span className="text-center text-sm text-gray-600">
              עמוד {page} מתוך {totalPages}
            </span>

            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              הבא
            </Button>
          </div>
        </Card>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
}