'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import KpiHeader from '@/components/crm/KpiHeader';
import FinancialDashboard from '@/components/crm/FinancialDashboard';
import KanbanPipeline from '@/components/crm/KanbanPipeline';
import LmaasKanbanPipeline from '@/components/crm/LmaasKanbanPipeline';
import FollowUpList from '@/components/crm/FollowUpList';
import AddLeadModal from '@/components/crm/AddLeadModal';
import EditProjectModal from '@/components/crm/EditProjectModal';
import AddLmaasLeadModal from '@/components/crm/AddLmaasLeadModal';
import AddLmaasTicketModal from '@/components/crm/AddLmaasTicketModal';
import SlaPaymentModal from '@/components/crm/SlaPaymentModal';
import WorkflowWarningModal from '@/components/crm/WorkflowWarningModal';
import RefundWarningModal from '@/components/crm/RefundWarningModal';
import { fetchProjects, fetchConstantExpenses, fetchLmaasLeads, fetchLmaasTickets } from '@/lib/api';
import Logo from '../../public/Logo.svg';
import { LmaasLeadWithSubscription } from '@/types';

export default function Home() {
  const [isLmaasMode, setIsLmaasMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const [isLmaasLeadModalOpen, setIsLmaasLeadModalOpen] = useState(false);
  const [isLmaasTicketModalOpen, setIsLmaasTicketModalOpen] = useState(false);

  const [slaPaymentLead, setSlaPaymentLead] = useState<LmaasLeadWithSubscription | null>(null);
  const [workflowWarningLead, setWorkflowWarningLead] = useState<LmaasLeadWithSubscription | null>(null);
  const [refundWarningLead, setRefundWarningLead] = useState<{lead: LmaasLeadWithSubscription, targetStatus: string} | null>(null);

  const { data: projects, error, mutate } = useSWR('projects', fetchProjects, {
    fallbackData: [],
    revalidateOnFocus: false
  });
  
  const { data: constantExpenses, error: expError, mutate: mutateExpenses } = useSWR('expenses', fetchConstantExpenses, {
    fallbackData: [],
    revalidateOnFocus: false
  });

  const { data: lmaasLeads, error: lmaasLeadsError, mutate: mutateLmaasLeads } = useSWR('lmaasLeads', fetchLmaasLeads, {
    fallbackData: [],
    revalidateOnFocus: false
  });

  const { data: lmaasTickets, error: lmaasTicketsError, mutate: mutateLmaasTickets } = useSWR('lmaasTickets', fetchLmaasTickets, {
    fallbackData: [],
    revalidateOnFocus: false
  });

  const isLoading = (!projects && !error) || (!constantExpenses && !expError) || (!lmaasLeads && !lmaasLeadsError) || (!lmaasTickets && !lmaasTicketsError);

  return (
    <main className="min-h-screen bg-background p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-center border-b border-panel-border pb-6">
          <div>
            <div className="flex items-center gap-5">
              <Image src={Logo} alt="LogikaMobile Logo" width={120} height={120} />
              <h1 className="text-6xl font-bold tracking-widest">
                <span className="text-brand-purple">Logika</span><span className="text-brand-orange">Mobile</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-brand-primary text-sm uppercase tracking-widest">/ CRM_OPERACIONES_</p>
              
              <div className="flex items-center bg-black/50 p-1 border border-panel-border rounded">
                <button
                  onClick={() => setIsLmaasMode(false)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-widest transition-colors ${!isLmaasMode ? 'bg-brand-primary text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  TRADICIONAL
                </button>
                <button
                  onClick={() => setIsLmaasMode(true)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-widest transition-colors ${isLmaasMode ? 'bg-brand-orange text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  LMAAS
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {isLmaasMode ? (
              <>
                <button 
                  onClick={() => setIsLmaasTicketModalOpen(true)}
                  className="border border-brand-orange text-brand-orange px-6 py-2 rounded hover:bg-brand-orange hover:text-black transition-all font-bold tracking-wider text-sm uppercase shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                >
                  + TICKET_LMAAS
                </button>
                <button 
                  onClick={() => setIsLmaasLeadModalOpen(true)}
                  className="border border-brand-orange text-brand-orange px-6 py-2 rounded hover:bg-brand-orange hover:text-black transition-all font-bold tracking-wider text-sm uppercase shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                >
                  + LEAD_LMAAS
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="border border-brand-primary text-brand-primary px-6 py-2 rounded hover:bg-brand-primary hover:text-white transition-all font-bold tracking-wider text-sm uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              >
                + NUEVO_LEAD
              </button>
            )}
          </div>
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
            <KpiHeader 
              projects={projects || []} 
              lmaasLeads={lmaasLeads || []}
              isLmaasMode={isLmaasMode} 
            />
            <FinancialDashboard 
              projects={projects || []} 
              constantExpenses={constantExpenses || []}
              lmaasLeads={lmaasLeads || []}
              onExpensesChanged={() => mutateExpenses()} 
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                {isLmaasMode ? (
                  <LmaasKanbanPipeline 
                    tickets={lmaasTickets || []} 
                    leads={lmaasLeads || []} 
                    onRequireSlaPayment={(lead) => setSlaPaymentLead(lead)}
                    onInvalidWorkflowSkip={(lead) => setWorkflowWarningLead(lead)}
                    onRequireRefundCheck={(lead, targetStatus) => setRefundWarningLead({ lead, targetStatus })}
                  />
                ) : (
                  <KanbanPipeline projects={projects || []} />
                )}
              </div>
              <div className="xl:col-span-1">
                {!isLmaasMode && (
                  <FollowUpList 
                    projects={projects || []} 
                    onEditProject={(p) => {
                      setSelectedProject(p);
                      setIsEditModalOpen(true);
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}

        <AddLeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => mutate()} 
        />
        <EditProjectModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }} 
          onSuccess={() => mutate()} 
          project={selectedProject} 
        />
        <AddLmaasLeadModal 
          isOpen={isLmaasLeadModalOpen} 
          onClose={() => setIsLmaasLeadModalOpen(false)} 
          onSuccess={() => mutateLmaasLeads()} 
        />
        <AddLmaasTicketModal 
          isOpen={isLmaasTicketModalOpen} 
          onClose={() => setIsLmaasTicketModalOpen(false)} 
          onSuccess={() => mutateLmaasTickets()} 
          leads={lmaasLeads || []}
        />
        
        <SlaPaymentModal
          isOpen={!!slaPaymentLead}
          onClose={() => setSlaPaymentLead(null)}
          leadData={slaPaymentLead}
          onSuccess={() => mutateLmaasLeads()}
        />
        
        <WorkflowWarningModal
          isOpen={!!workflowWarningLead}
          onClose={() => setWorkflowWarningLead(null)}
          leadData={workflowWarningLead}
        />
        
        <RefundWarningModal
          isOpen={!!refundWarningLead}
          onClose={() => setRefundWarningLead(null)}
          leadData={refundWarningLead?.lead || null}
          targetStatus={refundWarningLead?.targetStatus || ''}
          onSuccess={() => mutateLmaasLeads()}
        />
      </div>
    </main>
  );
}
