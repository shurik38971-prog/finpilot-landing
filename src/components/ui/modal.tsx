"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { Button } from "./button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg glass p-6 shadow-2xl",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
