'use client';
import { Project } from '@/types';
import { updateProject } from '@/lib/api';
import { mutate } from 'swr';
import { useState } from 'react';
import EditProjectModal from './EditProjectModal';

const COLUMNS = [
  { id: 'STEP_0', title: '0. Prospección (Outbound)' },
  { id: 'STEP_1', title: '1. Requerimientos' },
  { id: 'STEP_2', title: '2. Mapeo As-Is/To-Be' },
  { id: 'STEP_3', title: '3. Propuesta Tec/Eco' },
  { id: 'STEP_4', title: '4. Reglas de Negocio' },
  { id: 'STEP_5', title: '5. Modelado y POC' },
  { id: 'STEP_6', title: '6. Codificación' },
  { id: 'STEP_7', title: '7. Pruebas y QA' },
  { id: 'STEP_8', title: '8. Staging (Demo)' },
  { id: 'STEP_9', title: '9. UAT' },
  { id: 'STEP_10', title: '10. Producción' },
  { id: 'DELIVERED', title: 'Proyecto Entregado' },
  { id: 'LOST', title: 'Cerrado Perdido' }
];

export default function KanbanPipeline({ projects }: { projects: Project[] }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleDragStart = (e: React.DragEvent, project: Project) => {
    e.dataTransfer.setData('project', JSON.stringify(project));
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setIsDragging(false);
    
    try {
      const projectData = e.dataTransfer.getData('project');
      if (!projectData) return;
      
      const project: Project = JSON.parse(projectData);
      
      if (project.status === newStatus) return;
      
      // Optimistic update
      const updatedProjects = projects.map(p => 
        p.id === project.id ? { ...p, status: newStatus } : p
      );
      mutate('projects', updatedProjects, false);
      
      // API call
      const updatedProject = { ...project, status: newStatus };
      await updateProject(project.id, updatedProject);
      
      // Revalidate
      mutate('projects');
    } catch (error) {
      console.error('Error updating project status:', error);
      mutate('projects'); // Revert optimistic update
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-brand-purple mb-4">Pipeline Visual</h2>
      <div className="flex flex-wrap gap-4 pb-4">
        {COLUMNS.map((col) => {
          const colProjects = projects.filter(p => p.status === col.id);
          
          return (
            <div 
              key={col.id} 
              className={`w-[280px] bg-panel-bg rounded border ${isDragging ? 'border-dashed border-panel-border/50' : 'border-panel-border'} flex flex-col max-h-[70vh] font-mono shadow-lg shrink-0 transition-all`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="flex justify-between items-center mb-3 border-b border-panel-border pb-2 p-4">
                <h3 className="font-bold text-white uppercase tracking-widest text-sm">{col.title}</h3>
                <span className="bg-brand-primary/20 text-brand-primary border border-brand-primary text-xs font-bold px-2 py-1 rounded">
                  {colProjects.length}
                </span>
              </div>
              
              <div className="overflow-y-auto flex-1 space-y-3 p-4 pt-0 min-h-[100px]">
                {colProjects.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4 uppercase tracking-widest">/ VACÍO</p>
                )}
                
                {colProjects.map(project => (
                  <div 
                    key={project.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, project)}
                    onDragEnd={handleDragEnd}
                    onClick={() => { setSelectedProject(project); setIsEditModalOpen(true); }}
                    className="bg-black/60 p-4 rounded border border-panel-border hover:border-brand-primary hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all cursor-grab active:cursor-grabbing"
                  >
                    <div className="mb-2">
                      {['STEP_0', 'STEP_1', 'STEP_2', 'STEP_3'].includes(project.status) ? (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded uppercase tracking-widest">LEAD</span>
                      ) : (
                        <span className="text-[10px] font-bold text-black bg-brand-orange px-2 py-0.5 rounded uppercase tracking-widest">PROYECTO</span>
                      )}
                    </div>
                    {project.projectName ? (
                      <>
                        <p className="font-bold text-white uppercase">{project.projectName}</p>
                        <p className="text-sm font-semibold text-brand-purple mt-1 uppercase">{project.companyName}</p>
                      </>
                    ) : (
                      <p className="font-bold text-white uppercase">{project.companyName}</p>
                    )}
                    <p className="text-xs text-gray-400 mb-2 mt-1">{project.contactName} <span className="text-brand-purple">({project.contactChannel})</span></p>
                    <div className="flex justify-between text-sm mt-3 pt-3 border-t border-panel-border">
                      <span className="text-brand-orange font-bold">
                        {formatCurrency(Number(project.quotedPrice) || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        onSuccess={() => mutate('projects')}
        project={selectedProject}
      />
    </div>
  );
}
