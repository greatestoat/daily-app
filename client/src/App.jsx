import { useCallback, useEffect, useState } from 'react';
import { api } from './lib/api';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import Search from './components/Search';
import TaskModal from './components/TaskModal';
import { isDone } from './lib/dates';

export default function App() {
  const [screen, setScreen] = useState(() => (new URLSearchParams(window.location.search).has('onboarding') || localStorage.getItem('onboardingVersion') !== '2' ? 'onboarding' : 'home'));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // { task?: Task }
  const [selected, setSelected] = useState(new Date());

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setTasks(await api.list()); } catch (e) { setError(e.message || 'Could not load tasks'); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (data) => {
    if (modal?.task) {
      const updated = await api.update(modal.task._id, data);
      setTasks((p) => p.map((t) => (t._id === updated._id ? updated : t)));
    } else {
      const created = await api.create(data);
      setTasks((p) => [...p, created]);
    }
  };

  const onToggle = async (task) => {
    const status = isDone(task) ? 'in-progress' : 'completed';
    setTasks((p) => p.map((t) => (t._id === task._id ? { ...t, status } : t))); // optimistic
    try { await api.setStatus(task._id, status); } catch { load(); }
  };

  const onDelete = async (task) => {
    setTasks((p) => p.filter((t) => t._id !== task._id));
    try { await api.remove(task._id); } catch { load(); }
  };

  const handlers = { onToggle, onDelete, onEdit: (task) => setModal({ task }) };

  if (screen === 'onboarding') {
    return <div className="min-h-screen bg-[#e5e5e5] px-8 pt-3"><div className="mx-auto max-w-[440px] text-[14px] text-neutral-400">Onboarding</div><div className="mx-auto mt-[9px] max-w-[440px]"><Onboarding onStart={() => { localStorage.setItem('onboarded', '1'); localStorage.setItem('onboardingVersion', '2'); setScreen('home'); }} /></div></div>;
  }

  return (
    <div className="app-shell">
      {screen === 'search' ? (
        <Search tasks={tasks} onBack={() => setScreen('home')} {...handlers} />
      ) : (
        <Home tasks={tasks} loading={loading} error={error} onRetry={load}
          selected={selected} setSelected={setSelected}
          onSearch={() => setScreen('search')} onAdd={() => setModal({})} {...handlers} />
      )}
      {modal && <TaskModal task={modal.task} defaultDate={selected} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
}


