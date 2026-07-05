'use client';
import { LmaasLeadWithSubscription } from '@/types';

export default function WorkflowWarningModal({
  isOpen,
  onClose,
  leadData,
}: {
  isOpen: boolean;
  onClose: () => void;
  leadData: LmaasLeadWithSubscription | null;
}) {
  if (!isOpen || !leadData) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-panel-bg border-2 border-red-500 text-foreground w-full max-w-md shadow-[0_0_30px_rgba(239,68,68,0.2)] flex flex-col">
        <div className="p-6 border-b border-panel-border bg-black/40">
          <h2 className="text-xl font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
            <span className="text-2xl">⚠️</span> FLUJO INVÁLIDO
          </h2>
        </div>

        <div className="p-6 space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            Estás intentando mover <strong className="text-white">{leadData.lead.companyName}</strong> a una fase operativa sin haber pasado por la <strong>Firma de SLA y Cobro (Fase 2)</strong>.
          </p>
          <p>
            Por favor, mueve esta oportunidad primero a la Fase 2 para registrar el tipo de pago y actualizar los ingresos. Desde ahí, podrás moverla libremente a otras fases operativas.
          </p>
        </div>

        <div className="p-6 pt-0">
          <button 
            onClick={onClose}
            className="w-full bg-red-500 text-white py-3 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-red-500 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
