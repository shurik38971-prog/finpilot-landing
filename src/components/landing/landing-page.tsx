import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { LeadMagnetForm } from "@/components/landing/lead-magnet-form";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/landing/motion";
import { Logo } from "@/components/brand/logo";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/landing/app-link";
import { LANDING } from "@/lib/copy/landing";
import {
  ArrowRight,
  Briefcase,
  Check,
  ChevronRight,
  Navigation,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo variant="wordmark" href="/" iconSize={28} />
        <nav className="flex items-center gap-2">
          <AppLink href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Войти
            </Button>
          </AppLink>
          <AppLink href="/signup">
            <Button size="sm">
              Начать бесплатно
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </AppLink>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  const { hero } = LANDING;
  return (
    <section className="relative overflow-hidden pt-28 section-padding sm:pt-32">
      <div className="landing-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-muted">
            <Navigation className="h-3.5 w-3.5 text-accent" />
            {hero.badge}
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            {hero.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <AppLink href="/signup">
              <Button size="lg" className="h-12 w-full px-7 sm:w-auto">
                {hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </AppLink>
            <Link href="#example">
              <Button
                variant="secondary"
                size="lg"
                className="h-12 w-full border-white/[0.08] bg-white/[0.03] px-7 sm:w-auto"
              >
                {hero.secondaryCta}
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted/80">
            Без банковских интеграций · Первый анализ за 3 минуты
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="lg:justify-self-end">
          <DashboardMockup />
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <div className="relative mx-auto mt-12 max-w-6xl">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-muted">
                FinPilot находится на стадии раннего тестирования. Мы активно
                улучшаем рекомендации и будем благодарны за честную обратную
                связь.
              </p>
            </div>
            <AppLink href="/feedback" className="shrink-0">
              <Button
                variant="secondary"
                size="sm"
                className="w-full border-white/[0.08] bg-white/[0.04] sm:w-auto"
              >
                Оставить отзыв
              </Button>
            </AppLink>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function SeoIntroSection() {
  const { seoIntro } = LANDING;

  return (
    <section className="section-padding border-t border-white/[0.06] bg-white/[0.01]">
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {seoIntro.title}
          </h2>
          <div className="mt-6 space-y-4 text-muted leading-relaxed text-lg">
            {seoIntro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { problem } = LANDING;
  const icons = [TrendingUp, Zap, Target, Sparkles, ChevronRight];

  return (
    <section className="section-padding border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {problem.title}
          </h2>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problem.cards.map((card, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={card}>
                <div className="group glass h-full p-6 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-muted transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-medium leading-snug">{card}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <FadeIn delay={0.1}>
          <p className="mt-12 text-center text-lg text-muted">
            Большинство приложений показывают графики.{" "}
            <span className="text-foreground">
              FinPilot показывает, что делать.
            </span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { howItWorks } = LANDING;

  return (
    <section className="section-padding border-t border-white/[0.06] bg-white/[0.01]">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Процесс
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {howItWorks.title}
          </h2>
        </FadeIn>

        <div className="relative mt-16">
          <div
            className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-accent/50 via-white/10 to-transparent lg:block"
            aria-hidden
          />

          <StaggerChildren className="space-y-6">
            {howItWorks.steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="relative flex gap-6 lg:gap-10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-semibold text-accent">
                    {i + 1}
                  </div>
                  <div className="glass flex-1 p-6 sm:p-7">
                    <h3 className="text-lg font-medium">{step.title}</h3>
                    <p className="mt-2 text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}

function ProfileAdaptationSection() {
  const { profileAdaptation } = LANDING;
  const icons = [User, Users, Briefcase, Target];

  return (
    <section className="section-padding border-t border-white/[0.06] bg-white/[0.01]">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {profileAdaptation.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted leading-relaxed">
            {profileAdaptation.subtitle}
          </p>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profileAdaptation.cards.map((card, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={card.title}>
                <article className="glass group h-full p-6 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-muted transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium leading-snug">{card.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {card.text}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const { benefits } = LANDING;

  return (
    <section className="section-padding border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {benefits.title}
          </h2>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-3 sm:grid-cols-2">
          {benefits.items.map((item) => (
            <StaggerItem key={item}>
              <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span className="leading-relaxed">{item}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function ExampleSection() {
  const { example } = LANDING;
  const score = example.healthScore.value;

  return (
    <section
      id="example"
      className="section-padding border-t border-white/[0.06] bg-white/[0.01]"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {example.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mx-auto mt-14 max-w-lg">
            <div className="glass-strong glow-accent overflow-hidden">
              <div className="border-b border-white/[0.06] bg-gradient-to-r from-accent/10 to-transparent px-8 py-7">
                <p className="text-sm text-muted">
                  {example.healthScore.label}
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-semibold tabular-nums tracking-tight">
                    {score}
                  </span>
                  <span className="mb-2 text-lg text-muted">
                    из {example.healthScore.max}
                  </span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-danger via-warning to-accent transition-all duration-1000"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6 p-8">
                <div>
                  <p className="text-sm text-muted">{example.blocker.label}</p>
                  <p className="mt-1.5 text-lg font-medium text-danger">
                    {example.blocker.value}
                  </p>
                </div>

                <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
                  <p className="text-sm text-muted">{example.action.label}</p>
                  <p className="mt-1.5 flex items-center gap-2 text-lg font-medium">
                    <Zap className="h-5 w-5 text-accent" />
                    {example.action.value}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-success/20 bg-success/5 p-5">
                    <p className="text-sm text-muted">
                      {example.effect.label}
                    </p>
                    <p className="mt-1.5 flex items-center gap-2 font-medium text-success">
                      <TrendingUp className="h-4 w-4" />
                      {example.effect.points}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                    <p className="text-sm text-muted">
                      {example.effect.goalLabel}
                    </p>
                    <p className="mt-1.5 flex items-center gap-2 font-medium">
                      <Target className="h-4 w-4 text-accent" />
                      {example.effect.goal}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function AudienceSegmentsSection() {
  const { audienceSegments } = LANDING;

  return (
    <section className="section-padding border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {audienceSegments.title}
          </h2>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-6 lg:grid-cols-2">
          {audienceSegments.segments.map((segment) => (
            <StaggerItem key={segment.title}>
              <article className="glass h-full p-6 sm:p-8">
                <h3 className="text-xl font-medium">{segment.title}</h3>
                <p className="mt-4 text-muted leading-relaxed">
                  {segment.text}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function FinanceQuestionsSection() {
  const { financeQuestions } = LANDING;

  return (
    <section className="section-padding border-t border-white/[0.06] bg-white/[0.01]">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {financeQuestions.title}
          </h2>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-6 md:grid-cols-2">
          {financeQuestions.items.map((item) => (
            <StaggerItem key={item.title}>
              <article className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 h-full">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {item.answer}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function LeadMagnetSection() {
  const { leadMagnet } = LANDING;

  return (
    <section
      id="audit"
      className="section-padding border-t border-white/[0.06] bg-white/[0.01]"
    >
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <div className="glass-strong gradient-border px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {leadMagnet.title}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted leading-relaxed">
              {leadMagnet.subtitle}
            </p>
            <div className="mt-10">
              <LeadMagnetForm />
            </div>
            <p className="mt-4 text-xs text-muted/70">
              Бесплатно · Без привязки карты · 3 минуты
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FaqSection() {
  const { faq } = LANDING;

  return (
    <section className="section-padding border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {faq.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <Accordion>
            {faq.items.map((item, i) => (
              <AccordionItem
                key={item.question}
                id={`faq-${i}`}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  const { finalCta } = LANDING;

  return (
    <section className="section-padding border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-accent/15 via-white/[0.02] to-success/10 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]"
              aria-hidden
            />
            <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {finalCta.title}
            </h2>
            <Link href="#audit" className="relative mt-10 inline-block">
              <Button size="lg" className="h-12 px-8">
                {finalCta.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function LandingFooter() {
  const { footer } = LANDING;
  const linkClass = "transition-colors hover:text-foreground";

  return (
    <footer className="border-t border-white/[0.06] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <Logo variant="wordmark" iconSize={24} className="text-sm" />
          <nav
            className="flex flex-col items-center gap-3 text-sm text-muted sm:items-end"
            aria-label="Навигация в подвале"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
              <AppLink href="/login" className={linkClass}>
                {footer.login}
              </AppLink>
              <AppLink href="/signup" className={linkClass}>
                {footer.signup}
              </AppLink>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
              <AppLink href="/privacy" className={linkClass}>
                {footer.privacy}
              </AppLink>
              <AppLink href="/consent" className={linkClass}>
                {footer.consent}
              </AppLink>
              <Link href="/contacts" className={linkClass}>
                {footer.contacts}
              </Link>
            </div>
          </nav>
        </div>
        <p className="text-center text-sm text-muted sm:text-left">
          © {new Date().getFullYear()} FinPilot
        </p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection />
        <SeoIntroSection />
        <ProblemSection />
        <HowItWorksSection />
        <ProfileAdaptationSection />
        <BenefitsSection />
        <ExampleSection />
        <AudienceSegmentsSection />
        <FinanceQuestionsSection />
        <LeadMagnetSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
