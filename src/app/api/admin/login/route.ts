import { NextResponse } from "next/server";
import { applySessionCookie, checkCredentials, createSessionToken } from "@/lib/admin/auth";
import { ADMIN_DISPLAY_NAME } from "@/lib/admin/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const login = typeof body?.login === "string" ? body.login.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!checkCredentials(login, password)) {
    return NextResponse.json({ ok: false, error: "Неверный логин или пароль" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true, name: process.env.ADMIN_NAME || ADMIN_DISPLAY_NAME });
  return applySessionCookie(response, createSessionToken());
}
