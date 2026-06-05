"use client";

import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { useId, useState } from "react";

interface HintTooltipProps {
  hint: string;
  className?: string;
  label?: string;
}

export function HintTooltip({ hint, className, label }: HintTooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className={cn("inline-flex items-center gap-1.5 group", className)}>
      {label && <span>{label}</span>}
      <span className="relative inline-flex">
        <button
          type="button"
          className="text-muted hover:text-foreground transition-colors rounded-full p-0.5"
          aria-label="Подсказка"
          aria-expanded={open}
          aria-describedby={open ? id : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
        <span
          id={id}
          role="tooltip"
          className={cn(
            "absolute left-1/2 bottom-full z-20 mb-2 w-52 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-muted shadow-lg pointer-events-none",
            open ? "block" : "hidden group-hover:block"
          )}
        >
          {hint}
        </span>
      </span>
    </span>
  );
}
