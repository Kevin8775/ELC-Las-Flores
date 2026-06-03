import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const authRoutes = ["/dashboard", "/estudiantes", "/docentes", "/grupos", "/pagos", "/reportes"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const shouldProtect = authRoutes.some((route) => pathname.startsWith(route));

  if (!shouldProtect) return NextResponse.next();

  const token = request.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET no definido en el entorno");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/estudiantes/:path*", "/docentes/:path*", "/grupos/:path*", "/pagos/:path*", "/reportes/:path*"],
};
