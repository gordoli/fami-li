"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import { X } from "lucide-react";
import { TooltipProvider } from "@fami-li/ui";
import type { Trip } from "@fami-li/data";
import { FloatingControls, type ViewMode } from "./floating-controls";
import { Timeline } from "./timeline";
import { Gallery } from "./gallery";
import { Globe } from "./globe";
import { TripStory } from "./trip-story";
import { TripEditor } from "./trip-editor";
import { CursorEffects } from "./cursor-effects";
import { loadAlbum, saveAlbum, mergeAlbum } from "@/lib/album-storage";

export function FamilyAlbum({ trips: initialTrips }: { trips: Trip[] }) {
  const [trips, setTrips] = useState(initialTrips);
  const [view, setView] = useState<ViewMode>("timeline");
  const [isChangingView, setIsChangingView] = useState(false);
  const viewTransitionTimer = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [albumRevision, setAlbumRevision] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isTripOpen, setIsTripOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [notice, setNotice] = useState("");
  const opener = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompact = view !== "timeline";
  const selectedTrip = trips.find((trip) => trip.slug === selectedSlug);
  useEffect(() => {
    let cancelled = false;
    loadAlbum()
      .then((saved) => {
        if (!cancelled) {
          if (saved?.length) setTrips(mergeAlbum(saved, initialTrips));
          setIsReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNotice(
            "Browser storage is unavailable. Changes will last for this session.",
          );
          setIsReady(true);
        }
      });
    let storedTheme: string | null = null;
    try {
      storedTheme = localStorage.getItem("fami-li-theme");
    } catch {
      /* Use the system theme when browser storage is disabled. */
    }
    const dark = storedTheme
      ? storedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    // Theme state follows the persisted preference after hydration.
    queueMicrotask(() => {
      if (!cancelled) setIsDark(dark);
    });
    return () => {
      cancelled = true;
    };
  }, [initialTrips]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const selectTrip = useCallback((trip: Trip) => {
    opener.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelectedSlug(trip.slug);
    setIsTripOpen(true);
  }, []);
  useEffect(
    () => () => {
      if (viewTransitionTimer.current !== null)
        window.clearTimeout(viewTransitionTimer.current);
    },
    [],
  );
  function changeView(next: ViewMode) {
    if (viewTransitionTimer.current !== null)
      window.clearTimeout(viewTransitionTimer.current);
    if (next === view) {
      setIsChangingView(false);
      return;
    }
    if (prefersReducedMotion) {
      setView(next);
      return;
    }
    setIsChangingView(true);
    viewTransitionTimer.current = window.setTimeout(() => {
      setView(next);
      setIsChangingView(false);
      viewTransitionTimer.current = null;
    }, 180);
  }
  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("fami-li-theme", next ? "dark" : "light");
    } catch {
      setNotice("Theme changed for this session.");
    }
  }
  function openEditor(trip: Trip | null = null) {
    if (!isTripOpen)
      opener.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    setEditingTrip(trip);
    setIsEditorOpen(true);
  }
  async function saveTrip(trip: Trip) {
    const next = trips.some((item) => item.slug === trip.slug)
      ? trips.map((item) => (item.slug === trip.slug ? trip : item))
      : [...trips, trip];
    next.sort((a, b) => a.date.localeCompare(b.date));
    try {
      await saveAlbum(next);
      setNotice(
        editingTrip
          ? "A memory, thoughtfully updated."
          : "A new adventure in the family album.",
      );
    } catch {
      setNotice(
        "Saved for this session. Browser storage is unavailable or full.",
      );
    }
    setTrips(next);
    setActiveIndex(next.findIndex((item) => item.slug === trip.slug));
    setAlbumRevision((revision) => revision + 1);
    setSelectedSlug(trip.slug);
    setIsTripOpen(true);
  }
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={160}>
        <LayoutGroup>
          <CursorEffects />
          {!isTripOpen && (
            <FloatingControls
              view={view}
              onViewChange={changeView}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onAdd={() => openEditor()}
              canAdd={isReady}
            />
          )}
          {!isTripOpen && isCompact && (
            <motion.h1
              className="compact-album-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: isChangingView ? 0 : 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src="/brand/fami-li-mark.png"
                alt=""
                width={32}
                height={32}
                className="brand-mark brand-mark--compact"
              />
              <span className="compact-title-copy">
                The <span className="brand-name">Fami-Li</span> Adventures
              </span>
            </motion.h1>
          )}
          <motion.main
            animate={{
              scale: isTripOpen ? 0.975 : 1,
              opacity: isChangingView ? 0 : isTripOpen ? 0.5 : 1,
            }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            className={`album-main${isCompact ? " album-main--compact" : ""}`}
          >
            {!isCompact && (
              <section className="album-intro page-gutter">
                <Image
                  src="/brand/fami-li-mark.png"
                  alt=""
                  width={112}
                  height={112}
                  className="brand-mark brand-mark--hero"
                  priority
                />
                <h1>
                  The <span>Fami-Li</span> Adventures
                </h1>
              </section>
            )}
            <div key={view}>
              {view === "timeline" ? (
                <Timeline
                  key={albumRevision}
                  trips={trips}
                  activeIndex={activeIndex}
                  onActiveChange={setActiveIndex}
                  onSelect={selectTrip}
                />
              ) : view === "gallery" ? (
                <Gallery trips={trips} onSelect={selectTrip} />
              ) : (
                <div className="globe-view page-gutter">
                  <Globe trips={trips} onSelect={selectTrip} />
                </div>
              )}
            </div>
          </motion.main>
          {selectedTrip && (
            <TripStory
              trip={selectedTrip}
              open={isTripOpen}
              onOpenChange={setIsTripOpen}
              onCloseAutoFocus={() =>
                opener.current?.focus({ preventScroll: true })
              }
              onEdit={() => openEditor(selectedTrip)}
              controls={
                <FloatingControls
                  view={view}
                  onViewChange={changeView}
                  onEdit={() => openEditor(selectedTrip)}
                  onBack={() => setIsTripOpen(false)}
                  isDark={isDark}
                  onToggleTheme={toggleTheme}
                  onAdd={() => openEditor()}
                  canAdd={isReady}
                />
              }
            />
          )}
          <TripEditor
            open={isEditorOpen}
            onOpenChange={setIsEditorOpen}
            trip={editingTrip}
            onSave={saveTrip}
          />
          <AnimatePresence>
            {notice && (
              <motion.div
                role="status"
                className="album-toast"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {notice}
                <button
                  aria-label="Dismiss notification"
                  onClick={() => setNotice("")}
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </TooltipProvider>
    </MotionConfig>
  );
}
