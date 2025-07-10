import { $ } from 'bun';
import path from 'path';

const inputsDir = path.join(__dirname, '..', '..', 'inputs');

export async function tsCheck(input: string): Promise<boolean> {
  if (!input) throw new Error('Input not found.');
  const id = Bun.randomUUIDv7();
  const fileName = `${id}.template.ts`;
  await Bun.write(path.join(inputsDir, fileName), input);
  let success: boolean;
  try {
    await $`bunx tsc --noEmit --strict --strictNullChecks --skipLibCheck ${fileName}`
      .cwd(inputsDir)
      .env({ NODE_OPTIONS: '--max-old-space-size=100' })
      .quiet();
    success = true;
  } catch {
    success = false;
  }
  await Bun.file(path.join(inputsDir, fileName)).delete();
  return success;
}
