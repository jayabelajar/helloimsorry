import { supabaseFetchJson, type SupabaseRole } from "./supabase"

export type DbMessage = {
  id: string
  name: string | null
  message: string
  created_at: string
  is_hidden: boolean
  ip_hash?: string | null
}

export const BASE_COLUMNS = "id,name,message,created_at,is_hidden"
export const ADMIN_COLUMNS = `${BASE_COLUMNS},ip_hash`
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const normalizeUuid = (value: string) => {
  const trimmed = value?.trim()
  if (!trimmed) return null
  return UUID_REGEX.test(trimmed) ? trimmed : null
}

export const normalizeMessageId = (value: string) => normalizeUuid(value)

const buildSelectPath = (select: string, suffix: string) =>
  `/messages?select=${encodeURIComponent(select)}${suffix}`

const fetchWithFallback = async (
  select: string,
  suffix: string,
  role: SupabaseRole,
  fallback?: string,
) => {
  try {
    return await supabaseFetchJson<DbMessage[]>(
      buildSelectPath(select, suffix),
      {},
      role,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (fallback && message.includes("ip_hash")) {
      return await supabaseFetchJson<DbMessage[]>(
        buildSelectPath(fallback, suffix),
        {},
        role,
      )
    }
    throw error
  }
}

/* ===========================
   NORMALIZATION
=========================== */

export type NormalizedMessage = DbMessage & {
  recipient_name: string | null
  sender_name: string | null
}

export const decodeName = (raw: string | null) => {
  if (!raw) return { recipient: null, sender: null }
  const [recipient, sender] = raw.split("::")
  return {
    recipient: recipient?.trim() || null,
    sender: sender?.trim() || null,
  }
}

export const normalizeMessage = (row: DbMessage): NormalizedMessage => {
  const decoded = decodeName(row.name)
  return {
    ...row,
    recipient_name: decoded.recipient,
    sender_name: decoded.sender,
  }
}

export const encodeName = (recipient: string, sender?: string | null) => {
  const safeRecipient = recipient?.trim()
  const safeSender = sender?.trim()
  if (!safeRecipient && !safeSender) return null
  if (!safeSender) return safeRecipient ?? null
  return `${safeRecipient}::${safeSender}`
}

/* ===========================
   QUERIES
=========================== */

export const getMessageById = async (
  id: string,
  role: SupabaseRole = "anon",
): Promise<NormalizedMessage | null> => {
  const trimmedId = normalizeUuid(id)
  if (!trimmedId) {
    return null
  }

  const select = role === "service" ? ADMIN_COLUMNS : BASE_COLUMNS
  const fallback = role === "service" ? BASE_COLUMNS : undefined

  try {
    const data = await fetchWithFallback(
      select,
      `&id=eq.${trimmedId}&limit=1`,
      role,
      fallback,
    )

    if (!data || data.length === 0) return null

    const row = data[0]

    if (role === "anon" && row.is_hidden) return null

    return normalizeMessage(row)
  } catch (error) {
    console.error("Failed to load message", error)
    return null
  }
}

type VisibleOptions = {
  limit?: number
}

export const getVisibleMessages = async (
  options: VisibleOptions = {},
): Promise<NormalizedMessage[]> => {
  try {
    const limitParam = options.limit ? `&limit=${options.limit}` : ""

    const data = await fetchWithFallback(
      BASE_COLUMNS,
      `&is_hidden=eq.false&order=created_at.desc${limitParam}`,
      "anon",
    )

    return (data ?? []).map(normalizeMessage)
  } catch (error) {
    console.error("Failed to fetch visible messages", error)
    return []
  }
}

export const getAllMessages = async (
  role: SupabaseRole = "service",
): Promise<DbMessage[]> => {
  const select = role === "service" ? ADMIN_COLUMNS : BASE_COLUMNS
  const data = await fetchWithFallback(
    select,
    "&order=created_at.desc",
    role,
    BASE_COLUMNS,
  )
  return data ?? []
}

export const insertMessageRecord = async (
  payload: Omit<DbMessage, "id" | "created_at" | "is_hidden"> & {
    is_hidden?: boolean
  },
  role: SupabaseRole = "anon",
): Promise<DbMessage | null> => {
  const response = await supabaseFetchJson<DbMessage[]>(
    "/messages",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify([
        {
          ...payload,
          is_hidden: payload.is_hidden ?? false,
        },
      ]),
    },
    role,
  )

  return response?.[0] ?? null
}

export const setMessageVisibility = async (
  id: string,
  hidden: boolean,
  role: SupabaseRole = "service",
): Promise<DbMessage | null> => {
  const normalizedId = normalizeUuid(id)
  if (!normalizedId) {
    throw new Error("Invalid message id")
  }
  const response = await supabaseFetchJson<DbMessage[]>(
    `/messages?id=eq.${normalizedId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ is_hidden: hidden }),
    },
    role,
  )

  return response?.[0] ?? null
}

export const updateMessageRecord = async (
  id: string,
  payload: Partial<Pick<DbMessage, "name" | "message">>,
  role: SupabaseRole = "service",
): Promise<DbMessage | null> => {
  const normalizedId = normalizeUuid(id)
  if (!normalizedId) {
    throw new Error("Invalid message id")
  }

  const response = await supabaseFetchJson<DbMessage[]>(
    `/messages?id=eq.${normalizedId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
    role,
  )

  return response?.[0] ?? null
}

export const deleteMessageRecord = async (
  id: string,
  role: SupabaseRole = "service",
): Promise<void> => {
  const normalizedId = normalizeUuid(id)
  if (!normalizedId) {
    throw new Error("Invalid message id")
  }

  await supabaseFetchJson(
    `/messages?id=eq.${normalizedId}`,
    {
      method: "DELETE",
    },
    role,
  )
}
