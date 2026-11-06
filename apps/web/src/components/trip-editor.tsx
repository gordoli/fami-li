"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Plus, Trash2, Upload, X } from "lucide-react";
import type { Photo, Trip } from "@fami-li/data";
import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Textarea,
} from "@fami-li/ui";

const MAX_PHOTOS = 12;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const COUNTRY_LOCATIONS: Record<
  string,
  { coordinates: [number, number]; continent: string }
> = {
  iceland: { coordinates: [-19.02, 64.96], continent: "Europe" },
  "south africa": { coordinates: [24, -29], continent: "Africa" },
  china: { coordinates: [104.2, 35.86], continent: "Asia" },
  "united kingdom": { coordinates: [-3.44, 55.38], continent: "Europe" },
  uk: { coordinates: [-3.44, 55.38], continent: "Europe" },
  greece: { coordinates: [21.82, 39.07], continent: "Europe" },
  japan: { coordinates: [138.25, 36.2], continent: "Asia" },
  italy: { coordinates: [12.57, 41.87], continent: "Europe" },
  canada: { coordinates: [-106.35, 56.13], continent: "North America" },
  portugal: { coordinates: [-8.22, 39.4], continent: "Europe" },
  "new zealand": { coordinates: [174.89, -40.9], continent: "Oceania" },
  switzerland: { coordinates: [8.23, 46.82], continent: "Europe" },
};

type PhotoDraft = Photo & { title: string };
type TripEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
  onSave: (trip: Trip) => Promise<void>;
};

function readPhoto(file: File): Promise<PhotoDraft> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error(`We couldn't read ${file.name}. Please try it again.`));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(
          new Error(`We couldn't read ${file.name}. Please try it again.`),
        );
        return;
      }
      const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      resolve({
        id: crypto.randomUUID(),
        src: reader.result,
        title,
        alt: title,
        caption: "",
        location: "",
      });
    };
    reader.readAsDataURL(file);
  });
}

