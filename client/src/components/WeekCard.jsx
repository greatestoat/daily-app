import { ChevronDown } from 'lucide-react';
import { format, isSameWeek } from 'date-fns';
import { WEEK } from '../lib/dates';
import TaskItem from './TaskItem';

export default function WeekCard({ week, expanded, onToggleOpen, ...handlers }) {
  const current = isSameWeek(week.start, new Date(), WEEK);
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
      <button onClick={onToggleOpen} className="flex w-full items-center gap-3 p-3 text-left">
        <div className="flex-1">
          <p className="text-[13px] font-medium">
            {format(week.start, 'd MMM')} – {format(week.end, 'd MMM')}
            {current && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[9px] text-white">This week</span>}
          </p>
          <div className="mt-2 flex gap-2 text-[10px]">
            <span className="rounded-md bg-danger-soft px-2 py-1 text-red-700">{week.open} Open</span>
            <span className="rounded-md bg-primary-soft px-2 py-1 text-primary-dark">{week.done} Completed</span>
          </div>
        </div>
        <ChevronDown size={18} className={`text-neutral-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="border-t border-neutral-100 px-3">
          {week.tasks.map((t) => <TaskItem key={t._id} task={t} showDate {...handlers} />)}
        </div>
      )}
    </div>
  );
}
