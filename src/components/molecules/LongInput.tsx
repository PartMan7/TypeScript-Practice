export function LongInput({ onChange }: { onChange: (value: string) => void }) {
  return (
    <div
      contentEditable
      className="border border-zinc-300 dark:border-zinc-600 w-full h-auto"
      onInput={e => onChange((e.target as HTMLDivElement).innerText)}
    />
  );
}
