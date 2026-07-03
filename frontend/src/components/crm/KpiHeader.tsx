'use client';
import { Project } from '@/types';

export default function KpiHeader({ projects }: { projects: Project[] }) {
  const leadsCount = projects.filter(p => p.status === 'STEP_0').length;
  const inProgressCount = projects.filter(p => ['STEP_1', 'STEP_2', 'STEP_3', 'STEP_4'].includes(p.status)).length;
  const wonCount = projects.filter(p => ['STEP_5', 'STEP_6', 'STEP_7', 'STEP_8', 'STEP_9', 'STEP_10', 'DELIVERED'].includes(p.status)).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-mono">
      <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-primary/50 transition-colors">
        <h3 className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-4">/ NUEVOS_LEADS</h3>
        <p className="text-5xl font-bold text-white">{leadsCount}</p>
      </div>
      <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-purple/50 transition-colors">
        <h3 className="text-brand-purple text-sm font-bold uppercase tracking-widest mb-4">/ EN_NEGOCIACIÓN</h3>
        <p className="text-5xl font-bold text-white">{inProgressCount}</p>
      </div>
      <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-orange/50 transition-colors">
        <h3 className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-4">/ CERRADOS_GANADOS</h3>
        <p className="text-5xl font-bold text-white">{wonCount}</p>
      </div>
    </div>
  );
}
