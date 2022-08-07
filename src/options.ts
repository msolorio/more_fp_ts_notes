/*
Functor
  map: (a -> b) * f a --> f b

Monad
  map: (a -> b) * f a --> f b

  bind / chain / flatMap: (a -> m b) *  m a --> m b
*/


import * as O from 'fp-ts/lib/option.js'
import * as T from 'fp-ts/lib/Task.js'
import * as E from 'fp-ts/lib/Either.js'
import { pipe } from 'fp-ts/lib/function.js'

// declare function getById(num: number): O.Option<number>

const getById = (num: number) => O.some(num)
// const getById = (num: number) => O.none

// declare function toString(num: number): string

// declare function getById2(num: number): E.Either<string, number>

const getById2 = (num: number) => E.right(num)

// declare function inspect<A>(v: A): O.Option<A>

// function inspect<A>(x: A) {
//   console.log(x)

//   return T.of(x)
// }

const a1 = pipe(1, getById)

''

const a = pipe(1, getById, O.map(toString))

// const b = pipe(1, getById, O.map(getById))

// const b2 = pipe(1, getById, O.map(getById), O.flatten)

// const b3 = pipe(1, getById, O.chain(getById))

// const c = pipe(1, getById, O.fold(() => false, n => true))

// const c = pipe(1, getById, O.fold(() => 0, n => n))

''

// const d = pipe(1, getById, O.getOrElse(() => 0))

''

// // bc getById returns an option we pass it to chain instead of map
// const f = pipe(1, getById, O.chain(getById))

''

// const f2 = pipe(
//   1,
//   getById,
//   O.map(getById),
//   O.chain(O.map(getById))
// )

// const e = pipe(
//   1,
//   getById,
//   O.chain(getById),
//   x => x,
//   O.chainEitherK(getById2),
//   x => x
// )

const g = pipe(
  1,
  getById,
  O.chain(getById),
  O.chainEitherK(getById2),
  x => x,
  E.fromOption(() => 'blah') // converts an option to an either, setting a contained value for the left.
)

''