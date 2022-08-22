import axios from 'axios'
import { pipe, flow } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/taskEither'
// import * as E from 'fp-ts/lib/Either'

const char_url = 'http://swapi.dev/api/people/'
// const species_url = 'http://swapi.dev/api/species/'


// export const fetchChar = async (idx: number): Promise<{ [key: string]: any }> => {
export const fetchChar = async (idx: number): Promise<unknown> => {
  return (await axios.get(`${char_url}/${idx}`)).data
}

const fetchFromUrl = async (url: string): Promise<unknown> => {
  return (await axios.get(url)).data
}

// export const fetchFirstChar = async (): Promise<unknown> => {
//   return (await axios.get(`${char_url}/1`)).data
// }

// const getFirstChar1 = pipe(
//   TE.tryCatch(fetchFirstChar, err => err),
//   TE.mapLeft(() => 'Failed to retrieve data')
// )

// const getFirstChar2 = TE.tryCatch(fetchFirstChar, err => err)

// ;(async () => {
//   const result = await fetchChar(1)
// })()

const handleHttpError = () => 'failed to retrieve your data'

const handleC3PO = (charObj: any) => {
  return pipe(
    TE.tryCatch(async () => {
      return {
        ...charObj,
        name: 'The true hero of the series',
        species: await fetchFromUrl(charObj.species[0])
      }
    }, err => err), // handleHttpError could also easily go here
    TE.mapLeft(handleHttpError)
  )
}


// Async Branching with TaskEither ////////////////////////////////////////////////////
const getChar = (idx: number) => pipe(
  TE.tryCatch(() => fetchChar(idx), (err) => err),
  // ^ 1st http call
  TE.mapLeft(handleHttpError),
  // ^ returns a left of defined val
  TE.chain((data: any) => data.name === 'C-3PO' ? handleC3PO(data) : TE.right(data))
  // ^ optional 2nd http call. returns a right of either form
)()

;(async () => {
  const result = await getChar(1)

  ''
})()

