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

const getPipableConct = <A>(M: Magma<A>) => (second: A) => (first: A) => {
  return M.concat(first, second)
}

const MagmaSub: Magma<number> = {
  concat: (first, second) => first - second
}

import { pipe } from 'fp-ts/lib/function'

// concatSub :: (second: number) => (first: number) => number
const concatSub = getPipableConct(MagmaSub)

const result = pipe(
  10,
  concatSub(2), // (n) => n - 2
  concatSub(3) // (n) => n - 3
)

////////////////////////////////////////////////////////////////////
// Semigroups

import { Semigroup } from 'fp-ts/lib/Semigroup'

const SemigroupCombineArr: Semigroup<ReadonlyArray<string>> = {
  concat: (first, second) => first.concat(second)
}



''