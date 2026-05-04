const shortUrlPattern = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/

export function normalizeOriginalUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

export function normalizeShortUrl(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^brev\.ly\//i, '')
    .toLowerCase()
}

export function isValidUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidShortUrl(value: string) {
  return value.length >= 3 && value.length <= 32 && shortUrlPattern.test(value)
}

export function formatShortUrl(frontendUrl: string, shortUrl: string) {
  return `${frontendUrl}/${shortUrl}`
}

export function formatAccessCount(accessCount: number) {
  return `${accessCount} ${accessCount === 1 ? 'acesso' : 'acessos'}`
}
