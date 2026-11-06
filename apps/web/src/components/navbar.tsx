"use client";
import { Moon, Plus, Sun } from "lucide-react";
import { Button } from "@fami-li/ui";
export function Navbar({
  isDark,
  onToggleTheme,
  onAdd,
  onHome,
  canAdd = true,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  onAdd: () => void;
  onHome: () => void;
  canAdd?: boolean;
}) {
  return (
    <header className="navbar">
      <div aria-hidden="true" />
      <button
        className="logomark"
        onClick={onHome}
        aria-label="Fami-Li Adventures home"
      >
        Fami-Li Adventures
      </button>
      <div className="navbar-actions">
        <Button
          variant="outline"
          size="sm"
          className="glass-add"
          aria-label="Add adventure"
          onClick={onAdd}
          disabled={!canAdd}
        >
          <Plus size={15} />
          <span>Add</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          onClick={onToggleTheme}
          className="theme-toggle"
        >
          {isDark ? <Sun size={17} /> : <Moon size={16} />}
        </Button>
      </div>
    </header>
  );
}
