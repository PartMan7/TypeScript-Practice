import type { Equal, Expect } from '@type-challenges/utils';

type Last<T extends unknown[]> = /* LONG_INPUT */;

/* Test Cases */

type Cases = [
  Expect<Equal<Last<[]>, never>>,
  Expect<Equal<Last<[2]>, 2>>,
  Expect<Equal<Last<[3, 2, 1]>, 1>>,
  Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>,
];
