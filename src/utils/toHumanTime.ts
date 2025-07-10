type Entry = {
  abbr: string;
  name: string;
  plur: string;
  time: number;
  count?: number;
};
export function toHumanTime(timeInMs: number, format: 'f2s' | 'hhmmss' | 'abs' = 'f2s'): string {
  const timeList: (
    | {
        abbr: string;
        name: string;
        plur: string;
      }
    | [number, number?]
  )[] = [
    {
      abbr: 'ms',
      name: 'millisecond',
      plur: 'milliseconds',
    },
    [1000],
    {
      abbr: 'sec',
      name: 'second',
      plur: 'seconds',
    },
    [60],
    {
      abbr: 'min',
      name: 'minute',
      plur: 'minutes',
    },
    [60],
    {
      abbr: 'hr',
      name: 'hour',
      plur: 'hours',
    },
    [24],
    {
      abbr: 'day',
      name: 'day',
      plur: 'days',
    },
    [7],
    {
      abbr: 'wk',
      name: 'week',
      plur: 'weeks',
    },
    [365, 7],
    {
      abbr: 'yr',
      name: 'year',
      plur: 'years',
    },
    [10],
    {
      abbr: 'dec',
      name: 'decade',
      plur: 'decades',
    },
  ];
  const {
    entries: timeEntries,
  }: {
    scale: number;
    entries: Entry[];
  } = timeList.reduce(
    (acc, current) => {
      if (Array.isArray(current)) {
        const [mult, div = 1] = current;
        acc.scale *= mult / div;
      } else acc.entries.push({ ...current, time: acc.scale });
      return acc;
    },
    { entries: [] as Entry[], scale: 1 }
  );
  if (format === 'hhmmss') timeEntries.splice(-3);
  let timeLeft = timeInMs;
  timeEntries.reverse().forEach(entry => {
    if (timeLeft >= entry.time) {
      const count = Math.floor(timeLeft / entry.time);
      entry.count = count;
      timeLeft -= count * entry.time;
    } else entry.count = 0;
  });
  timeEntries.reverse();
  switch (format) {
    case 'abs': {
      const firstIndex = timeEntries.findIndex(entry => entry.count! > 0);
      if (firstIndex === -1) return '0 ms';
      return timeEntries
        .slice(firstIndex, firstIndex + 2)
        .filter(entry => entry.count)
        .map(entry => `${entry.count} ${entry.count === 1 ? entry.name : entry.plur}`)
        .join(` and `);
    }
    case 'hhmmss': {
      const [ms, s, m, h, d] = timeEntries.map(entry => entry.count);
      return `${d ? `${d}:` : ''}${d || h ? `${h}:` : ''}${m}:${s}${ms ? `.${ms}` : ''}`;
    }
    case 'f2s':
    default: {
      return (
        timeEntries
          .filter(entry => entry.count)
          .reverse()
          .slice(0, 2)
          .map(entry => `${entry.count} ${entry.count === 1 ? entry.name : entry.plur}`)
          .join(` and `) || '0 ms'
      );
    }
  }
}
