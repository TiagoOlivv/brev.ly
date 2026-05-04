import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { exportLinksCsv } from '@/app/functions/export-links-csv'
import { unwrapEither } from '@/shared/either'

export const exportLinksCsvRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links/exports',
    {
      schema: {
        summary: 'Export links CSV',
        tags: ['links'],
        response: {
          200: z.object({ reportUrl: z.url() }),
        },
      },
    },
    async (_request, reply) => {
      const result = await exportLinksCsv()
      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
