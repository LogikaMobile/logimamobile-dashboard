'use client';
import { LmaasLeadWithSubscription } from '@/types';
import { updateLmaasLead, updateLmaasSubscription } from '@/lib/api';
import { useState } from 'react';

export default function RefundWarningModal({
  isOpen,
  onClose,
  leadData,
  targetStatus,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  leadData: LmaasLeadWithSubscription | null;
  targetStatus: string;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !leadData || !targetStatus) return null;

  const handleAction = async (willRefund: boolean) => {
    setIsSubmitting(true);
    try {
      // 1. Update Lead Status to targetStatus
      const updatedLead = { ...leadData.lead, status: targetStatus };
      await updateLmaasLead(leadData.lead.id, updatedLead);

      // 2. If refunding, reset generated revenue to 0 (simplification for this MVP)
      if (willRefund) {
        const updatedSubscription = {
          ...leadData.subscription,
          generatedRevenue: 0
        };
        await updateLmaasSubscription(leadData.subscription.id, updatedSubscription);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update lead/refund', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-panel-bg border-2 border-red-500 text-foreground w-full max-w-lg shadow-[0_0_30px_rgba(239,68,68,0.2)] flex flex-col">
        <div className="p-6 border-b border-panel-border bg-black/40">
          <h2 className="text-xl font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
            <span className="text-2xl">⚠️</span> RETROCESO DE FASE
          </h2>
        </div>

        <div className="p-6 space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            Estás intentando mover <strong className="text-white">{leadData.lead.companyName}</strong> de una fase operativa hacia atrás (Fase de ventas).
          </p>
          <div className="p-3 bg-red-950/30 border border-red-500/50 rounded">
            <strong>Precaución:</strong> No se recomienda retroceder leads desde la fase operativa hacia ventas ya que afecta el histórico financiero.
          </div>
          <p className="font-bold text-white pt-2">
            ¿Se hará una devolución de dinero al cliente por este retroceso?
          </p>
        </div>

        <div className="p-6 pt-0 flex flex-col gap-3">
          <button 
            onClick={() => handleAction(true)}
            disabled={isSubmitting}
            className="w-full bg-red-500 text-white py-3 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Sí, hacer devolución (Restar Ingreso)'}
          </button>
          
          <button 
            onClick={() => handleAction(false)}
            disabled={isSubmitting}
            className="w-full bg-transparent border border-gray-600 text-gray-300 py-3 uppercase tracking-widest text-sm font-bold hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'No, el dinero se queda en las cuentas'}
          </button>
          
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full bg-transparent text-gray-500 py-2 uppercase tracking-widest text-xs hover:text-white transition-colors mt-2"
          >
            Cancelar acción
          </button>
        </div>
      </div>
    </div>
  );
}
