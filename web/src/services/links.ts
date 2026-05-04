import type { CreateLinkInput, Link } from '@/types/link'
import { backendUrl } from './env'

type ApiErrorPayload = {
  message?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }

  let payload: ApiErrorPayload = {}

  try {
    payload = (await response.json()) as ApiErrorPayload
  } catch {
    payload = {}
  }

  throw new ApiError(
    payload.message ?? 'Não foi possível completar a ação.',
    response.status,
  )
}

export async function getLinks() {
  const response = await fetch(`${backendUrl}/links`)
  const data = await parseResponse<{ links: Link[] }>(response)

  return data.links
}

export async function getLinkByShortUrl(shortUrl: string) {
  const response = await fetch(
    `${backendUrl}/links/${encodeURIComponent(shortUrl)}`,
  )
  const data = await parseResponse<{ link: Link }>(response)

  return data.link
}

export async function createLink(input: CreateLinkInput) {
  const response = await fetch(`${backendUrl}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
  const data = await parseResponse<{ link: Link }>(response)

  return data.link
}

export async function deleteLink(id: string) {
  const response = await fetch(`${backendUrl}/links/${id}`, {
    method: 'DELETE',
  })

  await parseResponse<void>(response)
}

export async function incrementLinkAccesses(id: string) {
  const response = await fetch(`${backendUrl}/links/${id}/accesses`, {
    method: 'PATCH',
  })
  const data = await parseResponse<{ link: Link }>(response)

  return data.link
}

export async function exportLinksCsv() {
  const response = await fetch(`${backendUrl}/links/exports`, {
    method: 'POST',
  })
  const data = await parseResponse<{ reportUrl: string }>(response)

  return data.reportUrl
}
