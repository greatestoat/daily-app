import { startOfWeek, endOfWeek, format } from 'date-fns';

export const WEEK = { weekStartsOn: 1 }; // Monday -> Sunday
export const weekKey = (d) => format(startOfWeek(d, WEEK), 'yyyy-MM-dd');
export const isDone = (t) => t.status === 'completed';

export function groupByWeek(tasks) {
  const map = new Map();
  tasks.forEach((t) => {
    const d = new Date(t.dateTime);
    const key = weekKey(d);
    if (!map.has(key)) map.set(key, { key, start: startOfWeek(d, WEEK), end: endOfWeek(d, WEEK), tasks: [] });
    map.get(key).tasks.push(t);
  });
  return [...map.values()]
    .sort((a, b) => b.start - a.start)
    .map((w) => {
      const sorted = [...w.tasks].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      const done = sorted.filter(isDone).length;
      return { ...w, tasks: sorted, done, open: sorted.length - done };
    });
}
