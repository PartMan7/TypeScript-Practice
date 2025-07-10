// Logs are not persistent.
// This is intentional.

import type { ServerWebSocket } from 'bun';

export type Log = { template: string; code: string; name: string; start: Date; at: Date };
const cache: Log[] = [];

export function getCurrentLogs(): string {
  return JSON.stringify(cache);
}

export function log(logData: Log, emitters: Set<ServerWebSocket<any>>) {
  cache.push(logData);
  emitters.forEach(socket => socket.send(JSON.stringify([logData])));
}
