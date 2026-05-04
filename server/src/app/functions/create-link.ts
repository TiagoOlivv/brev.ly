import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { InvalidShortUrl } from './errors/invalid-short-url'
import { LinkAlreadyExists } from './errors/link-already-exists'

const createLinkInput = z.object({
  originalUrl: z.url(),
  shortUrl: z.string().min(3).max(32).regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/)
})

type CreateLinkInput = z.input<typeof createLinkInput>
type CreateLinkOutput = typeof schema.links.$inferSelect

export async function createLink(
  input: CreateLinkInput
): Promise<Either<InvalidShortUrl | LinkAlreadyExists, CreateLinkOutput>> {
  const parsedInput = createLinkInput.safeParse(input)

  if (!parsedInput.success) {
    return makeLeft(new InvalidShortUrl())
  }

  const { originalUrl, shortUrl } = parsedInput.data

  const [existingLink] = await db
    .select({ id: schema.links.id })
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .limit(1)

  if (existingLink) {
    return makeLeft(new LinkAlreadyExists())
  }

  const [link] = await db
    .insert(schema.links)
    .values({ originalUrl, shortUrl })
    .returning()

  return makeRight(link)
}
