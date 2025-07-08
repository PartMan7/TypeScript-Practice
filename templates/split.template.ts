import type { Equal, Expect } from '@type-challenges/utils';

type Split<Str extends string, Delim extends string = ','> = /* LONG_INPUT */;

/* Test Cases */

type Cases = [
  Expect<Equal<Split<'abc,def'>, ['abc', 'def']>>,
  Expect<Equal<Split<''>, ['']>>,
  Expect<Equal<Split<'abc,def,abc'>, ['abc', 'def', 'abc']>>,
  Expect<Equal<Split<'abc,,abc'>, ['abc', '', 'abc']>>,
  Expect<Equal<Split<'abc,'>, ['abc', '']>>,
  Expect<Equal<Split<'abc def abc', ' '>, ['abc', 'def', 'abc']>>,
  // @ts-expect-error
  Expect<Equal<Split<'abc def'>>, ['abc', 'def']>
];
