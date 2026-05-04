import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteLink } from '@/app/functions/delete-link'
import { LinkNotFound } from '@/app/functions/errors/link-not-found'
import { isLeft, unwrapEither } from '@/shared/either'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/links/:id',
    {
      schema: {
        summary: 'Delete link',
        tags: ['links'],
        params: z.object({ id: z.uuid() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const result = await deleteLink(request.params)

      if (isLeft(result)) {
        const error = unwrapEither(result)

        if (error instanceof LinkNotFound) {
          return reply.status(404).send({ message: error.message })
        }
      }

      return reply.status(204).send(null)
    }
  )
}
