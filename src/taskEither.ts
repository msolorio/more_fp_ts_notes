import axios from 'axios'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/taskEither'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'

const firstPlanetUrl = 'http://swapi.dev/api/planets/1'

export const fetchPlanet = async (): Promise<unknown> => {
  return (await axios.get(firstPlanetUrl)).data
}


export const transformData = (planet: any) => {
  return {
    name: O.fromNullable(planet.name),
    population: O.fromNullable(planet.population),
    diameter: O.fromNullable(planet.diameter)
  }
}



export const handleNoData = TE.fromPredicate(
  (data: any) => (data.detail !== 'Not found'),
  () => 'There is no data for the requested planet.'
)


const getPlanet = pipe(
  TE.tryCatch(fetchPlanet, (err) => err),
  TE.mapLeft(() => 'The request failed to retrieve your data.'),
  TE.chain(handleNoData),
  TE.map(transformData)
)


;(async () => {
  const result = await getPlanet()
})()

// const result = O.fromPredicate(a => !!a)(null)

''