import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { isRight, unwrapEither } from '@/shared/either'
import { makeUpload } from '@/test/factories/make-upload'
import { exportUploads } from './export-uploads'
import { getUploads } from './get-uploads'

describe('export uploads', () => {
  test('deve ser capaz de exportar uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}.webp` })
    const upload6 = await makeUpload({ name: `${namePattern}.webp` })

    const sut = await exportUploads({
      searchQuery: namePattern,
    })
  })
})
