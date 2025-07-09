import type { Equal, Expect } from '@type-challenges/utils';

type SimpleRecord</* SHORT_INPUT */> = {
/* LONG_INPUT */};

/* Test Cases */

type Cases = [
  Expect<Equal<SimpleRecord<'a', number>, { a: number }>>,
  // @ts-expect-error
  Expect<Equal<SimpleRecord<'a', number>, { a: string }>>,
];
