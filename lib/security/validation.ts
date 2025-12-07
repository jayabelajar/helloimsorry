import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, PROFANITY_LIST, SQLI_PATTERNS } from "./constants"

export const stripHtml = (value: string) => value.replace(/<[^>]+>/g, "")

export const sanitizeField = (value: string | null | undefined) => stripHtml(value ?? "").trim()

const normalizeForMatching = (value: string) => value.toLowerCase().replace(/[\s\W_]+/g, "")

const containsProfanity = (value: string) => {
  const normalized = normalizeForMatching(value)
  return PROFANITY_LIST.some((word) => normalized.includes(normalizeForMatching(word)))
}

const detectSqlInjection = (value: string) => SQLI_PATTERNS.some((pattern) => pattern.test(value))

export type SubmissionInput = {
  recipient: string
  sender?: string
  message: string
}

export type SanitizedSubmission = {
  recipient: string
  sender: string
  message: string
}

export type SubmissionValidationResult = {
  valid: boolean
  errors: string[]
  sanitized?: SanitizedSubmission
}

export const validateSubmissionFields = (input: SubmissionInput): SubmissionValidationResult => {
  const sanitizedRecipient = sanitizeField(input.recipient)
  const sanitizedSender = sanitizeField(input.sender)
  const sanitizedMessage = sanitizeField(input.message)

  const errors: string[] = []

  if (!sanitizedMessage) {
    errors.push("Message is required")
  }

  if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
    errors.push(`Message exceeds ${MAX_MESSAGE_LENGTH} characters`)
  }

  if (!sanitizedRecipient) {
    errors.push("Recipient is required")
  }

  if (sanitizedRecipient.length > MAX_NAME_LENGTH) {
    errors.push(`Recipient exceeds ${MAX_NAME_LENGTH} characters`)
  }

  if (sanitizedSender.length > MAX_NAME_LENGTH) {
    errors.push(`Sender exceeds ${MAX_NAME_LENGTH} characters`)
  }

  const combined = `${sanitizedRecipient} ${sanitizedSender} ${sanitizedMessage}`
  if (containsProfanity(combined)) {
    errors.push("Inappropriate language detected")
  }

  if (detectSqlInjection(combined)) {
    errors.push("Invalid characters detected")
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      recipient: sanitizedRecipient,
      sender: sanitizedSender,
      message: sanitizedMessage,
    },
  }
}
