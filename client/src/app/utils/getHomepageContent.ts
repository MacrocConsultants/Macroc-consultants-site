import { HomepageContent, mergeContent } from "./homepageContent";

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const apiBase = rawApiUrl ? (/\/api$/i.test(rawApiUrl) ? rawApiUrl : `${rawApiUrl}/api`) : "";
const contentEndpoint = apiBase ? `${apiBase}/content/hero_section` : "";

export async function getHomepageContent(): Promise<HomepageContent> {
  if (!contentEndpoint) {
    return mergeContent(null);
  }

  try {
    const response = await fetch(contentEndpoint, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Could not load homepage content: ${response.status}`);
    }

    const data = await response.json();
    return mergeContent(data);
  } catch {
    return mergeContent(null);
  }
}
