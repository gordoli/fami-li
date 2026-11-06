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

  const projectedTrips = visibleTrips.flatMap((trip) => {
    const point = trip.coordinates && projection(trip.coordinates);
    return point ? [{ trip, point }] : [];
  });
  const highlightedPin = projectedTrips.find(
    ({ trip }) => trip.slug === highlightedSlug,
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
      className="globe-scene"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsFocused(false);
      }}
    >
      <div className="globe-visual">
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
          {projectedTrips.map(({ trip, point }) => {
            const isHighlighted = trip.slug === highlightedSlug;
            // Keep nearby city targets distinct while allowing a 40px target elsewhere.
            const nearestPinDistance = Math.min(
              ...projectedTrips
                .filter((pin) => pin.trip.slug !== trip.slug)
                .map((pin) =>
                  Math.hypot(pin.point[0] - point[0], pin.point[1] - point[1]),
                ),
            );
            const hitRadius = Math.max(
              8,
              Math.min(20, nearestPinDistance / 2 - 1),
            );
            return (
              <g key={trip.slug}>
                <circle
                  cx={point[0]}
                  cy={point[1]}
                  r={isHighlighted ? 16 : 12}
                  fill="var(--primary)"
                  opacity={0.2}
                />
                <foreignObject
                  x={point[0] - 20}
                  y={point[1] - 20}
                  width={40}
                  height={40}
                  style={{ overflow: "visible", pointerEvents: "none" }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="globe-pin !h-10 !w-10 !rounded-full !p-0 hover:!bg-transparent focus-visible:!ring-primary"
                    style={{
                      pointerEvents: "auto",
                      clipPath: `circle(${hitRadius}px at center)`,
                    }}
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
                    <span className="block h-4 w-4 rounded-full border-2 border-[#ffffff] bg-primary shadow-sm" />
                  </Button>
                </foreignObject>
              </g>
            );
          })}
          {highlightedPin && (
            <foreignObject
              x={Math.max(
                8,
                Math.min(GLOBE_SIZE - 184, highlightedPin.point[0] - 88),
              )}
              y={Math.max(
                8,
                Math.min(
                  GLOBE_SIZE - 152,
                  highlightedPin.point[1] > 170
                    ? highlightedPin.point[1] - 164
                    : highlightedPin.point[1] + 24,
                ),
              )}
              width={176}
              height={144}
              pointerEvents="none"
              style={{ overflow: "visible" }}
            >
              <div className="globe-preview" role="tooltip">
                <Image
                  src={highlightedPin.trip.cover}
                  alt=""
                  width={160}
                  height={90}
                  className="globe-preview-image h-[90px] w-[160px] rounded-[4px] object-cover"
                />
                <div className="globe-preview-caption">
                  <strong>{highlightedPin.trip.title}</strong>
                  <span>{highlightedPin.trip.year}</span>
                </div>
              </div>
            </foreignObject>
          )}
        </svg>
        <div className="globe-instructions">
          <span className="flex items-center gap-2">
            <Move size={12} /> Drag to explore
          </span>
          <span className="h-3 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            className="globe-rotation !text-muted-foreground"
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
      <div className="globe-sidebar">
        <div className="divide-y divide-border">
          {trips.map((trip) => (
            <Button
              key={trip.slug}
              variant="ghost"
              className="globe-trip hover:!bg-transparent"
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
                className="globe-trip-image"
              />
              <span className="globe-trip-title">{trip.title}</span>
              <span className="globe-trip-year">{trip.year}</span>
              <ArrowUpRight size={13} className="text-muted-foreground" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
