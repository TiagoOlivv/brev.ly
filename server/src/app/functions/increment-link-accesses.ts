import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { LinkNotFound } from './errors/link-not-found'

const incrementLinkAccessesInput = z.object({
  id: z.uuid(),
})

type IncrementLinkAccessesInput = z.input<typeof incrementLinkAccessesInput>
type IncrementLinkAccessesOutput = typeof schema.links.$inferSelect

export async function incrementLinkAccesses(
  input: IncrementLinkAccessesInput
): Promise<Either<LinkNotFound, IncrementLinkAccessesOutput>> {
  const { id } = incrementLinkAccessesInput.parse(input)

  const [link] = await db
    .update(schema.links)
    .set({
      accessCount: sql`${schema.links.accessCount} + 1`,
    })
    .where(eq(schema.links.id, id))
    .returning()

  if (!link) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(link)
}
