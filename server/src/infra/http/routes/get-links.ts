import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getLinks } from '@/app/functions/get-links'
import { unwrapEither } from '@/shared/either'

const linkSchema = z.object({
  id: z.uuid(),
  originalUrl: z.url(),
  shortUrl: z.string(),
  accessCount: z.number(),
  createdAt: z.date(),
})

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Get links',
        tags: ['links'],
        response: {
          200: z.object({ links: z.array(linkSchema) }),
        },
      },
    },
    async () => {
      const result = await getLinks()

      return unwrapEither(result)
    }
  )
}
