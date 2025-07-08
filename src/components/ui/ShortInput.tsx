export function ShortInput({ onChange }: { onChange: (value: string) => void }) {
  return (
    <span
      contentEditable
      className="border border-zinc-300 dark:border-zinc-600 min-w-16 h-auto inline-block"
      onInput={e => onChange((e.target as HTMLDivElement).innerText)}
    >
      &nbsp;
    </span>
  );
}
