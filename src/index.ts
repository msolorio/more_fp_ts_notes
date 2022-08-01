//////////////////////////////////////////////////////////////
// PIPE

import { pipe } from 'fp-ts/lib/function'

const len = (s: string): number => s.length

const double = (n: number): number => n * 2

const result = len('apple') // => 5

const result2 = double(len('apple')) // => 10

const result3 = pipe(
  'apple',
  len,
  double
) // => 10


//////////////////////////////////////////////////////////////
// EITHER
// Represents a value of one of two possible types - a disjoint union
import * as E from 'fp-ts/lib/Either';
// https://gcanti.github.io/fp-ts/modules/Either.ts.html#either-type-alias
// type Either<E, A> = Left<E> | Right<A>


// Returns either left holding a bool or right holding a number
const getRandNum = (): E.Either<boolean, number> => {

  const randNum = Math.random()

  if (randNum < 0.5) {
    return E.left(false)

  } else  {
    return E.right(randNum)

  }
}

const myLeft = E.left('error message')
console.log('myLeft ==>', myLeft)

const myRight = E.right('success')
console.log('myRight ==>', myRight)

////////////////////////////////////////////////////////////
// type Either<E, A> = Left<E> | Right<A>

type PasswordMissingCap = 'password missing cap'
type PasswordShortError = 'password too short'
type PasswordValidationError = PasswordShortError | PasswordMissingCap

interface Password {
  value: string
  isHashed: boolean
}

const validatePassword = (password: Password): E.Either<PasswordValidationError, Password> => {
  if (password.value.length < 10) {
    return E.left('password too short')
  }

  if (!/[A-Z]/.test(password.value)) {
    return E.left('password missing cap')
  }

  return E.right(password)
}

////////////////////////////////////////////////////////////
// Building a pipeline and partially applying dependancies in
// middle of pipeline.

import { flow } from 'fp-ts/lib/function'

const length = (v) => v.length
const multiply = (c) => (v) => v * c

const pipelineE = flow(
  length,
  multiply(2) // injecting dependancy into pipeline
)

const resultE = pipe('a val', pipelineE)

////////////////////////////////////////////////////////////
// .fromPredicate

// Random num is piped to E.fronPredicate
// If num is > 0.5 --> return right(number)
// Otherwise       --> return left(false)
const getRandNum2 = (): E.Either<boolean, number> => {

  return pipe(
    Math.random(),

    E.fromPredicate(
      (n) => n > 0.5,
      () => false
    )
  )
}

////////////////////////////////////////////////////////////
// .filterOrElse
// is piped a right or left as input
// if input is a right, value stored within is checked against function 1,
// if true, return right holding value
// otherwise, return left holding false, in this case

const getRandNum3 = (): E.Either<boolean, number> => {

  return pipe(
    E.right(Math.random()),

    E.filterOrElse(
      (n) => n > 0.5,
      () => false
    )
  )
}

const randNum = getRandNum()


//////////////////////////////////////////////////////////////
//
import * as T from 'fp-ts/lib/Task'

/*
A task is a function that returns a value an never fails

interface Task<A> {
  (): Promise<A>
}
*/

//////////////////////////////////////////////////////////////
// TASK EITHER

import * as TE from 'fp-ts/lib/TaskEither'

;(async() => {
  const asyncFunc = TE.right(1) // returns an async function that when called will return a right

  const result = await asyncFunc() // => E.Either<never, number>
})()

;(async() => {
  const result = await TE.right(1)() // => E.Either<never, number>
})()

//////////////////////////////////////////////////////////////
// using TE.alt
// https://gcanti.github.io/fp-ts/modules/TaskEither.ts.html#alt-1

;(async () => {
  const asyncFunc = pipe(
    TE.right(1),
    TE.alt(() => TE.right(2))
  )

  const resultTE1 = await asyncFunc() // E.Either<never, number>
})()

;(async () => {
  const asyncFunc = pipe(
    TE.left(1),
    TE.alt(() => TE.right(2))
  )

  const resultTE1 = await asyncFunc()
  // => E.Either<never, number>
  // => E.Right<2>
})()

//////////////////////////////////////////////////////////////
// Task Either - TryCatch
// returns an async function that when called will return a TaskEither
import axios from 'axios'

;(async () => {
  const asyncFunc = TE.tryCatch(
    () => axios.get('https://api.kanye.rest'),
    (error) => new Error(`${error}`)
  )

  const result = await asyncFunc() // returns a Promise of an E.Either (E.Right)
  
  // const quote = result.right.data.quote
  // TypeScript doesn't want us to access .right
  // because result is of type Either
  // we don't know if it's a right

  // We could type gaurd with an if
  if (result._tag === 'Right') {
    const quote = result.right.data.quote
  }
})()

