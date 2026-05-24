import { Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-app-border bg-app-bg/95">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center border-2 border-app-text bg-app-surface text-app-accent">
            <Cpu size={22} strokeWidth={1.9} />
          </div>
          <span className="font-display text-2xl font-semibold text-app-text sm:text-[28px]">
            Query Optimizer
          </span>
        </div>
       
      </div>
    </header>
  );
}
