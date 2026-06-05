"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LANDING } from "@/lib/copy/landing";
import { appPath } from "@/lib/app-url";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function LeadMagnetForm({ id }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Введите корректный email");
      return;
    }
    window.location.href = appPath(
      `/signup?email=${encodeURIComponent(trimmed)}`
    );
  }

  const { leadMagnet } = LANDING;

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <Input
          id="lead-email"
          type="email"
          placeholder={leadMagnet.emailPlaceholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="h-12 border-white/[0.1] bg-white/[0.04] px-4 text-base"
          aria-label="Email"
        />
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
      <Button type="submit" size="lg" className="h-12 shrink-0 px-6">
        {leadMagnet.cta}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
