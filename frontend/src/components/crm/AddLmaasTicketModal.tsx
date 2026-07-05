'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { createLmaasTicket } from '@/lib/api';
import { LmaasLeadWithSubscription } from '@/types';

export default function AddLmaasTicketModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  leads
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
  leads: LmaasLeadWithSubscription[];
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
      subscriptionId: formData.get('subscriptionId'),
      title: formData.get('title'),
      status: formData.get('status'),
      estimatedHours: Number(formData.get('estimatedHours'))
    };

    try {
      await createLmaasTicket(data);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar Ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-panel-bg border border-brand-orange w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(249,115,22,0.15)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-brand-orange mb-6 tracking-widest uppercase">/ NUEVO_TICKET</h2>
          
          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded border border-red-500/50 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-brand-orange uppercase tracking-widest block">Lead Asociado</label>
              <select required name="subscriptionId" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors appearance-none cursor-pointer">
                <option value="">Selecciona un lead...</option>
                {leads.map(l => (
                  <option key={l.subscription.id} value={l.subscription.id}>
                    {l.lead.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-brand-orange uppercase tracking-widest block">Título del Ticket</label>
              <input required name="title" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest block">Horas Estimadas</label>
                <input required type="number" name="estimatedHours" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors font-mono" />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest block">Estado</label>
                <select name="status" className="w-full bg-black/50 border border-panel-border p-3 text-white focus:border-brand-orange focus:outline-none transition-colors appearance-none cursor-pointer">
                  <option value="BACKLOG">Backlog</option>
                  <option value="DEVELOPMENT">Development</option>
                  <option value="QA">QA / Testing</option>
                  <option value="COOLDOWN">Cooldown</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-brand-orange text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'GUARDANDO...' : 'GUARDAR_TICKET'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
