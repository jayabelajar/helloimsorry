export const MAX_MESSAGE_LENGTH = 300
export const MAX_NAME_LENGTH = 40
export const RATE_LIMIT_WINDOW_MS = 60_000
export const PROFANITY_LIST = [
  "idiot",
  "bastard",
  "fuck",
  "shit",
  "asshole",
  "bitch",
]

export const SQLI_PATTERNS = [
  /['"`]\s*or\s*['"`]?\d/i,
  /union\s+select/i,
  /information_schema/i,
  /sleep\(\d+/i,
  /benchmark\(/i,
  /drop\s+table/i,
  /;--/,
  /\/\*/,
]
