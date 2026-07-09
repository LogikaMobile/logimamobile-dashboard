import Link from 'next/link';
import BoardTabs from '@/components/board/BoardTabs';

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase font-mono">
            ENG // TASK_BOARD
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Link 
              href="/apps/projects/dashboard"
              className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[#111111] border border-white/20 text-white hover:bg-white hover:text-black transition-colors font-mono"
            >
              &lt; REGRESAR
            </Link>
            <p className="text-gray-400 font-mono text-sm">
              LogikaMobile Anti-Jira Board
            </p>
          </div>
        </div>
      </div>
      
      <BoardTabs />
    </div>
  );
}
