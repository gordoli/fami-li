import type { ComponentProps } from "react";
import { cn } from "../lib/utils";
export function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input type={type} className={cn("form-input", className)} {...props} />
  );
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn("form-input min-h-24 resize-y", className)}
      {...props}
    />
  );
}
export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("form-label", className)} {...props} />;
}
