"use client";

import { DeveloperWithFinancials, Developer } from '@/types';
import { useState } from 'react';
import DeveloperModal from './DeveloperModal';
import DeveloperAuditModal from './DeveloperAuditModal';

interface DeveloperGridProps {
  data: DeveloperWithFinancials[];
  onRefresh: () => void;
  selectedMonth: number;
  selectedYear: number;
}

export default function DeveloperGrid({ data, onRefresh, selectedMonth, selectedYear }: DeveloperGridProps) {
  const [selectedDeveloperToEdit, setSelectedDeveloperToEdit] = useState<Developer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedDeveloperToAudit, setSelectedDeveloperToAudit] = useState<DeveloperWithFinancials | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const openEdit = (dev: Developer) => {
    setSelectedDeveloperToEdit(dev);
    setIsEditModalOpen(true);
  };

  const openAudit = (devWithFin: DeveloperWithFinancials) => {
    setSelectedDeveloperToAudit(devWithFin);
    setIsAuditModalOpen(true);
  };

  return (
    <>
      <div className="w-full overflow-x-auto bg-[#111111] border border-white/10 mt-8">
        <table className="w-full text-left font-mono text-sm border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/20 text-gray-400">
              <th className="p-4 font-normal uppercase tracking-wider">DEV_ID // NAME</th>
              <th className="p-4 font-normal uppercase tracking-wider">ROLE</th>
              <th className="p-4 font-normal uppercase tracking-wider">RATE</th>
              <th className="p-4 font-normal uppercase tracking-wider">CAPACITY</th>
              <th className="p-4 font-normal uppercase tracking-wider">DUE_REMUNERATION</th>
              <th className="p-4 font-normal uppercase tracking-wider text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 italic">No developers found.</td>
              </tr>
            ) : (
              data.map((item) => {
                const { developer, usedHours, remuneration } = item;
                const capacityPct = developer.availableHoursPerMonth > 0 
                  ? (usedHours / developer.availableHoursPerMonth) * 100 
                  : 0;
                
                const isOverCapacity = capacityPct > 100;
                
                return (
                  <tr key={developer.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${!developer.isActive ? 'opacity-50' : ''}`}>
                    <td className="p-4">
                      <div className="font-bold text-white uppercase">{developer.name}</div>
                      <div className="text-xs text-gray-500">
                        {developer.id.substring(0, 8)} {developer.isActive ? '' : ' [INACTIVE]'}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{developer.jobTitle}</td>
                    <td className="p-4 text-gray-300">${developer.hourlyRate}/h</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 overflow-hidden">
                          <div 
                            className={`h-full ${isOverCapacity ? 'bg-red-500' : 'bg-white'}`} 
                            style={{ width: `${Math.min(capacityPct, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs ${isOverCapacity ? 'text-red-400' : 'text-gray-400'}`}>
                          {usedHours}/{developer.availableHoursPerMonth}h
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-[#00FF41] font-bold">
                        ${remuneration.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => openAudit(item)}
                        className="text-xs uppercase tracking-wider px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        [AUDIT]
                      </button>
                      <button 
                        onClick={() => openEdit(developer)}
                        className="text-xs uppercase tracking-wider px-3 py-1.5 border border-white/20 hover:border-white text-gray-300 hover:text-white transition-colors"
                      >
                        [EDIT]
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <DeveloperModal 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDeveloperToEdit(null);
          }}
          onSaved={onRefresh}
          developer={selectedDeveloperToEdit || undefined}
        />
      )}

      {isAuditModalOpen && selectedDeveloperToAudit && (
        <DeveloperAuditModal
          isOpen={isAuditModalOpen}
          onClose={() => {
            setIsAuditModalOpen(false);
            setSelectedDeveloperToAudit(null);
          }}
          developerData={selectedDeveloperToAudit}
          onUpdate={async () => {
            onRefresh();
            // Optional: You could fetch this single developer again to update the audit modal in real-time,
            // but for simplicity, we let onRefresh handle it and the modal might just close or re-render 
            // once data prop updates from parent.
            setIsAuditModalOpen(false);
          }}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
    </>
  );
}
