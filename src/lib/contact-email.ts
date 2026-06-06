const DEFAULT_CONTACT_EMAIL = "support@finpilot.app";

export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
}
