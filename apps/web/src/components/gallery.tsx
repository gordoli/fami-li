"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Trip } from "@fami-li/data";
import { Button } from "@fami-li/ui";
import { formatMonth } from "@/lib/format";
export function Gallery({
  trips,
  onSelect,
}: {
  trips: readonly Trip[];
  onSelect: (trip: Trip) => void;
}) {
  const [filter, setFilter] = useState("All places");
  const reducedMotion = useReducedMotion();
  const titles = [...new Set(trips.map((trip) => trip.title))];
  const activeFilter = titles.includes(filter) ? filter : "All places";
  const filtered =
    activeFilter === "All places"
      ? trips
      : trips.filter((trip) => trip.title === activeFilter);
  return (
    <section
      className="gallery-view page-gutter"
      aria-label="Adventure gallery"
    >
      <div
        className="gallery-filters"
        aria-label="Filter gallery by destination"
      >
        {["All places", ...titles].map((label) => (
          <Button
            key={label}
            variant={activeFilter === label ? "default" : "outline"}
            size="sm"
            aria-pressed={activeFilter === label}
            onClick={() => setFilter(label)}
          >
            {label}
          </Button>
        ))}
      </div>
      <motion.div layout className="gallery-grid">
        {filtered.map((trip, index) => (
          <motion.button
            layout
            key={trip.slug}
            className="gallery-trip"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
              duration: reducedMotion ? 0 : 0.6,
              delay: Math.min(index * 0.05, 0.25),
            }}
            onClick={() => onSelect(trip)}
            aria-label={`Explore ${trip.title}, ${trip.year}`}
          >
            <div className="gallery-photo">
              <Image
                src={trip.cover}
                alt={trip.coverAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="gallery-year">{trip.year}</span>
              <span className="cover-arrow">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div className="trip-card-caption">
              <h2>{trip.title}</h2>
              <p>
                {trip.city} <span>·</span> {formatMonth(trip.date)}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