export function TripEditor({
  open,
  onOpenChange,
  trip,
  onSave,
}: TripEditorProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="editor-sheet">
        {open && (
          <TripEditorForm
            key={trip?.slug ?? "new-adventure"}
            trip={trip}
            onSave={onSave}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function TripEditorForm({
  trip,
  onSave,
  onClose,
}: {
  trip: Trip | null;
  onSave: (trip: Trip) => Promise<void>;
  onClose: () => void;
}) {
  const [photos, setPhotos] = useState<PhotoDraft[]>(() =>
    (trip?.photos ?? []).map((photo) => ({
      ...photo,
      title:
        "title" in photo && typeof photo.title === "string"
          ? photo.title
          : photo.alt,
    })),
  );
  const [coverId, setCoverId] = useState(
    () =>
      trip?.photos.find((photo) => photo.src === trip.cover)?.id ??
      trip?.photos[0]?.id ??
      "",
  );
  const [isReading, setIsReading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const isBusy = isSaving || isReading;

  async function addFiles(files: File[]) {
    if (isBusy || files.length === 0) return;
    setUploadError("");
    if (photos.length + files.length > MAX_PHOTOS) {
      setUploadError(
        `An adventure can have up to ${MAX_PHOTOS} photos. Please select fewer files.`,
      );
      return;
    }
    const invalidFile = files.find(
      (file) =>
        !ALLOWED_PHOTO_TYPES.has(file.type) || file.size > MAX_PHOTO_BYTES,
    );
    if (invalidFile) {
      setUploadError(
        `${invalidFile.name} must be a JPG, PNG, WebP, or AVIF image, no larger than 10 MB.`,
      );
      return;
    }
    setIsReading(true);
    try {
      const additions = await Promise.all(files.map(readPhoto));
      setPhotos((current) => [...current, ...additions]);
      setCoverId((current) => current || additions[0]?.id || "");
    } catch (readError) {
      setUploadError(
        readError instanceof Error
          ? readError.message
          : "We couldn't read these photos. Please try again.",
      );
    } finally {
      setIsReading(false);
    }
  }

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    void addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function dropFiles(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void addFiles(Array.from(event.dataTransfer.files));
  }

  function updatePhoto(id: string, values: Partial<PhotoDraft>) {
    setPhotos((current) =>
      current.map((photo) =>
        photo.id === id ? { ...photo, ...values } : photo,
      ),
    );
  }

  function removePhoto(id: string) {
    setPhotos((current) => current.filter((photo) => photo.id !== id));
    if (coverId === id)
      setCoverId(photos.find((photo) => photo.id !== id)?.id ?? "");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;
    setError("");
    const values = new FormData(event.currentTarget);
    const text = (name: string) => String(values.get(name) ?? "").trim();
    const title = text("title");
    const city = text("city");
    const country = text("country");
    const date = text("date");
    const endDate = text("endDate") || date;
    if (
      !title ||
      !city ||
      !country ||
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      setError("Please add a title, city, country, and valid travel date.");
      return;
    }
    if (endDate < date) {
      setError("The end date must be on or after the start date.");
      return;
    }
    const cover = photos.find((photo) => photo.id === coverId) ?? photos[0];
    if (!cover) {
      setError("Add at least one photo to your adventure.");
      return;
    }
    const location = COUNTRY_LOCATIONS[country.toLowerCase()];
    const longitudeText = text("longitude");
    const latitudeText = text("latitude");
    if (Boolean(longitudeText) !== Boolean(latitudeText)) {
      setError("For a custom globe pin, enter both longitude and latitude.");
      return;
    }
    const coordinates: [number, number] | null =
      longitudeText && latitudeText
        ? [Number(longitudeText), Number(latitudeText)]
        : (location?.coordinates ?? null);
    if (
      coordinates &&
      (!coordinates.every(Number.isFinite) ||
        Math.abs(coordinates[0]) > 180 ||
        Math.abs(coordinates[1]) > 90)
    ) {
      setError(
        "Longitude must be between −180 and 180, and latitude between −90 and 90.",
      );
      return;
    }
    const notes = text("notes");
    const story = text("story")
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    const updatedPhotos = photos.map((photo) => ({
      ...photo,
      title: photo.title.trim() || "Untitled photo",
      alt: photo.alt || photo.title.trim() || `${city}, ${country}`,
      location: photo.location || city,
    }));
    const updatedTrip: Trip = {
      ...trip,
      slug:
        trip?.slug ??
        `${
          title
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "adventure"
        }-${crypto.randomUUID().slice(0, 8)}`,
      title,
      city,
      country,
      date,
      startDate: date,
      endDate,
      year: Number(date.slice(0, 4)),
      subtitle: trip?.subtitle ?? `A little adventure in ${city}.`,
      continent: location?.continent ?? trip?.continent ?? "The world",
      travelers: text("travelers")
        .split(",")
        .map((traveler) => traveler.trim())
        .filter(Boolean),
      coordinates,
      notes,
      story,
      cover: cover.src,
      cover_photo: cover.src,
      coverAlt: cover.alt || cover.title.trim(),
      accent: trip?.accent ?? "#7954d5",
      itinerary: trip?.itinerary.length
        ? trip.itinerary
        : [
            {
              day: "The adventure",
              title: city,
              description: notes || `Time together in ${city}, ${country}.`,
            },
          ],
      photos: updatedPhotos,
    };
    setIsSaving(true);
    try {
      await onSave(updatedTrip);
      onClose();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Your adventure couldn't be saved. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="editor-form" onSubmit={submit}>
      <header className="editor-header flex items-start justify-between gap-5">
        <div>
          <p className="eyebrow mb-3">A new chapter</p>
          <SheetTitle className="text-3xl font-medium tracking-[-0.04em]">
            {trip ? "Edit adventure" : "Add an adventure"}
          </SheetTitle>
          <SheetDescription className="mt-2 text-sm text-muted-foreground">
            A place, a few photographs, and the story you want to remember.
          </SheetDescription>
        </div>
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close adventure editor"
            disabled={isBusy}
          >
            <X size={18} />
          </Button>
        </SheetClose>
      </header>
      <div className="editor-body space-y-7">
        <p className="rounded-md bg-[#f7f3fe] px-4 py-3 text-xs leading-relaxed text-[#70617f]">
          Your adventures and photos are saved in this browser for this mockup.
        </p>
        <fieldset disabled={isBusy} className="space-y-5 disabled:opacity-70">
          <legend className="sr-only">Adventure details</legend>
          <div className="space-y-2">
            <Label htmlFor="trip-title">
              Adventure title <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="trip-title"
              name="title"
              placeholder="A summer in Greece"
              defaultValue={trip?.title}
              required
              maxLength={120}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trip-city">
                City <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="trip-city"
                name="city"
                placeholder="Athens"
                defaultValue={trip?.city}
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-country">
                Country <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="trip-country"
                name="country"
                placeholder="Greece"
                defaultValue={trip?.country}
                required
                maxLength={120}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trip-date">
                Start date <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="trip-date"
                name="date"
                type="date"
                defaultValue={trip?.date ?? trip?.startDate}
                required
                min="1900-01-01"
                max="2100-12-31"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-end-date">End date</Label>
              <Input
                id="trip-end-date"
                name="endDate"
                type="date"
                defaultValue={trip?.endDate}
                min="1900-01-01"
                max="2100-12-31"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-travelers">Who came along?</Label>
            <Input
              id="trip-travelers"
              name="travelers"
              placeholder="Dad, Mom, Gordon"
              defaultValue={trip?.travelers.join(", ")}
              maxLength={400}
            />
            <p className="text-xs text-muted-foreground">
              Separate names with a comma.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-notes">A few notes</Label>
            <Textarea
              id="trip-notes"
              name="notes"
              placeholder="The little things we don't want to forget…"
              defaultValue={trip?.notes}
              rows={3}
              maxLength={5000}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-story">The story</Label>
            <Textarea
              id="trip-story"
              name="story"
              placeholder="It all started with…"
              defaultValue={trip?.story.join("\n\n")}
              rows={6}
              maxLength={30000}
            />
            <p className="text-xs text-muted-foreground">
              Leave a blank line between paragraphs.
            </p>
          </div>
          <details className="rounded-md border border-border px-4 py-3">
            <summary className="cursor-pointer text-xs font-medium">
              Globe pin location{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </summary>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Known countries use a country-level pin. For another location,
              enter coordinates. Without coordinates, other places appear in the
              trip list until you add a pin.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trip-longitude">Longitude</Label>
                <Input
                  id="trip-longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  min={-180}
                  max={180}
                  placeholder="−180 to 180"
                  defaultValue={trip?.coordinates?.[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-latitude">Latitude</Label>
                <Input
                  id="trip-latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  min={-90}
                  max={90}
                  placeholder="−90 to 90"
                  defaultValue={trip?.coordinates?.[1]}
                />
              </div>
            </div>
          </details>
        </fieldset>
        <section className="space-y-4" aria-labelledby="editor-photos-title">
          <div className="flex items-baseline justify-between">
            <h3 id="editor-photos-title" className="text-sm font-medium">
              Photographs <span aria-hidden="true">*</span>
            </h3>
            <span className="text-xs text-muted-foreground">
              {photos.length} / {MAX_PHOTOS}
            </span>
          </div>
          <div
            className={`editor-dropzone rounded-lg border border-dashed p-6 text-center transition-colors ${isDragging ? "border-[#7954d5] bg-[#f7f3fe]" : "border-border"}`}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isBusy) setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              )
                setIsDragging(false);
            }}
            onDrop={dropFiles}
          >
            <ImagePlus size={25} className="mx-auto mb-3 text-[#8a70b6]" />
            <p className="mb-1 text-sm">Drop your photographs here</p>
            <p className="mb-4 text-xs text-muted-foreground">
              JPG, PNG, WebP or AVIF · Up to 10 MB each
            </p>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              tabIndex={-1}
              aria-label="Choose adventure photos"
              onChange={chooseFiles}
              disabled={isBusy || photos.length >= MAX_PHOTOS}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isBusy || photos.length >= MAX_PHOTOS}
              onClick={() => fileInput.current?.click()}
            >
              {isReading ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              {isReading ? "Reading photos…" : "Choose photos"}
            </Button>
            <p className="sr-only" aria-live="polite">
              {isReading
                ? "Reading selected photos"
                : `${photos.length} photos added`}
            </p>
          </div>
          {uploadError && (
            <p role="alert" className="text-xs text-red-700">
              {uploadError}
            </p>
          )}
          <fieldset disabled={isBusy} className="space-y-4">
            <legend className="sr-only">
              Photo titles, captions, and cover image
            </legend>
            {photos.map((photo, index) => (
              <div
                className="editor-photo rounded-lg border border-border p-3"
                key={photo.id}
              >
                <div className="mb-3 flex gap-3">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={88}
                    height={72}
                    className="h-[72px] w-[88px] shrink-0 rounded object-cover"
                    unoptimized
                  />
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-xs">
                      <input
                        className="accent-[#7954d5]"
                        type="radio"
                        name="cover-photo"
                        value={photo.id}
                        checked={coverId === photo.id}
                        onChange={() => setCoverId(photo.id)}
                      />
                      {coverId === photo.id
                        ? "Cover photograph"
                        : "Use as cover"}
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="!h-7 !justify-start !px-0 text-muted-foreground"
                      onClick={() => removePhoto(photo.id)}
                      aria-label={`Remove photo ${index + 1}: ${photo.title}`}
                    >
                      <Trash2 size={12} />
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`photo-title-${photo.id}`}>Photo title</Label>
                  <Input
                    id={`photo-title-${photo.id}`}
                    value={photo.title}
                    onChange={(event) =>
                      updatePhoto(photo.id, { title: event.target.value })
                    }
                    placeholder="A moment to remember"
                    maxLength={160}
                  />
                </div>
                <div className="mt-3 space-y-2">
                  <Label htmlFor={`photo-caption-${photo.id}`}>Caption</Label>
                  <Textarea
                    id={`photo-caption-${photo.id}`}
                    value={photo.caption}
                    onChange={(event) =>
                      updatePhoto(photo.id, { caption: event.target.value })
                    }
                    placeholder="What's the story behind this photograph?"
                    rows={2}
                    maxLength={2000}
                  />
                </div>
              </div>
            ))}
          </fieldset>
        </section>
        {error && (
          <p
            role="alert"
            className="rounded-md bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>
      <footer className="editor-footer flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isBusy}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isSaving ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : !trip ? (
            <Plus size={15} />
          ) : null}
          {isSaving ? "Saving…" : trip ? "Save changes" : "Save adventure"}
        </Button>
      </footer>
    </form>
  );
}
