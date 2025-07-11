import type { Expect } from '@type-challenges/utils';

// fixed implementation
type Equal<X, Y> =
  (<T>() => T extends Omit<X, never> ? 1 : 2) extends <T>() => T extends Omit<Y, never> ? 1 : 2 ? true : false;

type PartialByKeys</* SHORT_INPUT */> = /* LONG_INPUT */;

/* Test Cases */

interface User {
  name: string;
  age: number;
  address: string;
}

type Cases = [
  Expect<Equal<PartialByKeys<User, "name">, UserPartialName>>,
  Expect<Equal<PartialByKeys<User, "name" | "age">, UserPartialNameAndAge>>,
  Expect<Equal<PartialByKeys<User>, Partial<User>>>,
  // @ts-expect-error
  Expect<Equal<PartialByKeys<User, "name" | "unknown">, UserPartialName>>,
];

interface UserPartialName {
  name?: string;
  age: number;
  address: string;
}

interface UserPartialNameAndAge {
  name?: string;
  age?: number;
  address: string;
}
