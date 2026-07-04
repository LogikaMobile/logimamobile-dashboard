'use client';
import { Project } from '@/types';

export default function FollowUpList({ projects, onEditProject }: { projects: Project[], onEditProject: (p: Project) => void }) {
  const activeProjects = projects
    .filter(p => !['WON', 'LOST'].includes(p.status))
    .sort((a, b) => new Date(b.lastContactDate).getTime() - new Date(a.lastContactDate).getTime());

  return (
    <div className="bg-panel-bg p-6 rounded border border-panel-border font-mono h-full">
      <h2 className="text-xl font-bold text-brand-orange mb-6 tracking-widest uppercase">/ SEGUIMIENTOS</h2>
      <div className="space-y-4">
        {activeProjects.length === 0 && (
          <p className="text-sm text-gray-500 uppercase tracking-widest">/ SIN_SEGUIMIENTOS</p>
        )}
        {activeProjects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => onEditProject(project)}
            className="flex flex-col border-l-2 border-brand-orange pl-4 py-2 bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
          >
            <span className="font-bold text-white uppercase">{project.companyName}</span>
            <span className="text-sm text-gray-400 mt-1">{project.contactName} // {project.contactChannel}</span>
            <span className="text-xs text-brand-primary mt-2 uppercase tracking-widest group whitespace-nowrap">
              [ ÚLTIMO_CONTACTO: {new Date(project.lastContactDate).toLocaleDateString()} ]
              <span className="ml-2 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
