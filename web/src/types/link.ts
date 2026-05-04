export type Link = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export type CreateLinkInput = {
  originalUrl: string
  shortUrl: string
}
