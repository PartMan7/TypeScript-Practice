import path from 'path';
import { tsCheck } from './tsCheck';

export async function validate(input: string, template: string): Promise<boolean> {
  const templateData = await Bun.file(path.join(__dirname, '..', '..', 'templates', `${template}.template.ts`)).text();
  const parts = templateData.split(/\/\* (?:SHORT|LONG)_INPUT \*\//);
  if (!input.startsWith(parts[0]) || !input.endsWith(parts.at(-1))) return false;

  let remainingText = input;
  while (parts.length > 0) {
    const nextIndex = remainingText.indexOf(parts.shift());
    if (nextIndex === -1) return false;
    remainingText = remainingText.slice(nextIndex);
  }
  return tsCheck(input);
}
