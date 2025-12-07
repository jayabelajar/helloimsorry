import { NextRequest, NextResponse } from "next/server"
import { encodeName, insertMessageRecord } from "@/lib/messages"
import { hashValue, logSecurityEvent } from "@/lib/security/server"
import { validateSubmissionFields } from "@/lib/security/validation"

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  const rawIp = forwarded?.split(",")[0]?.trim() || "0.0.0.0"
  const hashedIp = hashValue(rawIp)
  const timestamp = new Date().toISOString()

  try {
    const { recipient, sender, message, honeypot } = await request.json()

    if (honeypot) {
      logSecurityEvent("honeypot_triggered", { hashedIp, timestamp })
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    const validation = validateSubmissionFields({ recipient, sender, message })
    if (!validation.valid || !validation.sanitized) {
      logSecurityEvent("validation_failed", {
        hashedIp,
        timestamp,
        reasons: validation.errors,
      })
      return NextResponse.json({ error: "Invalid submission" }, { status: 422 })
    }

    const sanitized = validation.sanitized
    const name = encodeName(sanitized.recipient, sanitized.sender)
    const stored = await insertMessageRecord(
      {
        name,
        message: sanitized.message,
        ip_hash: hashedIp,
      },
      "anon",
    )

    return NextResponse.json({ success: true, data: stored })
  } catch (error) {
    logSecurityEvent("submission_error", {
      hashedIp,
      timestamp,
      message: error instanceof Error ? error.message : "unknown",
    })
    return NextResponse.json({ error: "Unable to submit" }, { status: 500 })
  }
}
