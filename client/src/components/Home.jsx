import { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react';
import { addDays, addWeeks, format, isSameDay, startOfWeek } from 'date-fns';
import { WEEK, groupByWeek, isDone, weekKey } from '../lib/dates';
import TaskItem from './TaskItem';
import WeekCard from './WeekCard';

export default function Home({ tasks, loading, error, onRetry, onSearch, onAdd, selected, setSelected, ...handlers }) {
  const [expanded, setExpanded] = useState(() => new Set([weekKey(new Date())]));
  const weekStart = startOfWeek(selected, WEEK);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekTasks = tasks.filter((t) => weekKey(new Date(t.dateTime)) === weekKey(selected));
  const done = weekTasks.filter(isDone).length;
  const open = weekTasks.length - done;
  const pct = weekTasks.length ? Math.round((done / weekTasks.length) * 100) : 0;
  const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dateTime), selected));
  const weeks = useMemo(() => groupByWeek(tasks), [tasks]);
  const taskDays = new Set(tasks.map((t) => format(new Date(t.dateTime), 'yyyy-MM-dd')));
  const isToday = isSameDay(selected, new Date());

  const toggleWeek = (k) => setExpanded((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  return (
    <div className="px-5 pb-28 pt-5">
      {/* search */}
      <button onClick={onSearch} className="mb-4 flex w-full items-center justify-between rounded-md border border-neutral-200 px-3 py-3 text-left">
        <span className="text-[10px] text-neutral-400">Search for a task</span><Search size={16} />
      </button>

      {/* week strip */}
      <div className="mb-1 flex items-center justify-between text-[11px] text-neutral-500">
        <button onClick={() => setSelected(addWeeks(selected, -1))} aria-label="Previous week"><ChevronLeft size={16} /></button>
        <span>{format(weekStart, 'd MMM')} – {format(addDays(weekStart, 6), 'd MMM yyyy')}</span>
        <button onClick={() => setSelected(addWeeks(selected, 1))} aria-label="Next week"><ChevronRight size={16} /></button>
      </div>
      <div className="mb-4 grid grid-cols-7 gap-1">
        {days.map((d) => {
          const sel = isSameDay(d, selected);
          return (
            <button key={d} onClick={() => setSelected(d)}
              className={`flex flex-col items-center rounded-[4px] py-1.5 ${sel ? 'bg-primary-dark text-white' : 'text-neutral-400'}`}>
              <span className="text-[8px]">{format(d, 'EEE')}</span>
              <span className={`text-[10px] ${sel ? 'font-semibold' : ''}`}>{format(d, 'dd')}</span>
              <span className={`mt-0.5 h-1 w-1 rounded-full ${taskDays.has(format(d, 'yyyy-MM-dd')) ? (sel ? 'bg-white' : 'bg-primary') : 'bg-transparent'}`} />
            </button>
          );
        })}
      </div>

      {/* summary cards */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-md bg-primary-soft p-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-primary-dark bg-primary-light text-primary-dark"><Check size={14} strokeWidth={3} /></span>
          <div><p className="text-[9px]">Task Complete</p>
            <p className="text-lg font-semibold leading-tight">{String(done).padStart(2, '0')} <span className="text-[8px] font-normal text-neutral-500">This Week</span></p></div>
        </div>
        <div className="flex items-center gap-3 rounded-md bg-danger-soft p-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-red-500 bg-red-200 text-red-600"><X size={14} strokeWidth={3} /></span>
          <div><p className="text-[9px]">Task Pending</p>
            <p className="text-lg font-semibold leading-tight">{String(open).padStart(2, '0')} <span className="text-[8px] font-normal text-neutral-500">This Week</span></p></div>
        </div>
      </div>

      {/* weekly progress */}
      <h3 className="mb-2 text-sm font-medium">Weekly Progress <span className="text-[10px] font-normal text-neutral-400">{pct}%</span></h3>
      <div className="mb-6 h-4 overflow-hidden rounded-[2px] bg-primary-light" role="progressbar" aria-valuenow={pct}>
        <div className="h-full bg-primary-dark transition-all" style={{ width: `${pct}%` }} />
      </div>

      {/* tasks of the selected day */}
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-medium">{isToday ? 'Tasks Today' : `Tasks · ${format(selected, 'EEE d MMM')}`}</h3>
        <a href="#weeks" className="text-[10px] text-primary">View All</a>
      </div>

      {error && <p className="my-4 text-center text-xs text-red-600">{error} <button className="underline" onClick={onRetry}>Retry</button></p>}
      {loading && <p className="py-6 text-center text-xs text-neutral-400">Loading…</p>}
      {!loading && !error && dayTasks.length === 0 && <p className="py-6 text-center text-xs text-neutral-400">No tasks for this day. Tap + to add one.</p>}
      {dayTasks.map((t) => <TaskItem key={t._id} task={t} {...handlers} />)}

      {/* weekly cards */}
      <h3 id="weeks" className="mb-3 mt-8 text-sm font-medium">All Weeks</h3>
      <div className="space-y-3">
        {weeks.map((w) => <WeekCard key={w.key} week={w} expanded={expanded.has(w.key)} onToggleOpen={() => toggleWeek(w.key)} {...handlers} />)}
        {!loading && weeks.length === 0 && <p className="text-center text-xs text-neutral-400">Nothing scheduled yet</p>}
      </div>

      {/* FAB */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 mx-auto flex w-full max-w-md justify-center">
        <button onClick={onAdd} aria-label="Add task"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40">
          <Plus size={26} />
        </button>
      </div>
    </div>
  );
}
