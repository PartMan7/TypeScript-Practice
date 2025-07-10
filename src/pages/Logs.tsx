import { useRef, type ReactElement, useState, useMemo, useCallback } from 'react';
import type { Log } from '@/logger/logs.ts';
import { ContentCard } from '@/components/atoms/ContentCard';
import { toHumanTime } from '@/utils/toHumanTime.ts';

function LogRenderer({
  selected,
  log,
  onClick,
}: {
  selected: boolean;
  log: Log;
  onClick: (log: Log) => void;
}): ReactElement {
  const duration = useMemo(() => toHumanTime(log.at.getTime() - log.start.getTime()), [log.at, log.start]);

  return (
    <button onClick={() => onClick(log)} className="cursor-pointer">
      <ContentCard className={`hover:bg-muted ${selected ? 'border-primary bg-muted' : ''}`}>
        <strong>{log.template}</strong> ({log.name})
        <br />
        {log.at.toLocaleString()} ({duration})
      </ContentCard>
    </button>
  );
}

function LogsRenderer({ logs }: { logs: Log[] }): ReactElement {
  const [selected, setSelected] = useState<Log | null>(null);

  const handleClick = useCallback((log: Log) => {
    setSelected(oldLog => (log === oldLog ? null : log));
  }, []);

  if (logs.length === 0) return <ContentCard>No logs...</ContentCard>;
  return (
    <div className="flex gap-4 justify-center w-full m-8 grow">
      <div className="grow shrink basis-0 min-w-0 flex flex-col gap-2">
        {logs.map(log => (
          <LogRenderer selected={selected === log} log={log} onClick={handleClick} />
        ))}
      </div>
      <ContentCard className="grow-2 shrink basis-0 min-w-0">
        {selected ? (
          <pre className="w-full m-4 text-start whitespace-pre-wrap">{selected.code}</pre>
        ) : (
          <h2 className="text-muted-foreground">(Preview)</h2>
        )}
      </ContentCard>
    </div>
  );
}

export function Logs(): ReactElement {
  const socketRef = useRef<WebSocket | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  if (!socketRef.current) {
    const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/socket`);
    socket.addEventListener('open', () => console.log('Socket connected'));
    socket.addEventListener('message', (message: MessageEvent) => {
      const newLogs = JSON.parse(message.data).map(
        (log: Log): Log => ({
          ...log,
          at: new Date(log.at),
          start: new Date(log.start),
        })
      );
      setLogs(oldLogs => [...oldLogs, ...newLogs]);
    });
    socketRef.current = socket;
  }

  return <LogsRenderer logs={logs} />;
}
