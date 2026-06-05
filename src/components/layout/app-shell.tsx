"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileHeader } from "./mobile-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="md:ml-60">
        <MobileHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
