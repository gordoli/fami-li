"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarDays, Camera, Plus, Users } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@fami-li/ui";
import type { Trip } from "@fami-li/data";
import { formatDate } from "@/lib/format";
import { PhotoViewer } from "./photo-viewer";
export function TripStory({
  trip,
  open,
  onOpenChange,
  onCloseAutoFocus,
  onEdit,
  controls,
}: {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus: () => void;
  onEdit: () => void;
  controls: ReactNode;
}) {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const photos = trip.photos;
  const paragraphs = trip.story.length
    ? trip.story
    : trip.notes
      ? [trip.notes]
      : [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="trip-story"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onCloseAutoFocus();
        }}
        aria-describedby="trip-description"
      >
        {controls}
        <div className="story-heading">
          <DialogTitle className="story-title">
            {trip.title}
            <span>.</span>
          </DialogTitle>
          <DialogDescription id="trip-description" className="story-subtitle">
            {trip.subtitle}
          </DialogDescription>
          <div className="trip-meta">
            <span>
              <CalendarDays size={14} />
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
            {trip.travelers.length > 0 && (
              <span>
                <Users size={14} />
                {trip.travelers.join(", ")}
              </span>
            )}
            <span>
              <Camera size={14} />
              {photos.length}{" "}
              {photos.length === 1 ? "photograph" : "photographs"}
            </span>
          </div>
        </div>
        <div className="story-cover-row">
          <div className="story-prose">
            <h2>Story</h2>
            {paragraphs.length ? (
              paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>This story is still waiting to be written.</p>
            )}
            {trip.itinerary.length > 0 && (
              <details className="compact-itinerary">
                <summary>Itinerary</summary>
                <div>
                  {trip.itinerary.map((stop, index) => (
                    <div key={`${stop.day}-${index}`}>
                      <span>{stop.day}</span>
                      <h3>{stop.title}</h3>
                      <p>{stop.description}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
          <motion.div
            className="story-cover-photo"
            layoutId={`cover-${trip.slug}`}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={trip.cover}
              alt={trip.coverAlt}
              fill
              sizes="(max-width:640px) 100vw, 33vw"
              priority
            />
          </motion.div>
        </div>
        <section className="trip-gallery-section">
          <div className="trip-gallery-header">
            <h2>Gallery</h2>
            <Button
              variant="outline"
              size="icon"
              aria-label="Add photographs"
              title="Add photographs"
              onClick={onEdit}
            >
              <Plus size={16} />
            </Button>
          </div>
          <div className="trip-photo-grid">
            {photos.map((photo, index) => (
              <Tooltip key={photo.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    className="trip-photo"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.55 }}
                    onClick={() => setPhotoIndex(index)}
                    aria-label={`View photograph: ${photo.title}`}
                  >
                    <div
                      style={{
                        aspectRatio:
                          index % 3 === 0
                            ? "4/5"
                            : index % 3 === 1
                              ? "4/3"
                              : "1/1",
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width:640px) 50vw, 33vw"
                      />
                      <div className="masonry-caption">
                        <h3>{photo.title}</h3>
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <strong>{photo.title}</strong>
                  <p>{photo.caption}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>
        <PhotoViewer
          photos={photos}
          index={photoIndex}
          onIndexChange={setPhotoIndex}
          onClose={() => setPhotoIndex(null)}
        />
      </DialogContent>
    </Dialog>
  );
}
