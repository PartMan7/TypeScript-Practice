export function ShortInput({ onChange }: { onChange: (value: string) => void }) {
  return (
    <span
      contentEditable
      className="border border-zinc-300 dark:border-zinc-600 h-auto px-2"
      onInput={e => onChange((e.target as HTMLDivElement).innerText)}
    />
  );
}
