"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Camera,
  MapPin,
  Plus,
  Pencil,
  Users,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@fami-li/ui";
import type { Trip } from "@fami-li/data";
import { formatDate, tripDuration } from "@/lib/format";
import { PhotoViewer } from "./photo-viewer";

export function TripStory({
  trip,
  open,
  onOpenChange,
  onCloseAutoFocus,
  onEdit,
  navbar,
}: {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus: () => void;
  onEdit: () => void;
  navbar: ReactNode;
}) {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const photos = trip.photos;
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
        {navbar}
        <div className="story-nav">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <ArrowLeft size={14} />
            Back to our adventures
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil size={13} />
            Edit adventure
          </Button>
        </div>
        <div className="story-heading">
          <div className="eyebrow">
            <span className="tiny-star">✳</span> CIRCA {trip.year}{" "}
            <span className="eyebrow-divider" /> {trip.continent}
          </div>
          <DialogTitle className="story-title">
            {trip.title}
            <span>.</span>
          </DialogTitle>
          <DialogDescription id="trip-description" className="story-subtitle">
            {trip.subtitle.replace(/[.!?]$/, "")}.{" "}
            {tripDuration(trip.startDate, trip.endDate)} days that stayed with
            us.
          </DialogDescription>
          {trip.notes && <p className="trip-notes">{trip.notes}</p>}
          <div className="trip-meta">
            <span>
              <CalendarDays size={14} />
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
            <span>
              <Users size={14} />
              {trip.travelers.join(", ")}
            </span>
            <span>
              <Camera size={14} />
              {photos.length} photographs
            </span>
          </div>
        </div>
        <motion.div
          className="story-hero"
          layoutId={`cover-${trip.slug}`}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={trip.cover}
            alt={trip.coverAlt}
            fill
            sizes="100vw"
            priority
          />
          <span className="story-image-label">
            <MapPin size={12} />
            {trip.country} · {trip.year}
          </span>
        </motion.div>
        <div className="story-editorial" id="story-text">
          <aside>
            <span className="eyebrow">THE STORY</span>
            <p className="story-author">
              Words by Dad
              <br />
              <span>Remembered together.</span>
            </p>
          </aside>
          <div className="story-prose">
            <h2>
              {trip.subtitle.replace(/[.!?]$/, "")}
              <span>.</span>
            </h2>
            {trip.story.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <span className="story-signature">
              With love, Dad <span>↗</span>
            </span>
          </div>
        </div>
        <section className="itinerary-section">
          <div className="section-label">
            <span className="eyebrow">THE PLACES IN BETWEEN</span>
            <h2>A little route. A lot of memories.</h2>
          </div>
          <div className="itinerary-stops">
            {trip.itinerary.map((stop, index) => (
              <div className="itinerary-stop" key={`${stop.day}-${index}`}>
                <span className="stop-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="stop-day">{stop.day}</p>
                <h3>{stop.title}</h3>
                <p>{stop.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="trip-gallery-section">
          <div className="trip-gallery-header">
            <div>
              <span className="eyebrow">THROUGH OUR EYES</span>
              <h2>
                The camera roll<span> ({photos.length})</span>
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Plus size={14} />
              Add photographs
            </Button>
          </div>
          <div className="trip-photo-grid">
            {photos.map((photo, index) => (
              <motion.button
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
                key={photo.id}
                className="trip-photo"
                onClick={() => setPhotoIndex(index)}
                aria-label={`View photograph: ${photo.alt}`}
              >
                <div>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <span className="cover-arrow">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
                <p>{photo.title}</p>
                <span>{photo.caption}</span>
              </motion.button>
            ))}
          </div>
        </section>
        <footer className="story-footer">
          <span>Some places become part of you.</span>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Back to the timeline <ArrowUpRight size={14} />
          </Button>
        </footer>
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
