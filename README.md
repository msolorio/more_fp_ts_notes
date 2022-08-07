
### Magma
https://github.com/enricopolanski/functional-programming#definition-of-a-magma

A magma is an algebra with
- a set or type (A)
- a binary closed operation to A (the concat operation)
- no laws to obay

```ts
interface Magma<A> {
  readonly concat: (first: A, second: A) => A
}
```

### Closed Operation
A function that returns the same type as its inputs.
```ts
const concat = (first: A, second: A) => A
```
`concat` is a **combinator** for type `A`
 
#### Associativity
An operation is associative if the order in which inputs are combined does not matter

```ts
// associative
1 + (2 + 3) + 4 === (1 + 2) + (3 + 4)

// not associative
(5 - 4) - 3 !== 5 - (4 - 3)
```


### Semigroup
https://github.com/enricopolanski/functional-programming#definition-of-a-semigroup

A magma with a concat operation that is associative.
- Every semigroup is a magma, but not every magma is a semigroup.

```ts
interface Semigroup<A> extends Magma<A> {
  concat: (first: A, second: A) => A
}
```

```ts
concat(concat(a, b), c) === concat(a, concat(b, c))
```

If concat implemented subtraction it would not be associative, not a semigroup.

If we know that there is such an operation that follows the associativity law,
we can further split a computation into two sub computations,
each of them could be further split into sub computations.

Subcomputations can be run in parallel

```ts
a * b * c * d * e * f * g * h = ((a * b) * (c * d)) * ((e * f) * (g * h))
```

The concat operation on Semigroups and Magmas can have different meanings

depending on the type (A) provided and the context

- concatenation
- combination
- merging
- fusion
- selection
- sum
- substitution


