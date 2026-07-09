"use client";

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import IssueDetailsModal from './IssueDetailsModal';

type Epic = {
  id: string;
  title: string;
  legacyProjectId?: string;
  lmaasLeadId?: string;
  status: string;
};

type Issue = {
  id: string;
  type: string; // 'USER_STORY' | 'TASK' | 'SUBTASK'
  parentId?: string;
  epicId?: string;
  title: string;
  status: string; 
  isBlocked: boolean;
  fibonacciScore?: number;
  estimatedHours: number;
  loggedHours: number;
  isBurned: boolean;
  isFrozen: boolean;
};

const STATUSES = ['GENERAL_BACKLOG', 'REFINED', 'ESTIMATED', 'SPRINT_BACKLOG', 'DEVELOPMENT', 'CODE_REVIEW', 'QA', 'DELIVERED'];

export default function KanbanBoard() {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const loadBoard = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const [epicsRes, issuesRes] = await Promise.all([
        fetch(`${apiUrl}/api/board/epics`),
        fetch(`${apiUrl}/api/board/issues`)
      ]);
      if (epicsRes.ok) setEpics(await epicsRes.json());
      if (issuesRes.ok) setIssues(await issuesRes.json());
    } catch (error) {
      console.error("Failed to load board:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, []);

  const moveIssue = async (issueId: string, currentStatus: string) => {
    const currentIndex = STATUSES.indexOf(currentStatus);
    if (currentIndex >= STATUSES.length - 1) return;
    
    const nextStatus = STATUSES[currentIndex + 1];
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const session = await getSession();
      const userId = session?.user?.id;
      
      await fetch(`${apiUrl}/api/board/issues/${issueId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(userId ? { 'X-User-Id': userId } : {})
        },
        body: JSON.stringify({ status: nextStatus })
      });
      loadBoard();
    } catch (e) {
      console.error("Failed to move issue:", e);
    }
  };

  if (isLoading) {
    return <div className="font-mono text-white animate-pulse mt-8">LOADING_BOARD_DATA...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-8 font-mono">
      {STATUSES.map(status => {
        // Exclude subtasks from main columns unless they are bugfixes in QA? Wait, for now just show all top-level issues.
        const columnIssues = issues.filter(i => i.status === status && i.type !== 'SUBTASK');
        
        return (
          <div key={status} className="bg-[#111111] border border-white/20 flex flex-col h-full">
            <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/5">
              <h2 className="text-sm font-bold tracking-widest uppercase">{status.replace('_', ' ')}</h2>
              <span className="text-xs bg-white text-black px-2 py-1 font-bold">{columnIssues.length}</span>
            </div>
            
            <div className="p-4 space-y-4">
              {columnIssues.map(issue => {
                const epic = epics.find(e => e.id === issue.epicId);
                const subtasks = issues.filter(i => i.parentId === issue.id);
                
                return (
                  <div 
                    key={issue.id} 
                    onClick={() => setSelectedIssue(issue)}
                    className={`bg-[#1A1A1A] border ${issue.isBurned ? 'border-red-500' : issue.isFrozen ? 'border-blue-500' : 'border-white/10'} p-4 shadow-[4px_4px_0px_rgba(255,255,255,0.1)] relative cursor-pointer hover:bg-[#222] transition-colors`}
                  >
                    {issue.isBurned && <div className="absolute top-0 right-0 -mt-2 -mr-2 text-xl">🔥</div>}
                    {issue.isFrozen && <div className="absolute top-0 right-0 -mt-2 -mr-2 text-xl">❄️</div>}
                    
                    <div className="text-[10px] text-gray-500 uppercase mb-2 truncate flex justify-between">
                      <span>{epic?.title || 'NO EPIC'}</span>
                      <span className={issue.type === 'USER_STORY' ? 'text-green-400' : 'text-blue-400'}>{issue.type.replace('_', ' ')}</span>
                    </div>
                    
                    <h3 className="text-sm font-bold text-white mb-4 line-clamp-2">
                      {issue.title}
                    </h3>
                    
                    <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-2">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-gray-400">
                          {issue.loggedHours} / {issue.estimatedHours}h
                        </div>
                        {issue.type === 'USER_STORY' && issue.fibonacciScore && (
                          <div className="text-[10px] bg-white/10 px-1 inline-block w-fit">
                            Pts: {issue.fibonacciScore}
                          </div>
                        )}
                        {subtasks.length > 0 && (
                          <div className="text-[10px] text-gray-500">
                            {subtasks.length} subtasks
                          </div>
                        )}
                      </div>
                      
                      {status !== 'DELIVERED' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent opening modal when moving
                            moveIssue(issue.id, status);
                          }}
                          className="px-3 py-1 bg-white text-black text-[10px] font-bold tracking-wider hover:bg-gray-300 transition-colors uppercase"
                        >
                          [ &gt; ]
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedIssue && (
        <IssueDetailsModal 
          issue={selectedIssue}
          epics={epics}
          allIssues={issues}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