//////////////////////////////////////////////////////////

// Failed async call
;(async () => {
  const asyncFunc = TE.tryCatch(
    () => axios.get('https://api.kanye.restttttt'),
    (error) => new Error(`${error}`)
  )

  const result = await asyncFunc()
  // => E.Left<Error>
  // If the async func created by tryCatch fails,
  // it will return a Left
})()

//////////////////////////////////////////////////////////

// We could pipe the result to another TE handler
;(async () => {
  const asyncFunc = pipe(
    TE.tryCatch(
      () => axios.get('https://api.kanye.rest'),
      (error) => new Error(`${error}`)
    ),
    TE.map((result) => result.data.quote)
  )

  const result = await asyncFunc() // returns a Promise of an E.Either
  // ==> TE.Right<quote>
  // If the call is successfull .map will access the quote within.
})()

/////////////////////////////////////////////////////////////
// If async code fails, .map will ignore the callback and send a left

;(async () => {
  const asyncFunc = pipe(
    TE.tryCatch(
      () => axios.get('https://api.kanye.resttttt'),
      (error) => new Error(`${error}`)
    ),
    TE.map((result) => {
      console.log('this will not run')

      return result.data.quote
    })
  )

  const result = await asyncFunc()
  
  // The axios call fails
  // tryCatch sends a Left to .map
  // .map does not call the callback function
  // .map forwards the Left down the chain.
  // Left is returned from the pipe()

  'breakpoint'
})()

/////////////////////////////////////////////////////////
// TaskEither chain
// returns a function that takes in a TaskEither and returns a TaskEither
const TEChain = TE.chain((result) => TE.right(result)) // returns an instance of a TaskEither

/////////////////////////////////////////////////////////////////////

;(async () => {
  const asyncFunc = pipe(
    TE.tryCatch(
      () => axios.get('https://api.kanye.rest'),
      (error) => new Error(`${error}`)
    ),
    // If the tryCatch fails, TE.chain is sent a Left and does not call the call the callback
    TE.chain((result) => { // returns an instance of a TaskEither
      return TE.right(result)
    })
  )
    
  const resultTEChain = await asyncFunc()
    
  'breakpoint'
})()

/////////////////////////////////////////////////////////////////////
;(async () => {
  const asyncFunc = pipe(
    TE.tryCatch(
      () => axios.get('https://api.kanye.restttt'),
      (error) => new Error(`${error}`)
    ),
    TE.mapLeft((result) => {
      console.log('result ==>', result);
  
      // return result
      return { message: 'there was an error' }
    })
  )

  // If TE.mapLeft is passed a Left (the axios call fails), the callback is run
  // TE.mapLeft returns a new Left holding the return value from the callback
  // Can be used to intercept an error and return a custom error

  const result = await asyncFunc()
})()

/////////////////////////////////////////////////////////
// OPTIONS
// type Option<A> = None | Some<A>
// A discriminated union of a None and Some
import * as O from 'fp-ts/lib/Option'


/////////////////////////////////////////////////////////
const myOption1 = O.some(5)
const myOption2 = O.none

const resultO6 = O.toNullable(myOption1) // returns 5
const resultO7 = O.isSome(myOption1) // returns a true

const resultO8 = O.toNullable(myOption2) // return null
const resultO9 = O.isSome(myOption2) // returns a false


/////////////////////////////////////////////////////////
const foo = {
  bar: 'a string'
}

const resultO1 = pipe(
  foo,
  O.fromNullable // converts foo to a Some (Option)
)
// ==> O.some('a string')

'breakpoint'
//////////////////////////////////////

const resultO2 = pipe(
  undefined,
  O.fromNullable // returns a None (Option)
)
  // ==> O.none
  
'breakpoint'
  
////////////////////////////////////////////////////
// .map
// recieves an Option and if it is a Some
// calls the callback and returns a Some
// holding the new computed value

const resultO3 = pipe(
  foo,
  O.fromNullable, // converts foo to a Some
  O.map((f) => f.bar) // returns Some('a string')
)

'breakpoint'
///////////////////////////////////////////////////
const resultO4 = pipe(
  undefined,
  O.fromNullable, // converts undefined to None
  O.map((f) => f.bar) // returns None
)

'breakpoint'

///////////////////////////////////////////////////
const resultO5 = pipe(
  foo,
  O.fromNullable, // convert to an Option
  O.chain((f) => O.fromNullable(f))
)

'breakpoint'

///////////////////////////////////////////////////
