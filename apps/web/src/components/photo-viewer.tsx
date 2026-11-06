"use client";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, MapPin, X } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@fami-li/ui";
import type { Photo } from "@fami-li/data";
export function PhotoViewer({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: readonly Photo[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const photo = index === null ? undefined : photos[index];
  const reducedMotion = useReducedMotion();
  const currentIndex = index ?? 0;
  function move(direction: number) {
    onIndexChange((currentIndex + direction + photos.length) % photos.length);
  }
  return (
    <Dialog
      open={Boolean(photo)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="photo-viewer"
        overlayClassName="photo-overlay"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        <DialogTitle className="sr-only">
          {photo?.title ?? "Photograph"}
        </DialogTitle>
        <div className="photo-viewer-top">
          <span>
            {String(currentIndex + 1).padStart(2, "0")}{" "}
            <span className="opacity-40">
              / {String(photos.length).padStart(2, "0")}
            </span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close photograph"
          >
            <X size={20} />
          </Button>
        </div>
        <div className="photo-viewer-stage">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous photograph"
            onClick={() => move(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <AnimatePresence mode="wait" initial={false}>
            {photo && (
              <motion.div
                key={photo.id}
                className="photo-full"
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.25 }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next photograph"
            onClick={() => move(1)}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
        <div className="photo-context">
          <h2 className="mb-3 text-lg font-medium">{photo?.title}</h2>
          <p className="flex items-center justify-center gap-2 text-xs text-white/50">
            <MapPin size={12} />
            {photo?.location}
          </p>
          <DialogDescription className="photo-caption">
            {photo?.caption}
          </DialogDescription>
          <p className="mt-4 text-[10px] text-white/30">
            A little piece of being there.{" "}
            <span className="ml-2">← → to wander</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
