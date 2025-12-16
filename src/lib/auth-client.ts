"use client";
import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
  plugins: [anonymousClient()],
});
export const { getSession, useSession } = authClient;
