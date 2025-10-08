import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { InvalidFileFormat } from './errors/invalid-file-format'
import { uploadImage } from './upload-image'

describe('upload image', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: 'https://storage.com/image.jpg',
          }
        }),
      }
    })
  })

  test('deve ser capaz de fazer upload de uma imagem', async () => {
    const fileName = `${randomUUID()}.jpg`

    const sut = await uploadImage({
      fileName,
      contentType: 'image/jpg',
      contentStream: Readable.from([]),
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.uploads)
      .where(eq(schema.uploads.name, fileName))

    expect(result).toHaveLength(1)
  })

  test('Não deve ser capaz de carregar um arquivo inválido', async () => {
    const fileName = `${randomUUID()}.pdf`

    const sut = await uploadImage({
      fileName,
      contentType: 'document/pdf',
      contentStream: Readable.from([]),
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat)
  })
})
