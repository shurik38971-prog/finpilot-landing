"use client";

import { MotionDiv } from "@/components/landing/motion";
import { FinPilotIcon } from "@/components/brand/finpilot-icon";
import {
  ArrowUpRight,
  CreditCard,
  LayoutDashboard,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

const SCORE = 34;

export function DashboardMockup() {
  return (
    <MotionDiv
      className="relative mx-auto w-full max-w-[520px] lg:mx-0"
      animate={{ y: [0, -8, 0] }}
    >
      <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-gradient-to-br from-accent/20 via-transparent to-success/10 blur-3xl animate-pulse-glow" />

      <div className="glass-strong glow-accent overflow-hidden shadow-2xl shadow-black/50">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 text-xs text-muted">
            <FinPilotIcon size={14} />
            FinPilot
          </div>
        </div>

        <div className="flex min-h-[380px]">
          {/* Sidebar */}
          <aside className="hidden w-14 shrink-0 border-r border-white/[0.06] bg-black/20 p-2 sm:block">
            <nav className="flex flex-col items-center gap-3 pt-2">
              {[
                { icon: LayoutDashboard, active: true },
                { icon: Wallet, active: false },
                { icon: CreditCard, active: false },
                { icon: Target, active: false },
              ].map(({ icon: Icon, active }, i) => (
                <div
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active
                      ? "bg-accent/20 text-accent"
                      : "text-muted/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Добрый вечер</p>
                <p className="text-sm font-medium">Ваш финансовый обзор</p>
              </div>
              <div className="rounded-full bg-success/10 px-2.5 py-1 text-xs text-success">
                Анализ готов
              </div>
            </div>

            {/* Health score */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs text-muted">Финансовое здоровье</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-semibold tabular-nums tracking-tight">
                  {SCORE}
                </span>
                <span className="mb-1 text-sm text-muted">/ 100</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-danger via-warning to-accent"
                  style={{ width: `${SCORE}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Blocker */}
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-muted">
                  Главная проблема
                </p>
                <p className="mt-1.5 text-sm font-medium leading-snug text-danger">
                  Высокая нагрузка по долгам
                </p>
              </div>

              {/* Action */}
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-muted">
                  Следующий шаг
                </p>
                <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium leading-snug">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  Закрыть кредитную карту
                </p>
              </div>
            </div>

            {/* Effect row */}
            <div className="flex items-center justify-between rounded-xl border border-success/15 bg-success/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success">+11 к здоровью</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                <Target className="h-3.5 w-3.5" />
                −4 мес. до цели
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}
