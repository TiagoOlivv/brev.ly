import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { LinkNotFound } from '@/app/functions/errors/link-not-found'
import { incrementLinkAccesses } from '@/app/functions/increment-link-accesses'
import { isLeft, isRight, unwrapEither } from '@/shared/either'

const linkSchema = z.object({
  id: z.uuid(),
  originalUrl: z.url(),
  shortUrl: z.string(),
  accessCount: z.number(),
  createdAt: z.date(),
})

export const incrementLinkAccessesRoute: FastifyPluginAsyncZod =
  async server => {
    server.patch(
      '/links/:id/accesses',
      {
        schema: {
          summary: 'Increment link accesses',
          tags: ['links'],
          params: z.object({ id: z.uuid() }),
          response: {
            200: z.object({ link: linkSchema }),
            404: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const result = await incrementLinkAccesses(request.params)

        if (isLeft(result)) {
          const error = unwrapEither(result)

          if (error instanceof LinkNotFound) {
            return reply.status(404).send({ message: error.message })
          }
        }

        if (isRight(result)) {
          const link = unwrapEither(result)

          return reply.status(200).send({ link })
        }
      }
    )
  }
