
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import MyBooksClient from "./MyBooksClient";

export default async function MyBooksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <MyBooksClient
      userEmail={session?.user?.email ?? ""}
      userName={session?.user?.name ?? "You"}
    />
  );
}
