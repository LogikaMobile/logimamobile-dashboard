'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import KpiHeader from '@/components/crm/KpiHeader';
import FinancialDashboard from '@/components/crm/FinancialDashboard';
import KanbanPipeline from '@/components/crm/KanbanPipeline';
import FollowUpList from '@/components/crm/FollowUpList';
import AddLeadModal from '@/components/crm/AddLeadModal';
import { fetchProjects, fetchConstantExpenses } from '@/lib/api';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: projects, error, mutate } = useSWR('projects', fetchProjects, {
    fallbackData: [],
    revalidateOnFocus: false
  });
  
  const { data: constantExpenses, error: expError, mutate: mutateExpenses } = useSWR('expenses', fetchConstantExpenses, {
    fallbackData: [],
    revalidateOnFocus: false
  });

  const isLoading = (!projects && !error) || (!constantExpenses && !expError);

  return (
    <main className="min-h-screen bg-background p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-center border-b border-panel-border pb-6">
          <div>
            <div className="flex items-center gap-5">
              <Image src="/Logo.svg" alt="LogikaMobile Logo" width={120} height={120} />
              <h1 className="text-6xl font-bold tracking-widest">
                <span className="text-brand-purple">Logika</span><span className="text-brand-orange">Mobile</span>
              </h1>
            </div>
            <p className="text-brand-primary mt-2 text-sm uppercase tracking-widest">/ CRM_OPERACIONES_</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="border border-brand-primary text-brand-primary px-6 py-2 rounded hover:bg-brand-primary hover:text-white transition-all font-bold tracking-wider text-sm uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
          >
            + NUEVO_LEAD
          </button>
        </header>

        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded border border-red-500/50 mb-8 font-mono">
            Error al cargar proyectos: {error.message}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <>
            <KpiHeader projects={projects || []} />
            <FinancialDashboard 
              projects={projects || []} 
              constantExpenses={constantExpenses || []} 
              onExpensesChanged={() => mutateExpenses()} 
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                <KanbanPipeline projects={projects || []} />
              </div>
              <div className="xl:col-span-1">
                <FollowUpList projects={projects || []} />
              </div>
            </div>
          </>
        )}

        <AddLeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => mutate()} 
        />
      </div>
    </main>
  );
}
