import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import * as prettier from 'prettier/standalone';
import * as estreePlugin from 'prettier/plugins/estree';
import * as tsPlugin from 'prettier/plugins/typescript';

const prettierConfig = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
  arrowParens: 'avoid',
} as const;

const plugins = [estreePlugin, tsPlugin];

export default async function prettify(file: string, path = 'default.tsx'): Promise<string> {
  return prettier.format(file, {
    ...prettierConfig,
    parser: 'typescript',
    plugins,
    filepath: path,
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
