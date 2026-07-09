"use client";

import { useState, useEffect } from 'react';
import { DeveloperWithFinancials } from '@/types';
import { fetchDevelopers } from '@/lib/api';
import Link from 'next/link';
import DeveloperGrid from '@/components/engineering/DeveloperGrid';
import DeveloperModal from '@/components/engineering/DeveloperModal';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function EngineeringDashboard() {
  const [data, setData] = useState<DeveloperWithFinancials[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const devs = await fetchDevelopers(selectedMonth, selectedYear);
      setData(devs);
    } catch (error) {
      console.error("Failed to load developers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const activeDevs = data.filter(d => d.developer.isActive).length;
  const totalProjectedRemuneration = data.reduce((sum, d) => sum + d.remuneration, 0);
  
  const totalUsedHours = data.reduce((sum, d) => sum + d.usedHours, 0);
  const totalAvailableHours = data.reduce((sum, d) => sum + d.developer.availableHoursPerMonth, 0);
  const globalCapacityPct = totalAvailableHours > 0 
    ? ((totalUsedHours / totalAvailableHours) * 100).toFixed(1) 
    : 0;

  // Generate an array of years from current year down to 2024
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => currentYear - i);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase font-mono">
            ENG // HR_DASHBOARD
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Link 
              href="/apps/projects/dashboard"
              className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[#111111] border border-white/20 text-white hover:bg-white hover:text-black transition-colors font-mono"
            >
              &lt; REGRESAR
            </Link>
            <p className="text-gray-400 font-mono text-sm">
              Manage developer resources, capacities, and project assignments.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-[#111111] border border-white/20 p-1">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-white font-mono uppercase text-sm p-2 outline-none cursor-pointer"
            >
              {MONTHS.map(m => <option key={m.value} value={m.value} className="bg-[#111]">{m.label}</option>)}
            </select>
            <span className="text-white/50">/</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-white font-mono uppercase text-sm p-2 outline-none cursor-pointer"
            >
              {years.map(y => <option key={y} value={y} className="bg-[#111]">{y}</option>)}
            </select>
          </div>

          <button 
            onClick={() => setIsNewModalOpen(true)}
            className="px-6 py-3 bg-white text-black font-bold font-mono hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.2)] uppercase tracking-widest text-sm"
          >
            + NEW_DEVELOPER
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-mono">
        <div className="bg-[#111111] border border-white/10 p-6 flex flex-col justify-between">
          <div className="text-gray-400 uppercase tracking-widest text-xs mb-2">/ NÓMINA_PROYECTADA_MES</div>
          <div className="text-3xl font-bold text-white">
            ${totalProjectedRemuneration.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 p-6 flex flex-col justify-between">
          <div className="text-gray-400 uppercase tracking-widest text-xs mb-2">/ CAPACIDAD_GLOBAL</div>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold text-white">{globalCapacityPct}%</div>
            <div className="text-sm text-gray-500 mb-1">({totalUsedHours}/{totalAvailableHours} hrs)</div>
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 p-6 flex flex-col justify-between">
          <div className="text-gray-400 uppercase tracking-widest text-xs mb-2">/ INGENIEROS_ACTIVOS</div>
          <div className="text-3xl font-bold text-[#00FF41]">
            {activeDevs}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="text-white font-mono animate-pulse">LOADING_DATA...</div>
        </div>
      ) : (
        <DeveloperGrid 
          data={data} 
          onRefresh={loadData} 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}

      {isNewModalOpen && (
        <DeveloperModal 
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onSaved={loadData}
        />
      )}
    </div>
  );
}
