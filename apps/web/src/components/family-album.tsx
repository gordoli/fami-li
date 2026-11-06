"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, Globe2, Images, MoveHorizontal, X } from "lucide-react";
import type { Trip } from "@fami-li/data";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@fami-li/ui";
import { Navbar } from "./navbar";
import { Timeline } from "./timeline";
import { Gallery } from "./gallery";
import { Globe } from "./globe";
import { TripStory } from "./trip-story";
import { TripEditor } from "./trip-editor";
import { CursorEffects } from "./cursor-effects";
import { loadAlbum, saveAlbum } from "@/lib/album-storage";

type ViewMode = "timeline" | "gallery" | "globe";
const VIEWS = [
  { id: "timeline", label: "Timeline", icon: MoveHorizontal },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "globe", label: "Globe", icon: Globe2 },
] as const;
export function FamilyAlbum({ trips: initialTrips }: { trips: Trip[] }) {
  const [trips, setTrips] = useState(initialTrips);
  const [view, setView] = useState<ViewMode>("timeline");
  const [activeIndex, setActiveIndex] = useState(0);
  const [albumRevision, setAlbumRevision] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isTripOpen, setIsTripOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [notice, setNotice] = useState("");
  const opener = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const selectedTrip = trips.find((trip) => trip.slug === selectedSlug);
  useEffect(() => {
    let cancelled = false;
    loadAlbum()
      .then((saved) => {
        if (!cancelled) {
          if (saved?.length) setTrips(saved);
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
  }, []);
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
      <LayoutGroup>
        <CursorEffects />
        <Navbar
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onAdd={() => openEditor()}
          onHome={() => {
            setIsTripOpen(false);
            setView("timeline");
          }}
          canAdd={isReady}
        />
        <motion.main
          animate={{
            scale: isTripOpen ? 0.975 : 1,
            opacity: isTripOpen ? 0.5 : 1,
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="album-main"
        >
          <section className="album-intro page-gutter">
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1>
                The Adventures
                <br />
                of our <span>Fami-Li</span>
              </h1>
              <p className="intro-description">
                The memories we made along the way
              </p>
            </motion.div>
            <span className="intro-side-note">
              Est. 2016
              <br />
              <span>Made of memories.</span>
            </span>
          </section>
          <div className="collection-toolbar page-gutter">
            <div className="collection-count">
              <span className="status-dot" />
              {trips.length} adventures
              <span className="count-divider" />
              {trips[0]?.year}—{trips.at(-1)?.year}
            </div>
            <div className="view-toggle" role="group" aria-label="Album view">
              {VIEWS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={view === id ? "selected" : ""}
                  aria-pressed={view === id}
                >
                  {view === id && (
                    <motion.span
                      layoutId="view-pill"
                      className="view-pill"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}
                  <span>
                    <Icon size={14} />
                    {label}
                  </span>
                </button>
              ))}
            </div>
            <span className="collection-right">
              A few chapters of us <ArrowUpRight size={12} />
            </span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 16,
                scale: prefersReducedMotion ? 1 : 0.985,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : -10,
                scale: prefersReducedMotion ? 1 : 0.985,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
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
            </motion.div>
          </AnimatePresence>
        </motion.main>
        <footer className="album-footer page-gutter">
          <span>A little family. A big world.</span>
          <button onClick={() => setIsAboutOpen(true)}>
            Our little story <ArrowUpRight size={12} />
          </button>
          <span className="footer-note">COLLECTING MOMENTS, NOT THINGS.</span>
        </footer>
        {selectedTrip && (
          <TripStory
            trip={selectedTrip}
            open={isTripOpen}
            onOpenChange={setIsTripOpen}
            onCloseAutoFocus={() =>
              opener.current?.focus({ preventScroll: true })
            }
            onEdit={() => openEditor(selectedTrip)}
            navbar={
              <Navbar
                isDark={isDark}
                onToggleTheme={toggleTheme}
                onAdd={() => openEditor()}
                onHome={() => setIsTripOpen(false)}
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
        <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
          <DialogContent className="about-dialog">
            <Button
              className="about-close"
              variant="ghost"
              size="icon"
              aria-label="Close our story"
              onClick={() => setIsAboutOpen(false)}
            >
              <X size={18} />
            </Button>
            <span className="tiny-star text-primary text-3xl">✳</span>
            <p className="eyebrow mt-6">A NOTE FROM OUR FAMILY</p>
            <DialogTitle>
              Some things deserve
              <br />
              to be remembered.
            </DialogTitle>
            <DialogDescription>
              Not just the places. The wrong turns, the long lunches, the little
              moments in between. This is our place to keep them.
            </DialogDescription>
            <p>One family. A few suitcases. A world of stories.</p>
            <div className="about-mock-note">
              A working family album prototype with sample stories and stock
              photographs. Added adventures are saved privately in this browser.
            </div>
          </DialogContent>
        </Dialog>
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
    </MotionConfig>
  );
}
