"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm from "@/components/admin/AdminForm";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";
import AdminReorderControls from "@/components/admin/AdminReorderControls";
import AdminModal from "@/components/admin/AdminModal";
import type {
  ChartItem,
  MerchItem,
  Release,
  ReleasePlatformLink,
  TourDate,
} from "@/lib/admin/types";

const tabs = [
  "Dashboard",
  "Events",
  "Releases",
  "Platform Links",
  "Charts",
  "Merch",
  "About",
  "Showcase Video",
];

const modalInputClass =
  "w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#FF6F61]/70 focus:ring-2 focus:ring-[#FF6F61]/30";
const modalSecondaryButtonClass =
  "rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10";
const modalPrimaryButtonClass =
  "rounded-full bg-[#FF6F61] px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110";

type SiteContentRow = { key: string; value: unknown };
type AdminEvent = {
  id: string;
  title: string;
  dateTime: string;
  category: string;
  location: string;
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json.data as T;
}

export default function AdminPage() {
  const [tab, setTab] = useState("Dashboard");
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [links, setLinks] = useState<ReleasePlatformLink[]>([]);
  const [charts, setCharts] = useState<ChartItem[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [showcaseUrl, setShowcaseUrl] = useState("");
  const [showcaseTitle, setShowcaseTitle] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    dateTime: "",
    category: "",
    location: "",
  });
  const [eventFormError, setEventFormError] = useState("");
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseForm, setReleaseForm] = useState({
    title: "",
    subtitle: "",
    releaseDate: "",
    cover: "",
    featured: false,
  });
  const [releaseFormError, setReleaseFormError] = useState("");

  const loadAll = async () => {
    try {
      const [tour, rel, chartRows, merchRows, about, showcase] = await Promise.all([
        api<TourDate[]>("/api/admin/tour-dates"),
        api<Release[]>("/api/admin/releases"),
        api<ChartItem[]>("/api/admin/charts"),
        api<MerchItem[]>("/api/admin/merch-items"),
        api<SiteContentRow | null>("/api/admin/site-content/about"),
        api<SiteContentRow | null>("/api/admin/site-content/showcase_video"),
      ]);
      setEvents(
        tour.map((row) => ({
          id: row.id,
          title: row.venue,
          dateTime: row.event_date,
          category: "General",
          location: row.city,
        }))
      );
      setReleases(rel);
      setCharts(chartRows);
      setMerch(merchRows);
      if (rel.length) setSelectedReleaseId(rel[0].id);
      const aboutValue = (about?.value as { paragraphs?: string[] } | undefined)?.paragraphs ?? [];
      setAboutText(aboutValue.join("\n\n"));
      const showcaseValue = (showcase?.value as { youtube_url?: string; title?: string } | undefined) ?? {};
      setShowcaseUrl(showcaseValue.youtube_url ?? "");
      setShowcaseTitle(showcaseValue.title ?? "");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAll();
  }, []);

  useEffect(() => {
    if (!selectedReleaseId) return;
    void (async () => {
      try {
        const data = await api<ReleasePlatformLink[]>(`/api/admin/release-platform-links?release_id=${selectedReleaseId}`);
        setLinks(data);
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, [selectedReleaseId]);

  async function reorder(resource: string, ids: string[]) {
    await fetch(`/api/admin/${resource}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
  }

  function move<T extends { id: string }>(items: T[], index: number, direction: -1 | 1) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return items;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    return next;
  }

  async function deleteRow(resource: string, id: string) {
    await fetch(`/api/admin/${resource}/${id}`, { method: "DELETE" });
  }

  function openAddEventModal() {
    setEditingEventId(null);
    setEventForm({ title: "", dateTime: "", category: "", location: "" });
    setEventFormError("");
    setEventModalOpen(true);
  }

  function openEditEventModal(event: AdminEvent) {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      dateTime: event.dateTime,
      category: event.category,
      location: event.location,
    });
    setEventFormError("");
    setEventModalOpen(true);
  }

  function closeEventModal() {
    setEventModalOpen(false);
    setEditingEventId(null);
    setEventFormError("");
  }

  function saveEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.dateTime.trim() || !eventForm.category.trim()) {
      setEventFormError("Title, Date & time, and Category are required.");
      return;
    }

    if (editingEventId) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === editingEventId ? { ...item, ...eventForm } : item
        )
      );
      setStatus("Event updated.");
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          ...eventForm,
        },
      ]);
      setStatus("Event added.");
    }

    closeEventModal();
  }

  function openReleaseModal() {
    setReleaseForm({
      title: "",
      subtitle: "",
      releaseDate: "",
      cover: "",
      featured: false,
    });
    setReleaseFormError("");
    setReleaseModalOpen(true);
  }

  function closeReleaseModal() {
    setReleaseModalOpen(false);
    setReleaseFormError("");
  }

  async function saveRelease(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!releaseForm.title.trim() || !releaseForm.cover.trim()) {
      setReleaseFormError("Title and cover image are required.");
      return;
    }
    try {
      const created = await api<Release>("/api/admin/releases", {
        method: "POST",
        body: JSON.stringify({
          title: releaseForm.title,
          subtitle: releaseForm.subtitle,
          release_date: releaseForm.releaseDate || null,
          cover_image_path: releaseForm.cover,
          is_featured: releaseForm.featured,
        }),
      });
      setReleases((prev) => [...prev, created]);
      if (!selectedReleaseId) setSelectedReleaseId(created.id);
      setStatus("Release added");
      closeReleaseModal();
    } catch (err) {
      setReleaseFormError((err as Error).message);
    }
  }

  return (
    <main className="min-h-screen bg-black pb-16">
      <Header />
      <div className="pt-28">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-6 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            Admin is currently unprotected.
          </div>
        </div>
        <AdminLayout tabs={tabs} activeTab={tab} onTabChange={setTab}>
          {status && <p className="mb-3 text-sm text-green-300">{status}</p>}
          {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

          {tab === "Dashboard" && (
            <div className="space-y-6">
              <header>
                <h1 className="font-anton text-4xl uppercase leading-none text-white sm:text-5xl">
                  Dashboard
                </h1>
                <p className="mt-2 text-sm text-white/65">
                  Quick access to the areas you manage most.
                </p>
              </header>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setTab("Events")}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60">Events</p>
                  <p className="mt-3 font-anton text-5xl leading-none text-[#FF6F61]">{events.length}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("Releases")}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60">Releases</p>
                  <p className="mt-3 font-anton text-5xl leading-none text-[#FF6F61]">{releases.length}</p>
                  <p className="mt-2 text-xs text-white/55">Platform links: {links.length}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("Charts")}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60">Charts</p>
                  <p className="mt-3 font-anton text-5xl leading-none text-[#FF6F61]">{charts.length}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("Merch")}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61]"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60">Merch</p>
                  <p className="mt-3 font-anton text-5xl leading-none text-[#FF6F61]">{merch.length}</p>
                </button>
              </div>
            </div>
          )}

          {tab === "Events" && (
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-anton text-4xl uppercase text-white">Events</h2>
                  <p className="mt-1 text-sm text-white/65">
                    Add and update upcoming events.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddEventModal}
                  className="rounded-full bg-[#FF6F61] px-5 py-2 text-base font-semibold text-black transition hover:brightness-110"
                >
                  + Add new
                </button>
              </div>
              <AdminTable headers={["Title", "Date", "Category", "Location", "Actions"]}>
                {events.map((row) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="px-4 py-3">{row.title}</td>
                    <td className="px-4 py-3">{row.dateTime}</td>
                    <td className="px-4 py-3">{row.category}</td>
                    <td className="px-4 py-3">{row.location || "-"}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/90 hover:bg-white/10"
                        onClick={() => openEditEventModal(row)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/90 hover:bg-white/10"
                        onClick={() => {
                          const ok = window.confirm(
                            "Are you sure you want to delete this event?"
                          );
                          if (!ok) return;
                          setEvents((prev) => prev.filter((x) => x.id !== row.id));
                          setStatus("Event deleted.");
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </section>
          )}

          {tab === "Releases" && (
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-anton text-4xl uppercase text-white">Releases</h2>
                  <p className="mt-1 text-sm text-white/65">
                    Add and update releases.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openReleaseModal}
                  className="rounded-full bg-[#FF6F61] px-5 py-2 text-base font-semibold text-black transition hover:brightness-110"
                >
                  + Add new
                </button>
              </div>
              <AdminTable headers={["Title", "Featured", "Cover", "Actions"]}>
                {releases.map((row, idx) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="px-4 py-3">{row.title}</td>
                    <td className="px-4 py-3">{row.is_featured ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 truncate max-w-[220px]">{row.cover_image_path}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <AdminReorderControls
                        onMoveUp={async () => {
                          const next = move(releases, idx, -1);
                          setReleases(next);
                          await reorder("releases", next.map((x) => x.id));
                        }}
                        onMoveDown={async () => {
                          const next = move(releases, idx, 1);
                          setReleases(next);
                          await reorder("releases", next.map((x) => x.id));
                        }}
                        disableUp={idx === 0}
                        disableDown={idx === releases.length - 1}
                      />
                      <button
                        type="button"
                        className="rounded border border-red-400/40 px-2 py-1 text-xs text-red-300"
                        onClick={async () => {
                          await deleteRow("releases", row.id);
                          setReleases((prev) => prev.filter((x) => x.id !== row.id));
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </section>
          )}

          {tab === "Platform Links" && (
            <section className="space-y-5">
              <select
                value={selectedReleaseId}
                onChange={(e) => setSelectedReleaseId(e.target.value)}
                className="rounded border border-white/20 bg-black/20 px-3 py-2 text-sm text-white"
              >
                {releases.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
              <AdminTable headers={["Platform", "URL", "Actions"]}>
                {links.map((row, idx) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="px-4 py-3">{row.platform}</td>
                    <td className="px-4 py-3 truncate max-w-[300px]">{row.url}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <AdminReorderControls
                        onMoveUp={async () => {
                          const next = move(links, idx, -1);
                          setLinks(next);
                          await reorder("release-platform-links", next.map((x) => x.id));
                        }}
                        onMoveDown={async () => {
                          const next = move(links, idx, 1);
                          setLinks(next);
                          await reorder("release-platform-links", next.map((x) => x.id));
                        }}
                        disableUp={idx === 0}
                        disableDown={idx === links.length - 1}
                      />
                      <button
                        type="button"
                        className="rounded border border-red-400/40 px-2 py-1 text-xs text-red-300"
                        onClick={async () => {
                          await deleteRow("release-platform-links", row.id);
                          setLinks((prev) => prev.filter((x) => x.id !== row.id));
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </AdminTable>
              <SimpleForm
                title="Create Platform Link"
                fields={["platform", "url"]}
                onSubmit={async (payload) => {
                  const created = await api<ReleasePlatformLink>("/api/admin/release-platform-links", {
                    method: "POST",
                    body: JSON.stringify({ ...payload, release_id: selectedReleaseId }),
                  });
                  setLinks((prev) => [...prev, created]);
                  setStatus("Platform link added");
                }}
              />
            </section>
          )}

          {(tab === "Charts" || tab === "Merch") && (
            <MediaSection
              title={tab}
              bucket={tab === "Charts" ? "charts" : "merch"}
              endpoint={tab === "Charts" ? "/api/admin/charts" : "/api/admin/merch-items"}
              reorderEndpoint={tab === "Charts" ? "charts" : "merch-items"}
              rows={tab === "Charts" ? charts : merch}
              setRows={(rows) => (tab === "Charts" ? setCharts(rows as ChartItem[]) : setMerch(rows as MerchItem[]))}
              deleteRow={deleteRow}
              move={move}
              reorder={reorder}
              api={api}
              setStatus={setStatus}
            />
          )}

          {tab === "About" && (
            <AdminForm
              title="About content"
              onSubmit={async (e) => {
                e.preventDefault();
                const paragraphs = aboutText.split("\n").map((p) => p.trim()).filter(Boolean);
                await api("/api/admin/site-content/about", {
                  method: "PATCH",
                  body: JSON.stringify({ value: { paragraphs } }),
                });
                setStatus("About content saved");
              }}
              submitLabel="Save About"
            >
              <textarea
                rows={10}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full rounded border border-white/20 bg-black/20 px-3 py-2 text-sm text-white"
              />
            </AdminForm>
          )}

          {tab === "Showcase Video" && (
            <AdminForm
              title="Showcase video"
              onSubmit={async (e) => {
                e.preventDefault();
                await api("/api/admin/site-content/showcase_video", {
                  method: "PATCH",
                  body: JSON.stringify({ value: { youtube_url: showcaseUrl, title: showcaseTitle } }),
                });
                setStatus("Showcase video saved");
              }}
              submitLabel="Save Showcase"
            >
              <input
                value={showcaseUrl}
                onChange={(e) => setShowcaseUrl(e.target.value)}
                placeholder="YouTube URL"
                className="w-full rounded border border-white/20 bg-black/20 px-3 py-2 text-sm text-white"
              />
              <input
                value={showcaseTitle}
                onChange={(e) => setShowcaseTitle(e.target.value)}
                placeholder="Optional title"
                className="w-full rounded border border-white/20 bg-black/20 px-3 py-2 text-sm text-white"
              />
            </AdminForm>
          )}
        </AdminLayout>
      </div>

      <AdminModal
        open={eventModalOpen}
        title={editingEventId ? "Edit Event" : "Add Event"}
        onClose={closeEventModal}
      >
        <form onSubmit={saveEvent} className="space-y-3">
          <input
            value={eventForm.title}
            onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title"
            className={modalInputClass}
          />
          <input
            value={eventForm.dateTime}
            onChange={(e) =>
              setEventForm((p) => ({ ...p, dateTime: e.target.value }))
            }
            placeholder="Date & time"
            className={modalInputClass}
          />
          <input
            value={eventForm.category}
            onChange={(e) =>
              setEventForm((p) => ({ ...p, category: e.target.value }))
            }
            placeholder="Category"
            className={modalInputClass}
          />
          <input
            value={eventForm.location}
            onChange={(e) =>
              setEventForm((p) => ({ ...p, location: e.target.value }))
            }
            placeholder="Location (optional)"
            className={modalInputClass}
          />
          {!!eventFormError && <p className="text-sm text-red-300">{eventFormError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeEventModal}
              className={modalSecondaryButtonClass}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={modalPrimaryButtonClass}
            >
              Save
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={releaseModalOpen} title="Add Release" onClose={closeReleaseModal}>
        <form onSubmit={saveRelease} className="space-y-3">
          <input
            value={releaseForm.title}
            onChange={(e) => setReleaseForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title"
            className={modalInputClass}
          />
          <input
            value={releaseForm.subtitle}
            onChange={(e) => setReleaseForm((p) => ({ ...p, subtitle: e.target.value }))}
            placeholder="Subtitle"
            className={modalInputClass}
          />
          <input
            type="date"
            value={releaseForm.releaseDate}
            onChange={(e) => setReleaseForm((p) => ({ ...p, releaseDate: e.target.value }))}
            className={`${modalInputClass} [color-scheme:dark]`}
          />
          <input
            value={releaseForm.cover}
            onChange={(e) => setReleaseForm((p) => ({ ...p, cover: e.target.value }))}
            placeholder="Cover image path"
            className={modalInputClass}
          />
          <AdminMediaUpload
            bucket="release-covers"
            onUploaded={(path) => setReleaseForm((p) => ({ ...p, cover: path }))}
          />
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={releaseForm.featured}
              onChange={(e) => setReleaseForm((p) => ({ ...p, featured: e.target.checked }))}
              className="h-4 w-4 rounded border-white/30 bg-black/40 text-[#FF6F61] focus:ring-2 focus:ring-[#FF6F61]/50"
            />
            Featured release
          </label>
          {!!releaseFormError && <p className="text-sm text-red-300">{releaseFormError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeReleaseModal}
              className={modalSecondaryButtonClass}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={modalPrimaryButtonClass}
            >
              Save
            </button>
          </div>
        </form>
      </AdminModal>
    </main>
  );
}

function SimpleForm({
  title,
  fields,
  onSubmit,
}: {
  title: string;
  fields: string[];
  onSubmit: (payload: Record<string, string>) => Promise<void>;
}) {
  const [state, setState] = useState<Record<string, string>>(Object.fromEntries(fields.map((f) => [f, ""])));
  return (
    <AdminForm
      title={title}
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(state);
        setState(Object.fromEntries(fields.map((f) => [f, ""])));
      }}
    >
      {fields.map((f) => (
        <input
          key={f}
          value={state[f]}
          onChange={(e) => setState((prev) => ({ ...prev, [f]: e.target.value }))}
          placeholder={f}
          className={modalInputClass}
        />
      ))}
    </AdminForm>
  );
}

function MediaSection<T extends { id: string; title: string; image_path: string; url: string }>(props: {
  title: string;
  bucket: "charts" | "merch";
  endpoint: string;
  reorderEndpoint: string;
  rows: T[];
  setRows: (rows: T[]) => void;
  deleteRow: (resource: string, id: string) => Promise<void>;
  move: (items: T[], index: number, direction: -1 | 1) => T[];
  reorder: (resource: string, ids: string[]) => Promise<void>;
  api: <U>(url: string, init?: RequestInit) => Promise<U>;
  setStatus: (v: string) => void;
}) {
  const { title, bucket, endpoint, reorderEndpoint, rows, setRows, deleteRow, move, reorder, api, setStatus } = props;
  const [name, setName] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [url, setUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState("");

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-anton text-4xl uppercase text-white">{title}</h2>
          <p className="mt-1 text-sm text-white/65">
            Add and update {title.toLowerCase()}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setName("");
            setImagePath("");
            setUrl("");
            setFormError("");
            setModalOpen(true);
          }}
          className="rounded-full bg-[#FF6F61] px-5 py-2 text-base font-semibold text-black transition hover:brightness-110"
        >
          + Add new
        </button>
      </div>
      <AdminTable headers={["Title", "Image", "URL", "Actions"]}>
        {rows.map((row, idx) => (
          <tr key={row.id} className="border-t border-white/10">
            <td className="px-4 py-3">{row.title}</td>
            <td className="px-4 py-3 truncate max-w-[220px]">{row.image_path}</td>
            <td className="px-4 py-3 truncate max-w-[220px]">{row.url}</td>
            <td className="px-4 py-3 flex items-center gap-2">
              <AdminReorderControls
                onMoveUp={async () => {
                  const next = move(rows, idx, -1);
                  setRows(next);
                  await reorder(reorderEndpoint, next.map((x) => x.id));
                }}
                onMoveDown={async () => {
                  const next = move(rows, idx, 1);
                  setRows(next);
                  await reorder(reorderEndpoint, next.map((x) => x.id));
                }}
                disableUp={idx === 0}
                disableDown={idx === rows.length - 1}
              />
              <button
                type="button"
                className="rounded border border-red-400/40 px-2 py-1 text-xs text-red-300"
                onClick={async () => {
                  await deleteRow(reorderEndpoint, row.id);
                  setRows(rows.filter((x) => x.id !== row.id));
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        open={modalOpen}
        title={`Add ${title.slice(0, -1)}`}
        onClose={() => setModalOpen(false)}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim() || !imagePath.trim() || !url.trim()) {
              setFormError("Title, image path, and URL are required.");
              return;
            }
            const created = await api<T>(endpoint, {
              method: "POST",
              body: JSON.stringify({ title: name, image_path: imagePath, url }),
            });
            setRows([...rows, created]);
            setName("");
            setImagePath("");
            setUrl("");
            setFormError("");
            setModalOpen(false);
            setStatus(`${title} item added`);
          }}
          className="space-y-3"
        >
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Title" className={modalInputClass} />
          <input value={imagePath} onChange={(e) => setImagePath(e.target.value)} placeholder="Image path" className={modalInputClass} />
          <AdminMediaUpload bucket={bucket} onUploaded={setImagePath} />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className={modalInputClass} />
          {!!formError && <p className="text-sm text-red-300">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className={modalSecondaryButtonClass}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={modalPrimaryButtonClass}
            >
              Save
            </button>
          </div>
        </form>
      </AdminModal>
    </section>
  );
}
