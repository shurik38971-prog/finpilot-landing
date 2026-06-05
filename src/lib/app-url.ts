const DEFAULT_APP_URL = "http://localhost:3000";

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? DEFAULT_APP_URL;
}

export function appPath(path: string): string {
  return `${getAppUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
