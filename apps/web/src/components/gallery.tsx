"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Trip } from "@fami-li/data";
import { Button } from "@fami-li/ui";
import { formatMonth } from "@/lib/format";

type GalleryProps = {
  trips: readonly Trip[];
  onSelect: (trip: Trip) => void;
};

type DragOrigin = { x: number; y: number; pointerId: number };

// Wrap the collection so the previous and next memories always flank the selected one.
function circularOffset(index: number, selectedIndex: number, count: number) {
  const offset = (index - selectedIndex + count) % count;
  return offset > count / 2 ? offset - count : offset;
}

export function Gallery({ trips, onSelect }: GalleryProps) {
  const [selectedSlug, setSelectedSlug] = useState(trips[0]?.slug ?? null);
  const reducedMotion = useReducedMotion();
  const drag = useRef<DragOrigin | null>(null);
  const didDrag = useRef(false);
  const filters = useRef<HTMLDivElement>(null);
  const selectedIndex = Math.max(
    0,
    trips.findIndex((trip) => trip.slug === selectedSlug),
  );
  const selectedTrip = trips[selectedIndex];

  useEffect(() => {
    const rail = filters.current;
    const button = rail?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!rail || !button) return;
    const bounds = rail.getBoundingClientRect();
    const selected = button.getBoundingClientRect();
    if (selected.left < bounds.left || selected.right > bounds.right) {
      rail.scrollTo({
        left:
          rail.scrollLeft +
          selected.left -
          bounds.left -
          (bounds.width - selected.width) / 2,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }, [selectedIndex, reducedMotion]);

  function move(direction: number) {
    if (trips.length < 2) return;
    const index = (selectedIndex + direction + trips.length) % trips.length;
    setSelectedSlug(trips[index]?.slug ?? null);
  }

  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || trips.length < 2) return;
    didDrag.current = false;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const origin = drag.current;
    if (!origin || origin.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - origin.x;
    const deltaY = event.clientY - origin.y;
    if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
      didDrag.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const origin = drag.current;
    drag.current = null;
    if (!origin || origin.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - origin.x;
    if (didDrag.current && Math.abs(deltaX) > 40) {
      move(deltaX > 0 ? -1 : 1);
    }
  }

  if (!selectedTrip) {
    return (
      <section
        className="gallery-view page-gutter"
        aria-label="Adventure gallery"
      >
        <p className="py-16 text-center text-sm text-muted-foreground">
          The first chapter is still to come. Add an adventure to begin.
        </p>
      </section>
    );
  }

  return (
    <section
      className="gallery-view page-gutter"
      role="region"
      aria-roledescription="carousel"
      aria-label="Adventure gallery"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div
        className="gallery-filters"
        aria-label="Choose an adventure"
        ref={filters}
      >
        {trips.map((trip, index) => (
          <Button
            key={trip.slug}
            variant={index === selectedIndex ? "default" : "outline"}
            size="sm"
            aria-pressed={index === selectedIndex}
            aria-label={`Show ${trip.title}, ${trip.year}`}
            onClick={() => setSelectedSlug(trip.slug)}
          >
            {trip.title}
          </Button>
        ))}
      </div>

      <div
        className="coverflow-stage"
        style={{ touchAction: "pan-y" }}
        aria-label="Drag or swipe to browse adventures"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={() => {
          drag.current = null;
          didDrag.current = false;
        }}
        onLostPointerCapture={(event) => {
          // Touch transfers implicit capture from the photo to the stage.
          if (event.target === event.currentTarget) drag.current = null;
        }}
        onPointerLeave={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            drag.current = null;
          }
        }}
        onClickCapture={(event) => {
          if (didDrag.current) {
            event.preventDefault();
            event.stopPropagation();
            didDrag.current = false;
          }
        }}
      >
        {trips.map((trip, index) => {
          const offset = circularOffset(index, selectedIndex, trips.length);
          const distance = Math.abs(offset);
          const isActive = distance === 0;
          const isVisible = distance <= 2;
          const position = {
            x: `${offset * 65 - 50}%`,
            y: "-50%",
            scale: isActive ? 1 : distance === 1 ? 0.84 : 0.66,
            opacity: isVisible ? 1 : 0,
          };
          return (
            <motion.button
              key={trip.slug}
              className={`coverflow-card ${isActive ? "is-active" : ""}`}
              style={{
                zIndex: trips.length - distance,
                pointerEvents: isVisible ? "auto" : "none",
              }}
              initial={position}
              animate={position}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 210,
                      damping: 29,
                      mass: 0.9,
                      opacity: { duration: 0.22 },
                    }
              }
              aria-label={`${isActive ? "Explore" : "Show"} ${trip.title}, ${trip.year}`}
              aria-hidden={!isVisible}
              tabIndex={isVisible ? 0 : -1}
              onClick={() => {
                if (isActive) onSelect(trip);
                else setSelectedSlug(trip.slug);
              }}
            >
              <motion.div
                className="coverflow-photo absolute inset-0 overflow-hidden rounded-[inherit]"
                layoutId={isActive ? `cover-${trip.slug}` : undefined}
              >
                <Image
                  src={trip.cover}
                  alt={trip.coverAlt}
                  fill
                  sizes="(max-width: 640px) 76vw, (max-width: 900px) 38vw, (max-width: 2207px) 29vw, 640px"
                  draggable={false}
                  className="object-cover"
                />
              </motion.div>
              {isActive && (
                <>
                  <span className="gallery-year">{trip.year}</span>
                  <span className="cover-arrow !translate-x-0 !translate-y-0 !opacity-100">
                    <ArrowUpRight size={18} />
                  </span>
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="coverflow-caption" aria-live="polite" aria-atomic="true">
        <h2>{selectedTrip.title}</h2>
        <p>
          {selectedTrip.city} <span>·</span> {formatMonth(selectedTrip.date)}{" "}
          {selectedTrip.year}
        </p>
      </div>
      <div className="coverflow-controls" aria-label="Gallery navigation">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous adventure"
          disabled={trips.length < 2}
          onClick={() => move(-1)}
        >
          <ArrowLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next adventure"
          disabled={trips.length < 2}
          onClick={() => move(1)}
        >
          <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
}
