'use client';
import { LmaasLeadWithSubscription, LmaasTicket } from '@/types';
import LmaasTicketKanban from './LmaasTicketKanban';
import { updateLmaasLead } from '@/lib/api';
import { useState } from 'react';

export default function LmaasLeadDetailModal({ 
  isOpen, 
  onClose, 
  leadData,
  tickets,
  onRequireSlaPayment,
  onInvalidWorkflowSkip,
  onRequireRefundCheck,
  onSuccess
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  leadData: LmaasLeadWithSubscription | null;
  tickets: LmaasTicket[];
  onRequireSlaPayment?: (lead: LmaasLeadWithSubscription) => void;
  onInvalidWorkflowSkip?: (lead: LmaasLeadWithSubscription) => void;
  onRequireRefundCheck?: (lead: LmaasLeadWithSubscription, targetStatus: string) => void;
  onSuccess: () => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !leadData) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    const fromIndex = parseInt(leadData.lead.status.replace('STEP_', ''));
    const toIndex = parseInt(newStatus.replace('STEP_', ''));

    if (fromIndex < 2 && toIndex === 2) {
      onRequireSlaPayment?.(leadData);
      return;
    }

    if (fromIndex < 2 && toIndex > 2) {
      onInvalidWorkflowSkip?.(leadData);
      // Reset the select value back to the original status visually
      e.target.value = leadData.lead.status;
      return;
    }

    if (fromIndex >= 2 && toIndex < 2) {
      onRequireRefundCheck?.(leadData, newStatus);
      e.target.value = leadData.lead.status;
      return;
    }

    setIsUpdating(true);
    try {
      const updatedLead = { ...leadData.lead, status: newStatus };
      await updateLmaasLead(leadData.lead.id, updatedLead);
      onSuccess();
    } catch (error) {
      console.error('Failed to update lead status', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-panel-bg border border-panel-border text-foreground w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl font-mono overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-panel-border flex justify-between items-center bg-black/40">
          <div>
            <h2 className="text-2xl font-bold text-brand-orange uppercase tracking-widest">{leadData.lead.companyName}</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-gray-400">
                {leadData.lead.contactName} • {leadData.lead.emails.join(', ')}
              </p>
              <a 
                href={`https://calendar.google.com/calendar/r/eventedit?text=LMaaS+Kickoff:+${encodeURIComponent(leadData.lead.companyName)}&add=${encodeURIComponent(leadData.lead.emails.join(','))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-brand-primary text-black px-2 py-1 font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-sm"
              >
                + Agendar Meet
              </a>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Details */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-black/40 p-4 rounded border border-panel-border">
              <h3 className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">/ DETALLES DE SUSCRIPCIÓN</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Estado (Fase)</label>
                  <select 
                    value={leadData.lead.status}
                    onChange={handleStatusChange}
                    disabled={isUpdating}
                    className="w-full bg-black border border-panel-border p-2 text-white font-mono text-sm focus:border-brand-orange focus:outline-none"
                  >
                    <option value="STEP_0">0. Prospección / Outbound</option>
                    <option value="STEP_1">1. Triage</option>
                    <option value="STEP_2">2. Firma SLA y Cobro</option>
                    <option value="STEP_3">3. Kickoff</option>
                    <option value="STEP_4">4. Setup Inicial</option>
                    <option value="STEP_5">5. Operación Regular</option>
                    <option value="STEP_6">6. Escalado</option>
                    <option value="STEP_7">7. Renovación</option>
                    <option value="STEP_8">8. Offboarding</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Tier</p>
                    <p className="text-white font-bold">{leadData.subscription.tier.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Ciclo</p>
                    <p className="text-white font-bold">{leadData.subscription.billingCycle}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-panel-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Fee Mensual</p>
                    <p className="text-brand-orange font-bold">{formatCurrency(Number(leadData.subscription.monthlyFee))}</p>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Valor Anualizado</p>
                    <p className="text-brand-orange font-bold">{formatCurrency(Number(leadData.subscription.annualizedValue))}</p>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Revenue Generado</p>
                    <p className="text-brand-primary font-bold">{formatCurrency(Number(leadData.subscription.generatedRevenue))}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-panel-border/50">
                    <p className="text-xs text-red-400 uppercase tracking-widest">Costos (Infra)</p>
                    <p className="text-red-400 font-bold">{formatCurrency(Number(leadData.subscription.operatingCosts))}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Kanban */}
          <div className="w-full lg:w-2/3">
            <h3 className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">/ TABLERO OPERATIVO DE TICKETS</h3>
            <p className="text-xs text-gray-400 mb-6 max-w-lg">
              Los tickets muestran el trabajo iterativo en curso para esta suscripción específica. Puedes arrastrarlos entre columnas.
            </p>
            
            <LmaasTicketKanban 
              tickets={tickets} 
              subscriptionId={leadData.subscription.id} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}
