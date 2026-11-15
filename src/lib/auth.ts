
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing in environment variables");
}


let client: MongoClient;
if (globalThis._mongoClient) {
  client = globalThis._mongoClient;
} else {
  client = new MongoClient(mongoUri);
  globalThis._mongoClient = client;
}

const db = client.db("booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL 
    ? process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    : "https://booknook-client-liart.vercel.app",

  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    jwt({
      sessionCookieCache: true,
    }),
  ],

  session: {
    expiresIn: 7 * 24 * 60 * 60, 

    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, 
      strategy: "jwt",
    },
  },
});

declare global {
  var _mongoClient: MongoClient | undefined;
}


