import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { LinkNotFound } from './errors/link-not-found'

const getLinkInput = z.object({
  shortUrl: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/),
})

type GetLinkInput = z.input<typeof getLinkInput>
type GetLinkOutput = typeof schema.links.$inferSelect

export async function getLink(
  input: GetLinkInput
): Promise<Either<LinkNotFound, GetLinkOutput>> {
  const parsedInput = getLinkInput.safeParse(input)

  if (!parsedInput.success) {
    return makeLeft(new LinkNotFound())
  }

  const { shortUrl } = parsedInput.data

  const [link] = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .limit(1)

  if (!link) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(link)
}
