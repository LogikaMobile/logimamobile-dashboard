"use client";

import { useState, useEffect } from "react";

type Epic = {
  id: string;
  title: string;
  description: string;
  legacyProjectId?: string;
  status: string;
};

export default function EpicsModal({ onClose }: { onClose: () => void }) {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEpics = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/api/board/epics`);
        if (res.ok) setEpics(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEpics();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 font-mono backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/20 p-6 flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
          <h2 className="text-xl font-bold tracking-widest uppercase">ÉPICAS DEL SISTEMA</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isLoading ? (
            <div className="animate-pulse text-gray-500">CARGANDO...</div>
          ) : epics.length === 0 ? (
            <div className="text-gray-500">No hay épicas registradas.</div>
          ) : (
            epics.map(epic => (
              <div key={epic.id} className="border border-white/10 bg-[#111111] p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-lg">{epic.title}</h3>
                  <span className="text-[10px] bg-white/10 px-2 py-1 uppercase">{epic.status}</span>
                </div>
                {epic.description && (
                  <p className="text-sm text-gray-400">{epic.description}</p>
                )}
                {epic.legacyProjectId && (
                  <div className="text-xs text-blue-400 mt-2">Proyecto ID: {epic.legacyProjectId}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
