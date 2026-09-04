// app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A7ki",
    short_name: "A7ki",
    description:
      "A7ki is a platform for sharing and discovering thoughts, ideas, and moments.",
    start_url: "/",
    display: "standalone",
    background_color: "oklch(20.019% 0.00002 271.152)",
    theme_color: "oklch(20.019% 0.00002 271.152)",
    icons: [
      { src: "/Logo.png", sizes: "192x192", type: "image/png" },
      { src: "/Logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
