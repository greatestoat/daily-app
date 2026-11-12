import { useRef, useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { isDone } from '../lib/dates';

const PRIORITY = { Low: 'bg-green-500', Medium: 'bg-amber-400', High: 'bg-red-500' };
const REVEAL = 88;

export default function TaskItem({ task, onToggle, onEdit, onDelete, showDate = false }) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const base = useRef(0);
  const done = isDone(task);

  const down = (e) => { startX.current = e.clientX; base.current = dx; setDragging(true); };
  const move = (e) => {
    if (!dragging) return;
    setDx(Math.max(-REVEAL, Math.min(0, base.current + e.clientX - startX.current)));
  };
  const up = () => { setDragging(false); setDx(dx < -REVEAL / 2 ? -REVEAL : 0); };

  const time = format(new Date(task.dateTime), 'h:mm a') + (task.endTime ? ` – ${task.endTime}` : '');

  return (
    <div className="relative overflow-hidden border-b border-neutral-100">
      <button
        onClick={() => onDelete(task)}
        className="absolute inset-y-0 right-0 flex items-center justify-center gap-1 bg-red-500 text-xs font-medium text-white"
        style={{ width: REVEAL }}
        aria-label="Delete task"
      >
        <Trash2 size={16} /> Delete
      </button>

      <div
        className="relative flex touch-pan-y select-none items-center gap-3 bg-white py-3"
        style={{ transform: `translateX(${dx}px)`, transition: dragging ? 'none' : 'transform .2s' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={() => dragging && up()}
      >
        <button
          onClick={() => onToggle(task)}
          aria-label={done ? 'Mark in progress' : 'Mark completed'}
          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border-[1.5px] ${
            done ? 'border-primary bg-primary-soft text-primary' : 'border-primary bg-white'
          }`}
        >
          {done && <Check size={12} strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1" onClick={() => onEdit(task)}>
          <p className={`truncate text-[13px] ${done ? 'text-neutral-700 line-through' : 'text-neutral-900'}`}>{task.title}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-neutral-400">
            <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY[task.priority]}`} />
            {showDate && `${format(new Date(task.dateTime), 'EEE d MMM')} · `}{time}
          </p>
        </div>

        <button onClick={() => onDelete(task)} className="p-1 text-neutral-300 hover:text-red-500" aria-label="Delete"><Trash2 size={16} /></button>
        <button onClick={() => onEdit(task)} className="p-1 pr-2 text-neutral-300 hover:text-primary" aria-label="Edit"><Pencil size={16} /></button>
      </div>
    </div>
  );
}
