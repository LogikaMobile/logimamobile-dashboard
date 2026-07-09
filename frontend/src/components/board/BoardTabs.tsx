"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import KanbanBoard from "./KanbanBoard";
import CeremoniesPanel from "./CeremoniesPanel";
import CreateIssueModal from "./CreateIssueModal";
import EpicsModal from "./EpicsModal";

export default function BoardTabs() {
  const [activeTab, setActiveTab] = useState<"kanban" | "ceremonies">("kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEpicsModalOpen, setIsEpicsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const session = await getSession();
      if (session?.user?.role === "ADMIN") {
        setIsAdmin(true);
      }
    };
    checkRole();
  }, []);

  const handleIssueCreated = () => {
    setIsModalOpen(false);
    // Simple way to refresh the board data: reload page or emit event.
    // Given KanbanBoard uses local state fetch, we can just trigger a window.location.reload() for a quick fix,
    // or better, implement a React context or prop to trigger reload. 
    // Since we don't have a context, we'll reload the window for now to ensure all nested components sync.
    window.location.reload();
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 border-b border-white/20 mb-6 font-mono text-sm justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("kanban")}
            className={`py-2 px-4 transition-colors ${
              activeTab === "kanban"
                ? "border-b-2 border-white text-white font-bold"
                : "text-gray-500 hover:text-white"
            }`}
          >
            GENERAL KANBAN
          </button>
          <button
            onClick={() => setActiveTab("ceremonies")}
            className={`py-2 px-4 transition-colors ${
              activeTab === "ceremonies"
                ? "border-b-2 border-white text-white font-bold"
                : "text-gray-500 hover:text-white"
            }`}
          >
            CEREMONIES
          </button>
        </div>
        <div className="flex gap-2 mb-2">
          {isAdmin && (
            <button
              onClick={() => setIsEpicsModalOpen(true)}
              className="px-4 py-1.5 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
            >
              VER ÉPICAS
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-1.5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-300 transition-colors"
          >
            + NUEVO TICKET
          </button>
        </div>
      </div>

      <div>
        {activeTab === "kanban" && <KanbanBoard />}
        {activeTab === "ceremonies" && <CeremoniesPanel />}
      </div>

      {isModalOpen && (
        <CreateIssueModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleIssueCreated} 
        />
      )}

      {isEpicsModalOpen && (
        <EpicsModal onClose={() => setIsEpicsModalOpen(false)} />
      )}
    </div>
  );
}
