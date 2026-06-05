"use client";

import { BarChart3, Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/95 backdrop-blur-sm px-4 py-3 md:hidden">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
        aria-label="Открыть меню"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-accent" />
        <span className="font-bold">FinPilot</span>
      </div>
    </header>
  );
}
