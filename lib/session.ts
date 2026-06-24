import { cookies } from "next/headers";
import { encrypt, decrypt } from "./auth";

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 día
  const session = await encrypt({ userId, role, expires });

  cookies().set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  cookies().set("session", "", { expires: new Date(0), path: "/" });
}
