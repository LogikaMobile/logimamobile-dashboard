"use client";

import { useState, useEffect } from 'react';
import { DeveloperWithFinancials, Project, LmaasLead } from '@/types';
import { deleteAssignment } from '@/lib/api';

interface DeveloperAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  developerData: DeveloperWithFinancials | null;
  onUpdate: () => void;
  selectedMonth: number;
  selectedYear: number;
}

export default function DeveloperAuditModal({ 
  isOpen, onClose, developerData, onUpdate, selectedMonth, selectedYear 
}: DeveloperAuditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !developerData) return null;

  const { developer, usedHours, remuneration, assignments } = developerData;
  const capacityPct = developer.availableHoursPerMonth > 0 
    ? ((usedHours / developer.availableHoursPerMonth) * 100).toFixed(1) 
    : 0;

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Remove assignment?')) return;
    try {
      await deleteAssignment(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-mono">
      <div className="bg-[#111111] border-2 border-white/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">
            AUDIT // {developer.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            [X]
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] p-4 border border-white/10">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Hourly Rate</div>
            <div className="text-lg text-white font-bold">${developer.hourlyRate.toFixed(2)}</div>
          </div>
          <div className="bg-[#1A1A1A] p-4 border border-white/10">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Capacity</div>
            <div className="text-lg text-white font-bold">{usedHours} / {developer.availableHoursPerMonth}h ({capacityPct}%)</div>
          </div>
          <div className="bg-[#1A1A1A] p-4 border border-[#00FF41]/30">
            <div className="text-xs text-[#00FF41] uppercase tracking-wider">Total Due</div>
            <div className="text-lg text-[#00FF41] font-bold">${remuneration.toLocaleString()}</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Current Assignments ({selectedMonth}/{selectedYear})
          </h3>
          {assignments.length === 0 ? (
            <div className="text-gray-500 text-sm py-4 italic">No assignments for this period.</div>
          ) : (
            <div className="space-y-3">
              {assignments.map(a => (
                <div key={a.assignment.id} className="flex items-center justify-between bg-white/5 p-3 border border-white/10 hover:border-white/20 transition-colors">
                  <div>
                    <div className="text-white font-bold">{a.projectName}</div>
                    <div className="text-xs text-gray-400">
                      <span className="bg-white/10 px-1 rounded mr-2">{a.projectType}</span>
                      {a.assignment.allocatedHours} hrs x ${developer.hourlyRate} = ${(a.assignment.allocatedHours * developer.hourlyRate).toFixed(2)}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAssignment(a.assignment.id)}
                    className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider px-2 py-1 border border-red-400/20"
                  >
                    [REMOVE]
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
