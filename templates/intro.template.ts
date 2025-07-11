import type { Equal, Expect } from '@type-challenges/utils';

type HelloWorld =
  /* LONG_INPUT */
;

/* Test Cases */

type Cases = [Expect<Equal<HelloWorld, string>>];
