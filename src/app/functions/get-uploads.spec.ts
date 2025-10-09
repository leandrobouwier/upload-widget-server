import { describe, expect, test } from 'vitest'
import { getUploads } from './get-uploads'
import { makeUpload } from '@/test/factories/make-upload'
import { randomUUID } from 'crypto'
import { isRight, unwrapEither } from '@/shared/either'
import dayjs from 'dayjs'

describe('get uploads', () => {
  
  test('deve ser capaz de listar uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({name: `${namePattern}.webp`})
    const upload2 = await makeUpload({name: `${namePattern}.webp`})
    const upload3 = await makeUpload({name: `${namePattern}.webp`})
    const upload4 = await makeUpload({name: `${namePattern}.webp`})
    const upload5 = await makeUpload({name: `${namePattern}.webp`})
    const upload6 = await makeUpload({name: `${namePattern}.webp`})

    const sut = await getUploads({
        searchQuery: namePattern,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(6)
    expect(unwrapEither(sut).uploads).toEqual([
        expect.objectContaining({ id: upload6.id }),
        expect.objectContaining({ id: upload5.id }),
        expect.objectContaining({ id: upload4.id }),
        expect.objectContaining({ id: upload3.id }),
        expect.objectContaining({ id: upload2.id }),
        expect.objectContaining({ id: upload1.id }),
    ])
  })

  test('deve ser capaz obter uploads paginados', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({name: `${namePattern}.webp`})
    const upload2 = await makeUpload({name: `${namePattern}.webp`})
    const upload3 = await makeUpload({name: `${namePattern}.webp`})
    const upload4 = await makeUpload({name: `${namePattern}.webp`})
    const upload5 = await makeUpload({name: `${namePattern}.webp`})
    const upload6 = await makeUpload({name: `${namePattern}.webp`})

    let sut = await getUploads({
        searchQuery: namePattern,
        page: 1,
        pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(6)
    expect(unwrapEither(sut).uploads).toEqual([
        expect.objectContaining({ id: upload6.id }),
        expect.objectContaining({ id: upload5.id }),
        expect.objectContaining({ id: upload4.id }),
    ])

     sut = await getUploads({
        searchQuery: namePattern,
        page: 2,
        pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(6)
    expect(unwrapEither(sut).uploads).toEqual([
        expect.objectContaining({ id: upload3.id }),
        expect.objectContaining({ id: upload2.id }),
        expect.objectContaining({ id: upload1.id }),
    ])
  })

  test('deve ser capaz de ordenar uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({name: `${namePattern}.webp`, createdAt: new Date() })
    const upload2 = await makeUpload({name: `${namePattern}.webp`, createdAt: dayjs().subtract(1, 'days').toDate()})
    const upload3 = await makeUpload({name: `${namePattern}.webp`, createdAt: dayjs().subtract(2, 'days').toDate() })
    const upload4 = await makeUpload({name: `${namePattern}.webp`, createdAt: dayjs().subtract(3, 'days').toDate()})
    const upload5 = await makeUpload({name: `${namePattern}.webp`, createdAt: dayjs().subtract(4, 'days').toDate()})
    const upload6 = await makeUpload({name: `${namePattern}.webp`, createdAt: dayjs().subtract(5, 'days').toDate()})

    let sut = await getUploads({
        searchQuery: namePattern,
        sortBy: 'createdAt',
        sortDirection: 'desc'
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(6)
    expect(unwrapEither(sut).uploads).toEqual([
        expect.objectContaining({ id: upload1.id }),
        expect.objectContaining({ id: upload2.id }),
        expect.objectContaining({ id: upload3.id }),
        expect.objectContaining({ id: upload4.id }),
        expect.objectContaining({ id: upload5.id }),
        expect.objectContaining({ id: upload6.id }),
    ])

     sut = await getUploads({
        searchQuery: namePattern,
        sortBy: 'createdAt',
        sortDirection: 'asc'
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(6)
    expect(unwrapEither(sut).uploads).toEqual([
        expect.objectContaining({ id: upload6.id }),
        expect.objectContaining({ id: upload5.id }),
        expect.objectContaining({ id: upload4.id }),
        expect.objectContaining({ id: upload3.id }),
        expect.objectContaining({ id: upload2.id }),
        expect.objectContaining({ id: upload1.id }),
    ])
  })
 
})
