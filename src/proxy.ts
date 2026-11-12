
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    //   console.log("Session in proxy:", session);
    const user = session?.user;
    if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

}

export const config = {
    matcher: [
        "/add-book/:path*",
        "/my-books/:path*",
        "/my-borrows/:path*",
        "/profile/:path*",
    ],
};
