'use client';
import { Project, LmaasLeadWithSubscription } from '@/types';

export default function KpiHeader({ 
  projects, 
  lmaasLeads,
  isLmaasMode 
}: { 
  projects: Project[],
  lmaasLeads?: LmaasLeadWithSubscription[],
  isLmaasMode?: boolean
}) {
  if (isLmaasMode) {
    const leadsCount = (lmaasLeads || []).filter(l => ['STEP_0', 'STEP_1'].includes(l.lead.status)).length;
    const inProgressCount = (lmaasLeads || []).filter(l => ['STEP_2', 'STEP_3', 'STEP_4', 'STEP_5', 'STEP_6'].includes(l.lead.status)).length;
    const wonCount = (lmaasLeads || []).filter(l => ['STEP_7', 'STEP_8'].includes(l.lead.status)).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-mono">
        <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-primary/50 transition-colors">
          <h3 className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-4">/ LEADS_LMAAS</h3>
          <p className="text-5xl font-bold text-white">{leadsCount}</p>
        </div>
        <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-purple/50 transition-colors">
          <h3 className="text-brand-purple text-sm font-bold uppercase tracking-widest mb-4">/ PROYECTOS_LMAAS_ACTIVOS</h3>
          <p className="text-5xl font-bold text-white">{inProgressCount}</p>
        </div>
        <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-orange/50 transition-colors">
          <h3 className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-4">/ PROYECTOS_LMAAS_TERMINADOS</h3>
          <p className="text-5xl font-bold text-white">{wonCount}</p>
        </div>
      </div>
    );
  }

  const leadsCount = projects.filter(p => ['STEP_0', 'STEP_1', 'STEP_2', 'STEP_3'].includes(p.status)).length;
  const inProgressCount = projects.filter(p => ['STEP_4', 'STEP_5', 'STEP_6', 'STEP_7', 'STEP_8', 'STEP_9', 'STEP_10'].includes(p.status)).length;
  const wonCount = projects.filter(p => ['DELIVERED', 'LOST'].includes(p.status)).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-mono">
      <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-primary/50 transition-colors">
        <h3 className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-4">/ LEADS_TRADICIONALES</h3>
        <p className="text-5xl font-bold text-white">{leadsCount}</p>
      </div>
      <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-purple/50 transition-colors">
        <h3 className="text-brand-purple text-sm font-bold uppercase tracking-widest mb-4">/ PROYECTOS_ACTIVOS</h3>
        <p className="text-5xl font-bold text-white">{inProgressCount}</p>
      </div>
      <div className="p-6 bg-panel-bg text-foreground rounded border border-panel-border hover:border-brand-orange/50 transition-colors">
        <h3 className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-4">/ PROYECTOS_CERRADOS</h3>
        <p className="text-5xl font-bold text-white">{wonCount}</p>
      </div>
    </div>
  );
}
