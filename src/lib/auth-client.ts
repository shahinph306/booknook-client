
// import { createAuthClient } from "better-auth/react";
// import { jwtClient } from "better-auth/client/plugins";

// export const authClient = createAuthClient({
//   baseURL:
//     process.env.NEXT_PUBLIC_BETTER_AUTH_URL,

//   plugins: [jwtClient()],
// });











import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // ✅ সরাসরি /api/auth ব্যবহার করুন — ডোমেইন স্বয়ংক্রিয়ভাবে নিয়ে নেবে
 baseURL:
     process.env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [jwtClient()],
});





