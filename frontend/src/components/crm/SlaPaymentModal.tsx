'use client';
import { LmaasLeadWithSubscription } from '@/types';
import { updateLmaasLead, updateLmaasSubscription } from '@/lib/api';
import { useState } from 'react';

export default function SlaPaymentModal({
  isOpen,
  onClose,
  leadData,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  leadData: LmaasLeadWithSubscription | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !leadData) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const paymentType = formData.get('paymentType') as string;
    const extraCosts = parseFloat(formData.get('operatingCosts') as string) || 0;

    try {
      // 1. Update Lead Status to STEP_2
      const updatedLead = { ...leadData.lead, status: 'STEP_2' };
      await updateLmaasLead(leadData.lead.id, updatedLead);

      // 2. Calculate new revenue based on payment type
      const currentRevenue = parseFloat(leadData.subscription.generatedRevenue.toString()) || 0;
      let revenueToAdd = 0;
      if (paymentType === 'MONTHLY') {
        revenueToAdd = parseFloat(leadData.subscription.monthlyFee.toString()) || 0;
      } else if (paymentType === 'ANNUAL') {
        revenueToAdd = parseFloat(leadData.subscription.annualizedValue.toString()) || 0;
      }

      const currentCosts = parseFloat(leadData.subscription.operatingCosts.toString()) || 0;

      // 3. Update Subscription
      const updatedSubscription = {
        ...leadData.subscription,
        generatedRevenue: currentRevenue + revenueToAdd,
        operatingCosts: currentCosts + extraCosts
      };
      
      await updateLmaasSubscription(leadData.subscription.id, updatedSubscription);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update SLA payment', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-panel-bg border-2 border-brand-orange text-foreground w-full max-w-lg shadow-[0_0_30px_rgba(249,115,22,0.2)] flex flex-col">
        <div className="p-6 border-b border-panel-border bg-black/40">
          <h2 className="text-xl font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
            <span className="text-2xl">⚡</span> FIRMA SLA Y COBRO
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Confirmación de inicio de operaciones para {leadData.lead.companyName}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-brand-orange uppercase tracking-widest block mb-2">Tipo de Pago Realizado</label>
              <select 
                name="paymentType" 
                defaultValue={leadData.subscription.billingCycle}
                className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="MONTHLY">Mensual ({Number(leadData.subscription.monthlyFee).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})</option>
                <option value="ANNUAL">Anual ({Number(leadData.subscription.annualizedValue).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-brand-orange uppercase tracking-widest block mb-2">Costos Operativos Directos (Opcional)</label>
              <p className="text-[10px] text-gray-500 mb-2">Ingresa cualquier costo de infraestructura u operación inicial para sumarlo.</p>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  name="operatingCosts" 
                  defaultValue={0}
                  className="w-full bg-black/50 border border-panel-border p-3 pl-8 text-white focus:border-brand-orange focus:outline-none transition-colors" 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-panel-border">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-panel-border text-gray-400 py-3 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-orange text-black py-3 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
