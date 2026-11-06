"use client";
import { useEffect, useRef, type PointerEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MoveHorizontal,
} from "lucide-react";
import type { Trip } from "@fami-li/data";
import { Button } from "@fami-li/ui";
import { formatMonth } from "@/lib/format";

type TimelineProps = {
  trips: readonly Trip[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onSelect: (trip: Trip) => void;
};

export function Timeline({
  trips,
  activeIndex,
  onActiveChange,
  onSelect,
}: TimelineProps) {
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);
  const didDrag = useRef(false);
  const reducedMotion = useReducedMotion();
  const initialIndex = useRef(activeIndex);
  useEffect(() => {
    const node = rail.current;
    const card = node?.querySelector<HTMLElement>(
      `[data-trip-index="${initialIndex.current}"]`,
    );
    if (node && card)
      node.scrollLeft =
        card.offsetLeft -
        node.offsetLeft -
        parseFloat(getComputedStyle(node).paddingLeft);
  }, []);
  function goTo(index: number) {
    const card = rail.current?.querySelector<HTMLElement>(
      `[data-trip-index="${index}"]`,
    );
    if (!card || !rail.current) return;
    rail.current.scrollTo({
      left:
        card.offsetLeft -
        rail.current.offsetLeft -
        parseFloat(getComputedStyle(rail.current).paddingLeft),
      behavior: reducedMotion ? "instant" : "smooth",
    });
    onActiveChange(index);
  }
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    didDrag.current = false;
    drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft };
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const origin = drag.current;
    if (!origin) return;
    const delta = event.clientX - origin.x;
    if (Math.abs(delta) > 6) {
      didDrag.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.scrollLeft = origin.scroll - delta;
    }
  }
  return (
    <section className="timeline-section" aria-label="Adventure timeline">
      <div
        className="timeline-rail"
        ref={rail}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
        onClickCapture={(event) => {
          if (didDrag.current) {
            event.preventDefault();
            event.stopPropagation();
            didDrag.current = false;
          }
        }}
        onScroll={() => {
          const node = rail.current;
          if (!node) return;
          const cards = Array.from(
            node.querySelectorAll<HTMLElement>("[data-trip-index]"),
          );
          const left = node.scrollLeft;
          const gutter = parseFloat(getComputedStyle(node).paddingLeft);
          const nearest = cards.reduce(
            (best, card, index) =>
              Math.abs(card.offsetLeft - node.offsetLeft - gutter - left) <
              best.distance
                ? {
                    index,
                    distance: Math.abs(
                      card.offsetLeft - node.offsetLeft - gutter - left,
                    ),
                  }
                : best,
            { index: 0, distance: Infinity },
          );
          if (nearest.index !== activeIndex) onActiveChange(nearest.index);
        }}
      >
        {trips.map((trip, index) => (
          <motion.article
            key={trip.slug}
            className={`timeline-card ${index === activeIndex ? "is-active" : ""}`}
            data-trip-index={index}
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 32,
              scale: reducedMotion ? 1 : 0.96,
            }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ root: rail, amount: 0.15, once: false }}
            transition={{
              duration: reducedMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="timeline-year">
              <span className="timeline-dot" />
              <span>{trip.year}</span>
              {index === 0 && (
                <span className="beginning-note">the beginning</span>
              )}
            </div>
            <button
              className="trip-card-button"
              onClick={() => onSelect(trip)}
              aria-label={`Explore ${trip.title}, ${trip.year}`}
            >
              <motion.div
                className="trip-cover"
                layoutId={`cover-${trip.slug}`}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={trip.cover}
                  alt={trip.coverAlt}
                  fill
                  sizes="(max-width: 640px) 78vw, 340px"
                  priority={index < 3}
                  draggable={false}
                />
                <span className="cover-arrow">
                  <ArrowUpRight size={18} />
                </span>
                <span className="photo-count">
                  {trip.photos.length} photograph
                  {trip.photos.length === 1 ? "" : "s"}
                </span>
              </motion.div>
              <div className="trip-card-caption">
                <h2>{trip.title}</h2>
                <p>
                  {trip.city} <span>·</span> {formatMonth(trip.date)}
                </p>
              </div>
            </button>
          </motion.article>
        ))}
        <div className="timeline-end-spacer" aria-hidden="true" />
      </div>
      <div className="timeline-controls page-gutter">
        <div className="drag-hint">
          <MoveHorizontal size={15} />
          <span>Drag to wander. Click to remember.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="timeline-counter">
            {String(activeIndex + 1).padStart(2, "0")}{" "}
            <span>/ {String(trips.length).padStart(2, "0")}</span>
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous adventure"
            disabled={activeIndex === 0}
            onClick={() => goTo(Math.max(0, activeIndex - 1))}
          >
            <ArrowLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next adventure"
            disabled={activeIndex === trips.length - 1}
            onClick={() => goTo(Math.min(trips.length - 1, activeIndex + 1))}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
      <div className="year-navigation page-gutter" aria-label="Jump to year">
        {trips.map((trip, index) => (
          <button
            key={trip.slug}
            className={index === activeIndex ? "active" : ""}
            aria-current={index === activeIndex ? "date" : undefined}
            onClick={() => goTo(index)}
          >
            <span className="year-tick" />
            {trip.year}
          </button>
        ))}
        <span className="year-present">
          TO BE CONTINUED <span>↗</span>
        </span>
      </div>
    </section>
  );
}
