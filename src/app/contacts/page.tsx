import { Logo } from "@/components/brand/logo";
import { LANDING } from "@/lib/copy/landing";
import { getContactEmail } from "@/lib/contact-email";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Контакты — FinPilot",
  description: "Связаться с командой FinPilot по вопросам сервиса и персональных данных.",
};

export default function ContactsPage() {
  const email = getContactEmail();
  const { contacts } = LANDING;

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-block">
          <Logo variant="wordmark" iconSize={28} />
        </Link>

        <div className="glass mt-10 space-y-6 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {contacts.title}
          </h1>
          <p className="text-sm leading-relaxed text-muted">{contacts.description}</p>
          <div className="space-y-1">
            <p className="text-sm text-muted">{contacts.emailLabel}</p>
            <a
              href={`mailto:${email}`}
              className="text-base font-medium text-accent transition-colors hover:text-accent-hover"
            >
              {email}
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/" className="transition-colors hover:text-foreground">
            ← На главную
          </Link>
        </p>
      </div>
    </div>
  );
}
