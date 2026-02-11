"use client";

import { useEffect, useMemo, useState } from "react";
import type { TourDate } from "@/lib/admin/types";

type LiveEventsSectionProps = {
  events: TourDate[];
};

type EventWithDate = {
  event: TourDate;
  date: Date | null;
  timestamp: number;
};

type GroupedEvents = {
  label: string;
  items: EventWithDate[];
};

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const shortDayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
});

const shortWeekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

export default function LiveEventsSection({ events }: LiveEventsSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<TourDate | null>(null);

  useEffect(() => {
    if (!selectedEvent) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedEvent(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedEvent]);

  const groups = useMemo<GroupedEvents[]>(() => {
    const normalized: EventWithDate[] = events
      .map((event) => {
        const date = parseIsoDate(event.event_date);
        return {
          event,
          date,
          timestamp: date ? date.getTime() : Number.POSITIVE_INFINITY,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    const result: GroupedEvents[] = [];
    normalized.forEach((item) => {
      const label = item.date ? monthLabelFormatter.format(item.date) : "Date TBA";
      const existing = result.find((group) => group.label === label);
      if (existing) {
        existing.items.push(item);
        return;
      }
      result.push({ label, items: [item] });
    });

    return result;
  }, [events]);

  const selectedEventDate = selectedEvent ? parseIsoDate(selectedEvent.event_date) : null;
  const selectedEventHasTickets = selectedEvent
    ? isValidHttpUrl(selectedEvent.ticket_url)
    : false;

  return (
    <>
      <section className="bg-black pb-24 pt-8 sm:pb-28">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center text-white/80">
              No live events scheduled right now.
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="space-y-5">
                <h2 className="font-anton text-3xl uppercase text-[#FF6F61] sm:text-4xl">
                  {group.label}
                </h2>
                <div className="grid gap-4">
                  {group.items.map(({ event, date }) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-white transition hover:border-[#FF6F61]/40 hover:bg-white/10 md:grid-cols-[minmax(0,1fr)_88px] md:items-center"
                    >
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6F61]">
                          Live Event
                        </p>
                        <h3 className="font-anton text-2xl uppercase leading-tight text-white sm:text-3xl">
                          {event.venue}
                        </h3>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/80">
                          <span>{date ? fullDateFormatter.format(date) : "Date TBA"}</span>
                          <span>{event.city || "Location TBA"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-1">
                        <span className="font-anton text-4xl leading-none text-[#FF6F61]">
                          {date ? shortDayFormatter.format(date) : "--"}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                          {date ? shortWeekdayFormatter.format(date) : "TBA"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close event details"
            onClick={() => setSelectedEvent(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-2xl rounded-t-3xl border border-white/10 bg-black p-6 text-white shadow-2xl sm:rounded-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6F61]">
                  Live Event
                </p>
                <h3 className="font-anton text-3xl uppercase leading-tight sm:text-4xl">
                  {selectedEvent.venue}
                </h3>
                <p className="text-sm text-white/80">
                  {selectedEventDate ? fullDateFormatter.format(selectedEventDate) : "Date TBA"}
                </p>
                <p className="text-sm text-white/80">
                  {selectedEvent.city || "Location TBA"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedEvent(null)}
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-8">
              {selectedEventHasTickets ? (
                <a
                  href={selectedEvent.ticket_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-[#FF6F61] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:brightness-110"
                >
                  Get Tickets
                </a>
              ) : (
                <span className="inline-flex cursor-not-allowed rounded-full border border-white/20 px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                  Tickets Unavailable
                </span>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
