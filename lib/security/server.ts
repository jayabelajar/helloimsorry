import crypto from "crypto"

export const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value ?? "unknown", "utf8").digest("hex")

export const logSecurityEvent = (event: string, payload: Record<string, unknown>) => {
  console.warn(`[SECURITY][${event}]`, {
    timestamp: new Date().toISOString(),
    ...payload,
  })
}
