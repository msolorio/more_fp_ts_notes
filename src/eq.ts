interface Eq<A> {
  readonly equals: (x: A, y: A) => boolean
}

const eqNum: Eq<number> = {
  equals: (x, y) => x === y
}

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some(item => E.equals(item, a))
}

elem(eqNum)(1, [1, 2, 3])
elem(eqNum)(3, [2, 3, 4])


