import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'

// declare function getById(num: number): E.Either<string, number>

// declare function getHalf(num: number): E.Either<string, number>

// declare function toString(num: number): string

const getById2 = (num: number): O.Option<number> => {
  return num > 2 ? O.some(num) : O.none
}

const getById = (num: number): E.Either<string, number> => {
  return num < 10 ? E.right(num) : E.left('The number is too large.')
}

const getHalf = (num: number): E.Either<string, number> => {
  return num % 2 === 0 ? E.right(num / 2) : E.left('Number is not divisible by 2.')
}

const toString = (num: number): string => num.toString()

// const a1 = pipe(12, getById, E.chain(getHalf))

// const a1 = pipe(12, getById, E.chain(getHalf), E.map(toString))

const a1 = pipe(8, getById, E.chainOptionK(() => 'There was an error')(getById2))



''