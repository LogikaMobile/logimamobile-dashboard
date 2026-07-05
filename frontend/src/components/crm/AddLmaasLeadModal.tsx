'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { createLmaasLead } from '@/lib/api';

export default function AddLmaasLeadModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      companyName: formData.get('companyName'),
      contactName: formData.get('contactName'),
      emails: (formData.get('contactEmails') as string)?.split(',').map(e => e.trim()).filter(e => e) || [],
      status: formData.get('status'),
      tier: formData.get('tier'),
      billingCycle: formData.get('billingCycle'),
      monthlyFee: Number(formData.get('monthlyFee')),
      annualizedValue: Number(formData.get('annualizedValue')),
      operatingCosts: Number(formData.get('operatingCosts'))
    };

    try {
      await createLmaasLead(data);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar LMaaS Lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-panel-bg border border-brand-orange w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(249,115,22,0.15)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-brand-orange mb-6 tracking-widest uppercase">/ NUEVO_LEAD_LMAAS</h2>
          
          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded border border-red-500/50 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest block">Compañía</label>
                <input required name="companyName" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest block">Contacto</label>
                <input required name="contactName" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest block">Email(s) (separados por coma)</label>
                <input required type="text" name="contactEmails" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest block">Estado Inicial</label>
                <select name="status" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors appearance-none cursor-pointer">
                  <option value="STEP_0">0. Prospección / Outbound</option>
                  <option value="STEP_1">1. Triage</option>
                  <option value="STEP_2">2. Firma SLA y Cobro</option>
                </select>
              </div>
            </div>

            <div className="border-t border-panel-border pt-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 tracking-widest uppercase">/ DATOS_SUSCRIPCIÓN</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-brand-orange uppercase tracking-widest block">Tier</label>
                  <select name="tier" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option value="TIER_1">Tier 1 (Básico)</option>
                    <option value="TIER_2">Tier 2 (Pro)</option>
                    <option value="TIER_3">Tier 3 (Enterprise)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-brand-orange uppercase tracking-widest block">Ciclo de Facturación</label>
                  <select name="billingCycle" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option value="MONTHLY">Mensual</option>
                    <option value="ANNUAL">Anual</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-brand-orange uppercase tracking-widest block">Fee Mensual (USD)</label>
                  <input required type="number" step="0.01" name="monthlyFee" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors font-mono" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-brand-orange uppercase tracking-widest block">Valor Anualizado (USD)</label>
                  <input required type="number" step="0.01" name="annualizedValue" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors font-mono" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-brand-orange uppercase tracking-widest block">Costos Operativos LMaaS (Infra Add-on)</label>
                  <input required type="number" step="0.01" name="operatingCosts" defaultValue={0} className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors font-mono" />
                  <p className="text-xs text-gray-500 mt-1">Costos directos de servidor u otros asociados a esta suscripción en específico.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-brand-orange text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'GUARDANDO...' : 'GUARDAR_LEAD'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
