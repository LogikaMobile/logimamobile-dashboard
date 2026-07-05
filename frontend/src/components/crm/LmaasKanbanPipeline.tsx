'use client';
import { LmaasLeadWithSubscription, LmaasTicket } from '@/types';
import { updateLmaasLead } from '@/lib/api';
import { mutate } from 'swr';
import { useState } from 'react';
import LmaasLeadDetailModal from './LmaasLeadDetailModal';

const COLUMNS = [
  { id: 'STEP_0', title: '0. Prospección' },
  { id: 'STEP_1', title: '1. Triage' },
  { id: 'STEP_2', title: '2. Firma SLA y Cobro' },
  { id: 'STEP_3', title: '3. Kickoff' },
  { id: 'STEP_4', title: '4. Setup Inicial' },
  { id: 'STEP_5', title: '5. Operación Regular' },
  { id: 'STEP_6', title: '6. Escalado' },
  { id: 'STEP_7', title: '7. Renovación' },
  { id: 'STEP_8', title: '8. Offboarding' }
];

export default function LmaasKanbanPipeline({ 
  tickets, 
  leads,
  onRequireSlaPayment,
  onInvalidWorkflowSkip,
  onRequireRefundCheck
}: { 
  tickets: LmaasTicket[];
  leads: LmaasLeadWithSubscription[];
  onRequireSlaPayment?: (lead: LmaasLeadWithSubscription) => void;
  onInvalidWorkflowSkip?: (lead: LmaasLeadWithSubscription) => void;
  onRequireRefundCheck?: (lead: LmaasLeadWithSubscription, targetStatus: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LmaasLeadWithSubscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, lead: LmaasLeadWithSubscription) => {
    e.dataTransfer.setData('lmaasLead', JSON.stringify(lead));
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setIsDragging(false);
    
    try {
      const leadData = e.dataTransfer.getData('lmaasLead');
      if (!leadData) return;
      
      const leadItem: LmaasLeadWithSubscription = JSON.parse(leadData);
      if (leadItem.lead.status === newStatus) return;
      
      const fromIndex = parseInt(leadItem.lead.status.replace('STEP_', ''));
      const toIndex = parseInt(newStatus.replace('STEP_', ''));

      if (fromIndex < 2 && toIndex === 2) {
        onRequireSlaPayment?.(leadItem);
        return;
      }

      if (fromIndex < 2 && toIndex > 2) {
        onInvalidWorkflowSkip?.(leadItem);
        return;
      }

      if (fromIndex >= 2 && toIndex < 2) {
        onRequireRefundCheck?.(leadItem, newStatus);
        return;
      }
      
      // Optimistic update
      const updatedLeads = leads.map(l => 
        l.lead.id === leadItem.lead.id ? { ...l, lead: { ...l.lead, status: newStatus } } : l
      );
      mutate('lmaasLeads', updatedLeads, false);
      
      // API call
      const updatedLeadData = { ...leadItem.lead, status: newStatus };
      await updateLmaasLead(leadItem.lead.id, updatedLeadData);
      
      mutate('lmaasLeads');
    } catch (error) {
      console.error('Error updating lead status:', error);
      mutate('lmaasLeads');
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-brand-orange mb-4 uppercase tracking-widest">/ LMaaS Pipeline Comercial</h2>
      <div className="flex flex-wrap gap-4 pb-4">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter(l => l.lead.status === col.id);
          
          return (
            <div 
              key={col.id} 
              className={`w-[280px] bg-panel-bg rounded border ${isDragging ? 'border-dashed border-panel-border/50' : 'border-panel-border'} flex flex-col max-h-[70vh] font-mono shadow-lg shrink-0 transition-all`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="flex justify-between items-center mb-3 border-b border-panel-border pb-2 p-4">
                <h3 className="font-bold text-white uppercase tracking-widest text-sm">{col.title}</h3>
                <span className="bg-brand-orange/20 text-brand-orange border border-brand-orange text-xs font-bold px-2 py-1 rounded">
                  {colLeads.length}
                </span>
              </div>
              
              <div className="overflow-y-auto flex-1 space-y-3 p-4 pt-0 min-h-[100px]">
                {colLeads.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4 uppercase tracking-widest">/ VACÍO</p>
                )}
                
                {colLeads.map(item => (
                  <div 
                    key={item.lead.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    onClick={() => { setSelectedLead(item); setIsModalOpen(true); }}
                    className="bg-black/60 p-4 rounded border border-panel-border hover:border-brand-orange hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all cursor-grab active:cursor-grabbing"
                  >
                    <div className="mb-2">
                      {['STEP_0', 'STEP_1'].includes(item.lead.status) ? (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded uppercase tracking-widest">LEAD</span>
                      ) : (
                        <span className="text-[10px] font-bold text-black bg-brand-orange px-2 py-0.5 rounded uppercase tracking-widest">PROYECTO</span>
                      )}
                    </div>
                    <p className="font-bold text-white uppercase">{item.lead.companyName}</p>
                    {item.lead.projectName && (
                      <p className="text-sm font-semibold text-brand-orange mt-1">{item.lead.projectName}</p>
                    )}
                    <p className="text-xs text-gray-400 mb-2 mt-1">{item.lead.contactName}</p>
                    <div className="flex justify-between text-sm mt-3 pt-3 border-t border-panel-border">
                      <span className="text-brand-orange font-bold">
                        {formatCurrency(Number(item.subscription.annualizedValue))}
                      </span>
                      <span className="text-xs text-gray-500 pt-0.5">{item.subscription.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <LmaasLeadDetailModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }} 
        leadData={selectedLead}
        tickets={tickets}
        onRequireSlaPayment={onRequireSlaPayment}
        onInvalidWorkflowSkip={onInvalidWorkflowSkip}
        onRequireRefundCheck={onRequireRefundCheck}
        onSuccess={() => mutate('lmaasLeads')}
      />
    </div>
  );
}
