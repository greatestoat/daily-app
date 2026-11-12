import { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { format } from 'date-fns';

const PRIORITIES = ['Low', 'Medium', 'High'];
const field = 'w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[12px] outline-none focus:border-primary';

export default function TaskModal({ task, defaultDate, onClose, onSave }) {
  const editing = !!task;
  const d = task ? new Date(task.dateTime) : null;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    date: d ? format(d, 'yyyy-MM-dd') : format(defaultDate || new Date(), 'yyyy-MM-dd'),
    start: d ? format(d, 'HH:mm') : '09:00',
    end: task?.endTime || '',
    priority: task?.priority || 'Medium',
  });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setErr('Task title is required');
    if (!form.date || !form.start) return setErr('Date and start time are required');
    if (form.end && form.end <= form.start) return setErr('End time must be after start time');
    setSaving(true);
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        dateTime: new Date(`${form.date}T${form.start}`).toISOString(),
        endTime: form.end,
        priority: form.priority,
      });
      onClose();
    } catch (e2) { setErr(e2.message); setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <form
        onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 pb-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">{editing ? 'Edit Task' : 'Add New Task'}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <label className="mb-1 block text-[10px] text-neutral-500">Task title *</label>
        <input className={`${field} mb-3`} placeholder="Doing Homework" value={form.title} onChange={set('title')} maxLength={120} autoFocus />

        <label className="mb-1 block text-[10px] text-neutral-500">Set Time *</label>
        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="task-start-time" className="mb-1 block text-[10px] text-neutral-500">Start time *</label>
            <div className="relative"><Clock size={13} className="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
              <input id="task-start-time" type="time" className={`${field} pl-8`} value={form.start} onChange={set('start')} aria-label="Start time" /></div>
          </div>
          <div>
            <label htmlFor="task-end-time" className="mb-1 block text-[10px] text-neutral-500">End time</label>
            <div className="relative"><Clock size={13} className="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
              <input id="task-end-time" type="time" className={`${field} pl-8`} value={form.end} onChange={set('end')} aria-label="End time" /></div>
          </div>
        </div>

        <label className="mb-1 block text-[10px] text-neutral-500">Set Date *</label>
        <div className="relative mb-3"><Calendar size={13} className="pointer-events-none absolute right-3 top-3.5 text-neutral-500" />
          <input type="date" className={field} value={form.date} onChange={set('date')} /></div>

        <label className="mb-1 block text-[10px] text-neutral-500">Priority</label>
        <div className="mb-3 grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => (
            <button type="button" key={p} onClick={() => setForm((f) => ({ ...f, priority: p }))}
              className={`rounded-md border py-2 text-[12px] ${form.priority === p ? 'border-primary bg-primary text-white' : 'border-neutral-200 text-neutral-600'}`}>
              {p}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-[10px] text-neutral-500">Description</label>
        <textarea className={`${field} mb-3 h-24 resize-none`} placeholder="Add Description" value={form.description} onChange={set('description')} maxLength={1000} />

        {err && <p className="mb-2 text-[11px] text-red-600">{err}</p>}
        <button disabled={saving} className="w-full rounded-md bg-primary py-3 text-[13px] font-medium text-white disabled:opacity-60">
          {saving ? 'Saving…' : editing ? 'Save' : 'Create task'}
        </button>
      </form>
    </div>
  );
}
