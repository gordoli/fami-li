"use client";
import {
  ArrowLeft,
  Globe2,
  Images,
  Moon,
  MoveHorizontal,
  Pencil,
  Plus,
  Sun,
} from "lucide-react";
import { Button } from "@fami-li/ui";
export type ViewMode = "timeline" | "gallery" | "globe";
const VIEWS = [
  { id: "timeline", label: "Timeline", icon: MoveHorizontal },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "globe", label: "Globe", icon: Globe2 },
] as const;
export function FloatingControls({
  view,
  onViewChange,
  isDark,
  onToggleTheme,
  onAdd,
  onEdit,
  onBack,
  canAdd = true,
}: {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onAdd: () => void;
  onEdit?: () => void;
  onBack?: () => void;
  canAdd?: boolean;
}) {
  return (
    <>
      {onBack && (
        <div className="floating-back glass-actions">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to adventures"
            title="Back to adventures"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
          </Button>
        </div>
      )}
      <div
        className={`floating-controls${view === "timeline" && !onEdit ? " floating-controls--timeline" : ""}`}
      >
        {!onEdit && (
          <div
            className="glass-view-chooser"
            role="group"
            aria-label="Album view"
          >
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <Button
                variant="ghost"
                size="icon"
                key={id}
                aria-label={label}
                title={label}
                aria-pressed={view === id}
                onClick={() => onViewChange(id)}
                className={view === id ? "is-selected" : ""}
              >
                <Icon size={15} />
              </Button>
            ))}
          </div>
        )}
        <div className="glass-actions">
          <Button
            variant="ghost"
            size="icon"
            aria-label={onEdit ? "Edit adventure" : "Add adventure"}
            title={onEdit ? "Edit adventure" : "Add adventure"}
            disabled={!canAdd}
            onClick={onEdit ?? onAdd}
          >
            {onEdit ? <Pencil size={16} /> : <Plus size={18} />}
          </Button>
          <span className="glass-divider" />
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`${isDark ? "Light" : "Dark"} mode`}
            onClick={onToggleTheme}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </div>
    </>
  );
}
