import { LANDING } from "@/lib/copy/landing";
import { SEO_DESCRIPTION, SITE_URL } from "@/lib/seo/site";

const SCHEMA_DESCRIPTION = SEO_DESCRIPTION.slice(0, 200);

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FinPilot",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-primary.svg`,
    description: SCHEMA_DESCRIPTION,
    sameAs: [],
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FinPilot",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
    },
    description: SCHEMA_DESCRIPTION,
    url: SITE_URL,
    featureList: LANDING.benefits.items.slice(0, 5),
  };
}

export function faqPageJsonLd() {
  const allFaq = [
    ...LANDING.financeQuestions.items.map((item) => ({
      question: item.title,
      answer: item.answer,
    })),
    ...LANDING.faq.items,
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
