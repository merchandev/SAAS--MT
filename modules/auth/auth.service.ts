import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is not set.");
}
const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: string;
  role: string;
  email: string;
}

export const authService = {
  // --- PASSWORD HASHING ---
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  },

  // --- JWT TOKENS ---
  async createToken(payload: SessionPayload): Promise<string> {
    return await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(key);
  },

  async verifyToken(token: string): Promise<SessionPayload | null> {
    try {
      const { payload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      });
      return payload as unknown as SessionPayload;
    } catch (error) {
      return null;
    }
  },

  // --- SESSION MANAGEMENT (Cookies) ---
  async setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });
  },

  async deleteSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("session");
  },

  async getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return await this.verifyToken(token);
  }
};
