export function ShortInput({ onChange }: { onChange: (value: string) => void }) {
  return (
    <input className="border border-zinc-300 dark:border-zinc-600 w-32" onChange={e => onChange(e.target.value)} />
  );
}
