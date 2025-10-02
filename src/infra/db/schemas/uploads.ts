import { randomUUID } from 'node:crypto'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

// banco de dados eu coloco com undescor ex: remote_key, e no js came on case
// isso influência como eu vou trabalhar com elas no js e como é criado a tabela no banco de dados
export const uploads = pgTable('uploads', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  remoteKey: text('remote_key').notNull().unique(),
  remoteUrl: text('remote_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow().notNull(),
})
