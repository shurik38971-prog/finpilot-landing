import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

const variants = {
  default: "bg-surface-hover text-muted",
  success: "bg-emerald-500/20 text-emerald-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  danger: "bg-red-500/20 text-red-400",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
