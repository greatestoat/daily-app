import { useEffect, useState } from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { api } from '../lib/api';
import TaskItem from './TaskItem';

export default function Search({ tasks, onBack, ...handlers }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // debounced server search; re-runs when tasks change (edit/delete/toggle)
  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const id = setTimeout(() => {
      api.list(q.trim()).then(setResults).catch(() => setResults([])).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(id);
  }, [q, tasks]);

  return (
    <div className="px-5 pt-5">
      <button onClick={onBack} className="mb-4" aria-label="Back"><ArrowLeft size={20} /></button>
      <div className="mb-4 flex items-center rounded-md border border-neutral-200 px-3">
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or description"
          className="w-full bg-transparent py-3 text-[12px] outline-none" />
        <SearchIcon size={16} className="text-neutral-700" />
      </div>
      {!q.trim() && <p className="py-10 text-center text-xs text-neutral-400">Type a keyword to find tasks</p>}
      {q.trim() && !loading && results.length === 0 && <p className="py-10 text-center text-xs text-neutral-400">No tasks found</p>}
      {results.map((t) => <TaskItem key={t._id} task={t} showDate {...handlers} />)}
    </div>
  );
}
