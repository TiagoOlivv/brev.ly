import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { asc } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFile } from '@/infra/storage/upload-file'
import { type Either, makeRight } from '@/shared/either'

type ExportLinksCsvOutput = {
  reportUrl: string
}

export async function exportLinksCsv(): Promise<
  Either<never, ExportLinksCsvOutput>
> {
  const links = await db
    .select({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      shortUrl: schema.links.shortUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .orderBy(asc(schema.links.createdAt))

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'originalUrl', header: 'Original URL' },
      { key: 'shortUrl', header: 'Short URL' },
      { key: 'accessCount', header: 'Access Count' },
      { key: 'createdAt', header: 'Created At' },
    ],
  })

  const contentStream = new Transform({
    objectMode: true,
    transform(link: (typeof links)[number], _encoding, callback) {
      callback(null, {
        ...link,
        createdAt: link.createdAt.toISOString(),
      })
    },
  })

  const csvPipeline = pipeline(Readable.from(links), contentStream, csv)

  const uploadToStorage = uploadFile({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: 'links.csv',
    contentStream: csv,
  })

  const [{ url }] = await Promise.all([uploadToStorage, csvPipeline])

  return makeRight({ reportUrl: url })
}
