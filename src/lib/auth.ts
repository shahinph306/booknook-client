
// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";
// import { jwt } from "better-auth/plugins";

// const mongoUri = process.env.MONGODB_URI;

// if (!mongoUri) {
//   throw new Error("MONGODB_URI is missing in environment variables");
// }

// const client = new MongoClient(mongoUri);
// const db = client.db("booknook");

// export const auth = betterAuth({
//   database: mongodbAdapter(db, { client }),

//   baseURL: process.env.BETTER_AUTH_URL,
//   secret: process.env.BETTER_AUTH_SECRET,

//   emailAndPassword: {
//     enabled: true,
//   },

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },

//   plugins: [
//     jwt({
//       sessionCookieCache: true,
//     }),
//   ],

//   session: {
//     expiresIn: 7 * 24 * 60 * 60,

//     cookieCache: {
//       enabled: true,
//       maxAge: 5 * 60,
//       strategy: "jwt",
//     },
//   },
// });









import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

// ✅ ক্লায়েন্ট ক্যাশে রাখুন — বারবার নতুন সংযোগ তৈরি হবে না
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

  // ✅ সঠিকভাবে baseURL সেট — লোকাল ও লাইভ উভয় কাজ করবে
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL 
    ? process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    : "http://localhost:3000/api/auth",

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
    expiresIn: 7 * 24 * 60 * 60, // 7 দিন

    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 মিনিট
      strategy: "jwt",
    },
  },
});

// TypeScript global declaration
declare global {
  var _mongoClient: MongoClient | undefined;
}


