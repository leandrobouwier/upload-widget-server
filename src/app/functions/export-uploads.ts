import { ilike } from 'drizzle-orm'
import { z } from 'zod'
import { stringify } from 'csv-stringify'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'
import { pipeline } from 'node:stream/promises'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { PassThrough } from 'node:stream'


const exportUploadsInput = z.object({
  searchQuery: z.string().optional(),
})

type ExportUploadsInput = z.input<typeof exportUploadsInput>

type ExportUploadsOutput = {
  reportUrl: string
}

export async function exportUploads(
  input: ExportUploadsInput
): Promise<Either<never, ExportUploadsOutput>> {
  const { searchQuery } = exportUploadsInput.parse(input)

  const { sql, params } = db
    .select({
      id: schema.uploads.id,
      name: schema.uploads.name,
      remoteKey: schema.uploads.remoteKey,
      remoteUrl: schema.uploads.remoteUrl,
      createdAt: schema.uploads.createdAt,
    })
    .from(schema.uploads)
    .where(
      searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(1)

  const csv = stringify({
    delimiter: '',
    header: true,
    columns: [
      { key: 'id', header:'ID' },
      { key: 'name', header:'Name' },
      { key: 'remote_url', header:'URL' },
      { key: 'created_at', header:'Uploaded at' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline =  pipeline(
    cursor,
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([
    uploadToStorage,
    convertToCSVPipeline,
  ])
  
  console.log(url)

  return makeRight({ reportUrl: url })
}
