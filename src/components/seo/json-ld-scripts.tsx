import {
  faqPageJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo/json-ld";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdScripts() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={faqPageJsonLd()} />
    </>
  );
}
