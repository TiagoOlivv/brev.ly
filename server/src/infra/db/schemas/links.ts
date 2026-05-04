import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const links = pgTable(
  'links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    shortUrl: varchar('short_url', { length: 32 }).notNull(),
    originalUrl: text('original_url').notNull(),
    accessCount: integer('access_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [
    uniqueIndex('links_short_url_unique_index').on(table.shortUrl),
    index('links_created_at_index').on(table.createdAt),
  ]
)
