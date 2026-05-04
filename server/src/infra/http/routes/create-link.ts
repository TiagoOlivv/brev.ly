import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createLink } from '@/app/functions/create-link'
import { InvalidShortUrl } from '@/app/functions/errors/invalid-short-url'
import { LinkAlreadyExists } from '@/app/functions/errors/link-already-exists'
import { isLeft, isRight, unwrapEither } from '@/shared/either'

const linkSchema = z.object({
  id: z.uuid(),
  originalUrl: z.url(),
  shortUrl: z.string(),
  accessCount: z.number(),
  createdAt: z.date(),
})

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create link',
        tags: ['links'],
        body: z.object({
          originalUrl: z.url(),
          shortUrl: z.string(),
        }),
        response: {
          201: z.object({ link: linkSchema }),
          400: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const result = await createLink(request.body)

      if (isLeft(result)) {
        const error = unwrapEither(result)

        if (error instanceof InvalidShortUrl) {
          return reply.status(400).send({ message: error.message })
        }

        if (error instanceof LinkAlreadyExists) {
          return reply.status(409).send({ message: error.message })
        }
      }

      if (isRight(result)) {
        const link = unwrapEither(result)

        return reply.status(201).send({ link })
      }
    }
  )
}
