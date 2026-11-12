export default function Onboarding({ onStart }) {
  return (
    <main className="mx-auto flex h-[calc(100dvh-39px)] min-h-[560px] max-w-[440px] flex-col bg-white">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-primary">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border-[10px] border-white/25" />
        <svg className="absolute left-0 top-1/4 opacity-25" width="110" height="90" viewBox="0 0 110 90" fill="none" stroke="#fff" strokeWidth="3">
          {[0, 18, 36, 54].map((y) => <polyline key={y} points={`0,${y + 14} 14,${y} 28,${y + 14} 42,${y} 56,${y + 14} 70,${y} 84,${y + 14} 98,${y}`} />)}
        </svg>
        <svg className="absolute bottom-4 right-0 opacity-25" width="120" height="70" viewBox="0 0 120 70" fill="none" stroke="#fff" strokeWidth="3">
          {[0, 18, 36].map((y) => <polyline key={y} points={`0,${y + 14} 15,${y} 30,${y + 14} 45,${y} 60,${y + 14} 75,${y} 90,${y + 14} 105,${y}`} />)}
        </svg>
      </div>
      <section className="flex h-[201px] shrink-0 flex-col px-4 pb-[22px] pt-[17px]">
        <h1 className="text-base font-semibold">Manage What To Do</h1>
        <p className="mt-2 text-[9px] leading-[14px] text-neutral-500">The best way to manage what you have to do,<br /> don&apos;t forget your plans</p>
        <button onClick={onStart} className="mt-auto w-full bg-primary py-[9px] text-[12px] font-medium text-white">Get Started</button>
      </section>
    </main>
  );
}
