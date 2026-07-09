"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import CreateIssueModal from "./CreateIssueModal";

type Epic = {
  id: string;
  title: string;
};

type Issue = {
  id: string;
  type: string;
  parentId?: string;
  epicId?: string;
  title: string;
  status: string; 
  isBlocked: boolean;
  fibonacciScore?: number;
  estimatedHours: number;
  loggedHours: number;
  technicalDescription?: string;
};

interface IssueDetailsModalProps {
  issue: Issue;
  epics: Epic[];
  allIssues: Issue[];
  onClose: () => void;
}

export default function IssueDetailsModal({ issue, epics, allIssues, onClose }: IssueDetailsModalProps) {
  const epic = epics.find(e => e.id === issue.epicId);
  const subtasks = allIssues.filter(i => i.parentId === issue.id);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const session = await getSession();
      if (session?.user?.role === "ADMIN") {
        setIsAdmin(true);
      }
    };
    checkRole();
  }, []);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer y eliminará las subtareas asociadas.")) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/api/board/issues/${issue.id}`, { method: 'DELETE' });
        if (res.ok) {
          window.location.reload();
        } else {
          alert("Error eliminando el ticket.");
        }
      } catch (e) {
        console.error(e);
        alert("Error de conexión.");
      }
    }
  };

  if (isEditing) {
    return (
      <CreateIssueModal 
        initialData={issue} 
        onClose={() => setIsEditing(false)}
        onSuccess={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 font-mono backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#0a0a0a] border border-white/20 p-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/20">
          <div>
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
              <span className={`px-2 py-0.5 uppercase font-bold text-[10px] ${issue.type === 'USER_STORY' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {issue.type.replace('_', ' ')}
              </span>
              {epic && <span>• {epic.title}</span>}
              <span>• {issue.status}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">{issue.title}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
              <div className="flex gap-2 mr-4">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 border border-white/20 text-[10px] text-white uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  EDITAR
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/50 text-[10px] uppercase tracking-widest hover:bg-red-500/40 transition-colors"
                >
                  ELIMINAR
                </button>
              </div>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none">
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-2">
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 border border-white/10">
            <div>
              <div className="text-[10px] text-gray-500 uppercase mb-1">Horas Estimadas</div>
              <div className="text-sm text-white font-bold">{issue.estimatedHours}h</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase mb-1">Horas Registradas</div>
              <div className="text-sm text-white font-bold">{issue.loggedHours}h</div>
            </div>
            {issue.fibonacciScore !== undefined && issue.fibonacciScore !== null && (
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-1">Puntos Story</div>
                <div className="text-sm text-white font-bold">{issue.fibonacciScore}</div>
              </div>
            )}
            <div>
              <div className="text-[10px] text-gray-500 uppercase mb-1">Bloqueado</div>
              <div className="text-sm font-bold flex items-center">
                {issue.isBlocked ? (
                  <span className="text-red-400">SÍ ⚠️</span>
                ) : (
                  <span className="text-green-400">NO</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Descripción Técnica</h3>
            <div className="bg-[#111] p-4 border border-white/10 text-sm text-gray-300 whitespace-pre-wrap min-h-[100px]">
              {issue.technicalDescription || "Sin descripción proporcionada."}
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Subtareas ({subtasks.length})
              </h3>
            </div>
            
            {subtasks.length === 0 ? (
              <div className="text-xs text-gray-500 italic p-4 bg-[#111] border border-white/10">
                No hay subtareas registradas para este ticket.
              </div>
            ) : (
              <div className="space-y-3">
                {subtasks.map(sub => (
                  <div key={sub.id} className="bg-[#1a1a1a] border border-white/20 p-4 flex justify-between items-center hover:bg-[#222] transition-colors">
                    <div>
                      <div className="text-[10px] text-yellow-500 font-bold uppercase mb-1">Subtarea</div>
                      <h4 className="text-sm text-white font-bold">{sub.title}</h4>
                      {sub.technicalDescription && (
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{sub.technicalDescription}</p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-[10px] bg-white/10 px-2 py-1 uppercase">{sub.status}</span>
                      <span className="text-xs text-gray-500">{sub.loggedHours} / {sub.estimatedHours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
