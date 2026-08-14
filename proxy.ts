import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. Not logged in at all -> send to login page
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Logged in but NOT an admin -> send back to /Admin (or a "not authorized" page)
  //    Adjust `session.user.role` to match whatever field your auth setup actually stores.
  const isAdmin = session.user?.role === "admin";

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/Admin", request.url));
  }
  
  if (isAdmin) {
    return NextResponse.redirect(new URL("/Admin/dashboard", request.url));
  }

  // 3. Logged in AND admin -> let them through
  return NextResponse.next();
}

export const config = {
  // Protects /Admin/dashboard and any nested routes under it, e.g. /Admin/dashboard/users
  matcher: ["/Admin/dashboard/:path*"],
};
