"use client";
import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { admin } from "better-auth/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
  experimental: { joins: true },
  plugins: [anonymousClient(), admin(), inferAdditionalFields<typeof auth>()],
});
export const { getSession, useSession } = authClient;
