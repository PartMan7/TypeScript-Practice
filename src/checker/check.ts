import { $ } from 'bun';
import path from 'path';

const inputsDir = path.join(__dirname, '..', '..', 'inputs');

async function check(input: string): Promise<boolean> {
  if (!input) throw new Error('Input not found.');
  const id = Bun.randomUUIDv7();
  await Bun.write(path.join(inputsDir, `${id}.ts`), input);
  try {
    await $`bunx tsc --noEmit --strict --strictNullChecks ${id}.ts`.cwd(inputsDir);
    return true;
  } catch {
    return false;
  }
}

check('let a: number = null;').then(console.log);
