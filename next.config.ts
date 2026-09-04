import type { NextConfig } from "next";
import { withGTConfig } from "gt-next/config";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withGTConfig(withSerwist(nextConfig), {});