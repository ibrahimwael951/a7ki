import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { anonymous } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    anonymous({
      generateRandomEmail: () => {
        const id = crypto.randomUUID();
        return `guest-${id}@A7KI.com`;
      },
    }),
  ],
});
