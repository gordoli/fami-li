"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Move, Pause, Play } from "lucide-react";
import { Button } from "@fami-li/ui";
import type { Trip } from "@fami-li/data";
import land from "@/lib/world-land.json";

const GLOBE_SIZE = 540;
const GLOBE_RADIUS = 234;
const graticule = geoGraticule10();
// Natural Earth 1:110m public-domain land, simplified only by removing metadata.
const landGeometry = {
  type: "MultiPolygon" as const,
  coordinates: land.coordinates,
};

type Rotation = [number, number, number];
type DragOrigin = { x: number; y: number; rotation: Rotation };

export function Globe({
  trips,
  onSelect,
}: {
  trips: readonly Trip[];
  onSelect: (trip: Trip) => void;
}) {
  const [rotation, setRotation] = useState<Rotation>([-12, -18, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const dragOrigin = useRef<DragOrigin | null>(null);
  const hasDragged = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (
      prefersReducedMotion !== false ||
      isHovered ||
      isFocused ||
      isPaused ||
      isDragging
    )
      return;
    let animationFrame = 0;
    let previousTime: number | undefined;
    function rotate(time: number) {
      if (previousTime !== undefined) {
        const elapsed = Math.min(time - previousTime, 64);
        setRotation(([longitude, latitude, roll]) => [
          longitude + elapsed * 0.0025,
          latitude,
          roll,
        ]);
      }
      previousTime = time;
      animationFrame = requestAnimationFrame(rotate);
    }
    animationFrame = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animationFrame);
  }, [prefersReducedMotion, isHovered, isFocused, isPaused, isDragging]);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([GLOBE_SIZE / 2, GLOBE_SIZE / 2])
        .scale(GLOBE_RADIUS)
        .rotate(rotation)
        .clipAngle(90),
    [rotation],
  );
  const path = geoPath(projection);
  const visibleTrips = trips.filter(
    (trip) =>
      trip.coordinates !== null &&
      geoDistance(trip.coordinates, [-rotation[0], -rotation[1]]) <
        Math.PI / 2 - 0.03,
  );

  function beginDrag(event: PointerEvent<SVGSVGElement>) {
    hasDragged.current = false;
    if (
      event.button !== 0 ||
      (event.target instanceof Element && event.target.closest("button"))
    )
      return;
    dragOrigin.current = { x: event.clientX, y: event.clientY, rotation };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function moveDrag(event: PointerEvent<SVGSVGElement>) {
    const origin = dragOrigin.current;
    if (!origin) return;
    const deltaX = event.clientX - origin.x;
    const deltaY = event.clientY - origin.y;
    if (Math.hypot(deltaX, deltaY) > 4) hasDragged.current = true;
    const scale =
      GLOBE_SIZE / event.currentTarget.getBoundingClientRect().width;
    setRotation([
      origin.rotation[0] + deltaX * scale * 0.24,
      Math.max(-75, Math.min(75, origin.rotation[1] - deltaY * scale * 0.24)),
      0,
    ]);
  }

  function endDrag() {
    dragOrigin.current = null;
    setIsDragging(false);
  }

  return (
    <div
      className="globe-scene grid items-center gap-8 md:grid-cols-[1.3fr_0.7fr]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsFocused(false);
      }}
    >
      <div className="relative mx-auto w-full max-w-[560px]">
        <svg
          className="globe-canvas w-full touch-none select-none"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          viewBox={`0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`}
          role="group"
          aria-label="Interactive globe. Drag to rotate or use arrow keys. Select a purple pin to open an adventure."
          tabIndex={0}
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            const increments: Record<string, [number, number]> = {
              ArrowLeft: [-12, 0],
              ArrowRight: [12, 0],
              ArrowUp: [0, 10],
              ArrowDown: [0, -10],
            };
            const increment = increments[event.key];
            if (!increment) return;
            event.preventDefault();
            setRotation(([longitude, latitude]) => [
              longitude + increment[0],
              Math.max(-75, Math.min(75, latitude + increment[1])),
              0,
            ]);
          }}
        >
          <defs>
            <radialGradient id="globe-ocean" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="var(--background)" />
              <stop offset="75%" stopColor="var(--globe-ocean)" />
              <stop offset="100%" stopColor="var(--muted)" />
            </radialGradient>
          </defs>
          <circle
            cx={270}
            cy={270}
            r={GLOBE_RADIUS}
            fill="url(#globe-ocean)"
            stroke="var(--globe-grid)"
            strokeWidth="0.8"
          />
          <path
            d={path(graticule) ?? undefined}
            fill="none"
            stroke="var(--globe-grid)"
            strokeWidth="0.6"
          />
          <path
            d={path(landGeometry) ?? undefined}
            fill="var(--globe-land)"
            stroke="var(--globe-ocean)"
            strokeWidth="0.35"
          />
          {visibleTrips.map((trip) => {
            if (!trip.coordinates) return null;
            const point = projection(trip.coordinates);
            if (!point) return null;
            const isHighlighted = trip.slug === highlightedSlug;
            return (
              <g key={trip.slug}>
                <circle
                  cx={point[0]}
                  cy={point[1]}
                  r={isHighlighted ? 13 : 9}
                  fill="var(--primary)"
                  opacity={0.2}
                />
                <foreignObject
                  x={point[0] - 16}
                  y={point[1] - 16}
                  width={32}
                  height={32}
                  style={{ overflow: "visible" }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="globe-pin !h-8 !w-8 !rounded-full !p-0 hover:!bg-transparent focus-visible:!ring-[#7954d5]"
                    aria-label={`Open ${trip.title}, ${trip.year}`}
                    onMouseEnter={() => setHighlightedSlug(trip.slug)}
                    onMouseLeave={() => setHighlightedSlug(null)}
                    onFocus={() => setHighlightedSlug(trip.slug)}
                    onBlur={() => setHighlightedSlug(null)}
                    onClick={(event) => {
                      if (event.detail === 0 || !hasDragged.current)
                        onSelect(trip);
                    }}
                  >
                    <span className="block h-[11px] w-[11px] rounded-full border-2 border-[#ffffff] bg-primary shadow-sm" />
                  </Button>
                </foreignObject>
                {isHighlighted && (
                  <g pointerEvents="none">
                    <rect
                      x={point[0] - 66}
                      y={point[1] - 44}
                      width={132}
                      height={25}
                      rx={3}
                      fill="#211d29"
                    />
                    <text
                      x={point[0]}
                      y={point[1] - 28}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={10}
                      fontFamily="inherit"
                    >
                      {trip.title} · {trip.year}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        <div className="globe-instructions flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <Move size={12} /> Drag to explore
          </span>
          <span className="h-3 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            className="!h-7 !px-1 !text-[11px] !text-muted-foreground"
            aria-label={
              prefersReducedMotion
                ? "Globe rotation disabled by reduced motion preference"
                : isPaused
                  ? "Start globe rotation"
                  : "Pause globe rotation"
            }
            aria-pressed={isPaused || Boolean(prefersReducedMotion)}
            disabled={Boolean(prefersReducedMotion)}
            onClick={() => setIsPaused((paused) => !paused)}
          >
            {isPaused || prefersReducedMotion ? (
              <Play size={11} />
            ) : (
              <Pause size={11} />
            )}
            {prefersReducedMotion
              ? "Motion paused"
              : isPaused
                ? "Resume rotation"
                : "Pause rotation"}
          </Button>
        </div>
      </div>
      <div className="globe-sidebar mx-auto w-full max-w-[310px] pb-4">
        <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Our little corner of the world
        </p>
        <div className="divide-y divide-border">
          {trips.map((trip) => (
            <Button
              key={trip.slug}
              variant="ghost"
              className="globe-trip !flex !h-auto !w-full !justify-start !gap-3 !rounded-none !px-0 !py-3 hover:!bg-transparent"
              onMouseEnter={() => setHighlightedSlug(trip.slug)}
              onMouseLeave={() => setHighlightedSlug(null)}
              onFocus={() => setHighlightedSlug(trip.slug)}
              onBlur={() => setHighlightedSlug(null)}
              onClick={() => onSelect(trip)}
            >
              <Image
                src={trip.cover}
                alt=""
                width={44}
                height={38}
                className="h-[38px] w-11 rounded-[2px] object-cover"
              />
              <span className="flex-1 text-left text-[13px] font-medium">
                {trip.title}
              </span>
              <span className="text-[11px] font-normal tabular-nums text-muted-foreground">
                {trip.year}
              </span>
              <ArrowUpRight size={13} className="text-muted-foreground" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
