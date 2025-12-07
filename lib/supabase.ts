const PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

if (!PUBLIC_SUPABASE_URL) {
  throw new Error("Supabase URL is not defined")
}

const PUBLIC_SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!PUBLIC_SUPABASE_KEY) {
  throw new Error("Supabase anon key is not defined")
}

const sanitizedBaseUrl = PUBLIC_SUPABASE_URL.replace(/\/$/, "")

export type SupabaseRole = "anon" | "service"

const getKey = (role: SupabaseRole) => {
  if (role === "anon") {
    return PUBLIC_SUPABASE_KEY
  }

  if (typeof window !== "undefined") {
    throw new Error("Service role key cannot be used in the browser")
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error("Supabase service role key is not configured")
  }
  return serviceKey
}

export const supabaseFetch = async (path: string, init: RequestInit = {}, role: SupabaseRole = "anon") => {
  const key = getKey(role)
  const headers = new Headers(init.headers ?? {})
  headers.set("apikey", key)
  headers.set("Authorization", `Bearer ${key}`)

  const targetPath = path.startsWith("/") ? path : `/${path}`
  const response = await fetch(`${sanitizedBaseUrl}/rest/v1${targetPath}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Supabase request failed (${response.status}): ${body}`)
  }

  return response
}

export const supabaseFetchJson = async <T>(path: string, init: RequestInit = {}, role: SupabaseRole = "anon") => {
  const response = await supabaseFetch(path, init, role)
  if (response.status === 204) return null
  const text = await response.text()
  if (!text) return null as T
  return JSON.parse(text) as T
}

const buildRestUrl = (path: string) => {
  const targetPath = path.startsWith("/") ? path : `/${path}`
  return `${sanitizedBaseUrl}/rest/v1${targetPath}`
}

export const supabaseFetchWithAccessToken = async (path: string, init: RequestInit = {}, accessToken: string) => {
  if (!accessToken) {
    throw new Error("Missing Supabase access token")
  }

  const headers = new Headers(init.headers ?? {})
  headers.set("apikey", PUBLIC_SUPABASE_KEY)
  headers.set("Authorization", `Bearer ${accessToken}`)

  const response = await fetch(buildRestUrl(path), {
    ...init,
    headers,
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Supabase request failed (${response.status}): ${body}`)
  }

  return response
}

export const supabaseFetchJsonWithAccessToken = async <T>(
  path: string,
  init: RequestInit = {},
  accessToken: string,
) => {
  const response = await supabaseFetchWithAccessToken(path, init, accessToken)
  if (response.status === 204) return null
  const text = await response.text()
  if (!text) return null as T
  return JSON.parse(text) as T
}
