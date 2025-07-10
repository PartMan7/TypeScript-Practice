import { type ReactElement, useState } from 'react';
import { Input } from '@/components/ui/input';

const NAME_KEY = '%%%NAME%%%';

export function getName(): string | undefined {
  return localStorage.getItem(NAME_KEY);
}

export function NameInput({}): ReactElement {
  const [value, setValue] = useState(() => localStorage.getItem(NAME_KEY) || '');
  return (
    <Input
      value={value}
      onChange={e => {
        localStorage.setItem(NAME_KEY, e.target.value);
        setValue(e.target.value);
      }}
      className="inline-flex max-w-54"
      required
      placeholder="Your name?"
    />
  );
}
