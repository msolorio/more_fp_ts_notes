import axios from 'axios'
import { pipe, flow } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/taskEither'
// import * as E from 'fp-ts/lib/Either'

const char_url = 'http://swapi.dev/api/people/'


export const fetchChar = async (idx: number): Promise<{ [key: string]: any }> => {
  return (await axios.get(`${char_url}/${idx}`)).data
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
    
const getChar = (idx: number) => pipe(
  TE.tryCatch(() => fetchChar(idx), (err) => err),
  TE.mapLeft(() => 'Failed to retrieve data' )
)()

;(async () => {
  const result = await getChar(2)
})()

''
