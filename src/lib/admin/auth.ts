import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_DISPLAY_NAME } from "@/lib/admin/types";

const COOKIE = "mj_admin";
const DAY = 60 * 60 * 24;

function secret() {
  return process.env.ADMIN_SECRET || "mary-jute-admin-dev";
}

function expectedLogin() {
  return process.env.ADMIN_LOGIN || "admin";
}

function expectedPassword() {
  return process.env.ADMIN_PASSWORD || "admin";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function checkCredentials(login: string, password: string) {
  return safeEqual(login, expectedLogin()) && safeEqual(password, expectedPassword());
}

export function createSessionToken() {
  const exp = Date.now() + 7 * DAY * 1000;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(signature, sign(payload));
}

export async function getAdminSession() {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(COOKIE)?.value)) return null;
  return { name: process.env.ADMIN_NAME || ADMIN_DISPLAY_NAME };
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * DAY,
  });
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
