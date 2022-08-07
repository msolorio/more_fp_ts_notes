////////////////////////////////////////////////////////////
// Magma
// - a very simple algebra
// - contains a set / type A
// - contains a concat operation
// - no laws to obay

interface iMagma<A> {
  readonly concat: (first: A, second: A) => A
}

import { Magma } from 'fp-ts/lib/Magma'

const getPipeableConcat = <A>(M: Magma<A>) => (second: A) => (first: A) =>
  M.concat(first, second)

const MagmaSub: Magma<number> = {
  concat: (first, second) => first - second
}

import { pipe } from 'fp-ts/lib/function'

// concatSub :: (second: number) => (first: number) => number
const concatSub = getPipeableConcat(MagmaSub)

const result = pipe(
  10,
  concatSub(2), // (n) => n - 2
  concatSub(3) // (n) => n - 3
)

////////////////////////////////////////////////////////////////////
// Semigroups

import { Semigroup } from 'fp-ts/lib/Semigroup'

const SemigroupCombine: Semigroup<ReadonlyArray<string>> = {
  concat: (first, second) => first.concat(second)
}

const SemigroupSum: Semigroup<number> = {
  concat: (first, second) => first + second
}

const SemigroupAll: Semigroup<boolean> = {
  concat: (first, second) => first && second
}

''

///////////////////////////////////////////////////////////////////
import * as B from 'fp-ts/lib/boolean'
import { concatAll } from 'fp-ts/lib/Semigroup'
import * as S from 'fp-ts/lib/struct'

// Checks if every item in the provided array meets the criteria set by predicate funciton
const every = <A>(predicate: (a: A) => boolean) => (as: ReadonlyArray<A>): boolean => {
  return concatAll(B.SemigroupAll)(true)(as.map(predicate))
}

// Checks if any item in the provided array metts the criteria set by the predication function
const some = <A>(predicate: (a: A) => boolean) => (as: ReadonlyArray<A>): boolean => {
  return concatAll(B.SemigroupAny)(false)(as.map(predicate))
}

// Combines the provided objects
const assign = (as: ReadonlyArray<object>): object => {
  return concatAll(S.getAssignSemigroup<object>())({})(as)
}

const allAreEvent = every<number>(x => x % 2 === 0)([2, 4, 3])

const combined = assign([{
  pet: 'cat', location: 'San Diego' },
  { pet: 'dog', activity: 'code' }
])

/////////////////////////////////////////////////////////////////
// Reversing arguments in a semigroup

import * as Str from 'fp-ts/lib/string'

const reverse = <A>(S: Semigroup<A>): Semigroup<A> => ({
  concat: (first, second) => S.concat(second, first)
})

const result1 = Str.Semigroup.concat('a', 'b')
const result2 = reverse(Str.Semigroup).concat('a', 'b')

''

