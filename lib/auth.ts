import { cookies } from "next/headers"

// Discord OAuth2 Configuration (read from environment)
export const DISCORD_CONFIG = {
  clientId: process.env.DISCORD_CLIENT_ID ?? "",
  clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
  redirectUri:
    process.env.DISCORD_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/callback`,
  adminDiscordId: process.env.ADMIN_DISCORD_ID || "",
  scopes: ["identify", "email", "guilds"],
}

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email: string | null
  verified: boolean
  global_name: string | null
}

export interface SessionUser {
  id: string
  discordId: string
  username: string
  email: string | null
  avatar: string
  membership: "free" | "vip" | "admin"
  isAdmin: boolean
  accessToken: string
  refreshToken: string
  expiresAt: number
}

// Generate Discord OAuth2 URL
export function getDiscordAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CONFIG.clientId,
    redirect_uri: DISCORD_CONFIG.redirectUri,
    response_type: "code",
    scope: DISCORD_CONFIG.scopes.join(" "),
    state: state || generateState(),
  })
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

// Generate random state for CSRF protection
export function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Exchange code for tokens
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
} | null> {
  try {
    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CONFIG.clientId,
        client_secret: DISCORD_CONFIG.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_CONFIG.redirectUri,
      }),
    })

    if (!response.ok) {
      console.error("Failed to exchange code:", await response.text())
      return null
    }

    return response.json()
  } catch (error) {
    console.error("Token exchange error:", error)
    return null
  }
}

// Get Discord user info
export async function getDiscordUser(accessToken: string): Promise<DiscordUser | null> {
  try {
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) return null
    return response.json()
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

export function checkIsAdmin(discordId: string): boolean {
  return discordId === DISCORD_CONFIG.adminDiscordId
}

// --- Session management (HMAC-signed cookie) ---
const encoder = new TextEncoder()

function toBase64Url(input: string | ArrayBuffer): string {
  let base64 = ""
  if (typeof input === "string") {
    // Encode string to base64
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(input, "utf-8").toString("base64")
    } else {
      // Fallback for environments with btoa
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      base64 = btoa(input)
    }
  } else {
    const bytes = new Uint8Array(input)
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(bytes).toString("base64")
    } else {
      let binary = ""
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      base64 = btoa(binary)
    }
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64UrlToString(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/")
  const pad = b64.length % 4
  const padded = pad ? b64 + "====".slice(pad) : b64
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8")
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return atob(padded)
}

function fromBase64UrlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/")
  const pad = b64.length % 4
  const padded = pad ? b64 + "====".slice(pad) : b64
  if (typeof Buffer !== "undefined") {
    const buf = Buffer.from(padded, "base64")
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getHmacKey() {
  const secret = process.env.SESSION_SECRET || ""
  if (!secret) return null
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"])
}

async function signPayload(payload: string): Promise<string | null> {
  const key = await getHmacKey()
  if (!key) return null
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  return toBase64Url(signature)
}

async function verifyPayload(payload: string, signatureB64Url: string): Promise<boolean> {
  const key = await getHmacKey()
  if (!key) return false
  const sigBytes = fromBase64UrlToBytes(signatureB64Url)
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload))
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get("session")?.value
    if (!raw) return null

    const parts = raw.split(".")
    if (parts.length !== 2) return null
    const [payloadB64, signature] = parts
    const payload = fromBase64UrlToString(payloadB64)

    const valid = await verifyPayload(payload, signature)
    if (!valid) return null

    const session = JSON.parse(payload) as SessionUser
    if (session.expiresAt < Date.now()) return null
    return session
  } catch {
    return null
  }
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const payload = JSON.stringify(user)
  const signature = await signPayload(payload)
  if (!signature) {
    throw new Error("SESSION_SECRET is not configured")
  }
  const payloadB64 = toBase64Url(payload)
  return `${payloadB64}.${signature}`
}

// Get avatar URL
export function getAvatarUrl(user: DiscordUser): string {
  if (user.avatar) {
    const ext = user.avatar.startsWith("a_") ? "gif" : "png"
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`
  }
  // Default avatar for users without custom avatar
  const defaultIndex = Number.parseInt(user.discriminator || "0") % 5
  return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`
}
