import { appPath } from "@/lib/app-url";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export function AppLink({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a href={appPath(href)} className={className} {...props}>
      {children}
    </a>
  );
}
