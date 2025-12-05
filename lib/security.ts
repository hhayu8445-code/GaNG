import crypto from "crypto"

export const security = {
  rateLimit: new Map<string, { count: number; resetAt: number }>(),

  checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
    const now = Date.now()
    const record = this.rateLimit.get(identifier)

    if (!record || now > record.resetAt) {
      this.rateLimit.set(identifier, { count: 1, resetAt: now + windowMs })
      return true
    }

    if (record.count >= maxRequests) {
      return false
    }

    record.count++
    return true
  },

  verifyHash(data: string, hash: string): boolean {
    const computed = crypto.createHash("sha256").update(data).digest("hex")
    return computed === hash
  },

  generateToken(): string {
    return crypto.randomBytes(32).toString("hex")
  },

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim()
  },

  validateSession(sessionToken: string): boolean {
    return sessionToken.length > 0
  },

  isAdmin(userId: string): boolean {
    const adminIds = ["admin1", "admin2"]
    return adminIds.includes(userId)
  },

  encrypt(data: string): string {
    return Buffer.from(data).toString("base64")
  },

  decrypt(encrypted: string): string {
    return Buffer.from(encrypted, "base64").toString("utf8")
  },
}

export function validateAdminRole(session: any): boolean {
  return session?.isAdmin === true
}

export function rateLimitAdmin(userId: string): boolean {
  return security.checkRateLimit(`admin_${userId}`, 50, 60000)
}
