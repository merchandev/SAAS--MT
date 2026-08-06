import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is not set.");
}
const key = new TextEncoder().encode(JWT_SECRET);
const authCookieSecure =
  process.env.AUTH_COOKIE_SECURE === "true" ||
  (process.env.AUTH_COOKIE_SECURE !== "false" &&
    process.env.NODE_ENV === "production");

export interface SessionPayload {
  userId: string;
  role: string;
  email: string;
  sessionVersion?: number;
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
      .setIssuer("metransfers:auth")
      .setAudience("metransfers:app")
      .setExpirationTime("24h")
      .sign(key);
  },

  async verifyToken(token: string): Promise<{ payload: SessionPayload | null, needsRotation: boolean }> {
    try {
      const { payload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
        issuer: "metransfers:auth",
        audience: "metransfers:app",
      });
      return { payload: payload as unknown as SessionPayload, needsRotation: false };
    } catch (error: any) {
      const prevSecret = process.env.JWT_PREVIOUS_SECRET;
      if (prevSecret && (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || error.code === 'ERR_JWS_INVALID')) {
        try {
          const { payload } = await jwtVerify(token, new TextEncoder().encode(prevSecret), {
            algorithms: ["HS256"],
            issuer: "metransfers:auth",
            audience: "metransfers:app",
          });
          return { payload: payload as unknown as SessionPayload, needsRotation: true };
        } catch {
          return { payload: null, needsRotation: false };
        }
      }
      if (process.env.NODE_ENV !== "production") {
        console.error("[verifyToken] JWT verification failed:", error);
      }
      return { payload: null, needsRotation: false };
    }
  },

  // --- SESSION MANAGEMENT (Cookies) ---
  async setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: authCookieSecure,
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
    if (!token) {
      return null;
    }
    
    const { payload, needsRotation } = await this.verifyToken(token);
    if (!payload) return null;

    try {
      // Validate session against DB (allows immediate logout & suspension)
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { isActive: true, sessionVersion: true }
      });

      // If payload has no sessionVersion, we default to 0 for backwards compatibility
      const payloadVersion = payload.sessionVersion ?? 0;

      if (!user || !user.isActive || user.sessionVersion !== payloadVersion) {
        await this.deleteSessionCookie();
        return null;
      }
      
      // Rotate token if needed
      if (needsRotation) {
        const newToken = await this.createToken(payload);
        await this.setSessionCookie(newToken);
      }
    } catch (error) {
      console.error("[getSession] Database validation failed:", error);
      return null;
    }

    return payload;
  }
};
