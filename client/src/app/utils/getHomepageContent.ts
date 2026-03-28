import { cache } from "react";
import { HomepageContent, mergeContent } from "./homepageContent";

const contentEndpoint = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/content/hero_section`
  : "";

export const getHomepageContent = cache(async (): Promise<HomepageContent> => {
  if (!contentEndpoint) {
    return mergeContent(null);
  }

  try {
    const response = await fetch(contentEndpoint, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Could not load homepage content: ${response.status}`);
    }

    const data = await response.json();
    return mergeContent(data);
  } catch {
    return mergeContent(null);
  }
});
