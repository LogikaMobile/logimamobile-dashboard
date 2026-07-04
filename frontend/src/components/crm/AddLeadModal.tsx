import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreateProjectDto } from '@/types';
import { createProject } from '@/lib/api';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLeadModal({ isOpen, onClose, onSuccess }: AddLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const now = new Date().toISOString();

      const quotedPrice = Number(formData.get('quotedPrice')) || 0;
      const counterOfferPrice = Number(formData.get('counterOfferPrice')) || 0;
      
      const newLead: CreateProjectDto = {
        companyName: formData.get('companyName') as string,
        companySize: formData.get('companySize') as string,
        industry: formData.get('industry') as string,
        contactName: formData.get('contactName') as string,
        contactEmail: formData.get('contactEmail') as string || undefined,
        contactChannel: formData.get('contactChannel') as string,
        status: formData.get('status') as string,
        firstContactDate: now,
        lastContactDate: now,
        quotedPrice,
        counterOfferPrice,
        finalPrice: quotedPrice - counterOfferPrice, // keep finalPrice for reference
        projectedRevenue: quotedPrice - counterOfferPrice,
        operationalCosts: Number(formData.get('operationalCosts')) || 0,
        generatedRevenue: Number(formData.get('generatedRevenue')) || 0,
        
        projectType: formData.get('projectType') as any || undefined,
      recurringRevenue: Number(formData.get('recurringRevenue')) || undefined,
      recurringFrequency: formData.get('recurringFrequency') as any || undefined,

      projectNotes: formData.get('projectNotes') as string,
    };

    try {
      await createProject(newLead);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear el lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono">
      <div className="bg-panel-bg rounded-lg border border-brand-primary/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center p-6 border-b border-panel-border sticky top-0 bg-panel-bg/95 backdrop-blur z-10">
          <h2 className="text-2xl font-bold tracking-widest uppercase"><span className="text-brand-purple">NUEVO_</span><span className="text-brand-orange">PROSPECTO</span></h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-black/50 text-brand-primary rounded transition-colors border border-transparent hover:border-brand-primary">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded border border-red-500/50 uppercase tracking-widest text-sm">
              [ERROR]: {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sección Empresa */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-primary border-b border-panel-border pb-2 uppercase tracking-widest">/ DATOS_EMPRESA</h3>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Nombre de la Empresa *</label>
                <input required name="companyName" type="text" className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-gray-600" placeholder="Ej. ACME Corp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Tamaño</label>
                  <select name="companySize" className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all appearance-none">
                    <option value="" className="bg-panel-bg">Seleccionar...</option>
                    <option value="Startup" className="bg-panel-bg">Startup</option>
                    <option value="PYME" className="bg-panel-bg">PYME</option>
                    <option value="Corporativo" className="bg-panel-bg">Corporativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Sector</label>
                  <input name="industry" type="text" className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-gray-600" placeholder="Ej. Tecnología" />
                </div>
              </div>
            </div>

            {/* Sección Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-primary border-b border-panel-border pb-2 uppercase tracking-widest">/ DATOS_CONTACTO</h3>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Nombre del Contacto *</label>
                <input required name="contactName" type="text" className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-gray-600" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Correos (separados por coma)</label>
                <input name="contactEmail" type="text" className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-gray-600" placeholder="Ej. juan@empresa.com, maria@empresa.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Canal *</label>
                  <select required name="contactChannel" className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all appearance-none">
                    <option value="WhatsApp" className="bg-panel-bg">WhatsApp</option>
                    <option value="Email" className="bg-panel-bg">Email</option>
                    <option value="LinkedIn" className="bg-panel-bg">LinkedIn</option>
                    <option value="Teléfono" className="bg-panel-bg">Teléfono</option>
                    <option value="Referencia" className="bg-panel-bg">Referencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Estado</label>
                  <select required name="status" className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all appearance-none">
                    <option value="STEP_0" className="bg-panel-bg">0. Prospección (Outbound)</option>
                    <option value="STEP_1" className="bg-panel-bg">1. Requerimientos</option>
                    <option value="STEP_2" className="bg-panel-bg">2. Mapeo As-Is/To-Be</option>
                    <option value="STEP_3" className="bg-panel-bg">3. Propuesta Tec/Eco</option>
                    <option value="STEP_4" className="bg-panel-bg">4. Reglas de Negocio</option>
                    <option value="STEP_5" className="bg-panel-bg">5. Modelado y POC</option>
                    <option value="STEP_6" className="bg-panel-bg">6. Codificación</option>
                    <option value="STEP_7" className="bg-panel-bg">7. Pruebas y QA</option>
                    <option value="STEP_8" className="bg-panel-bg">8. Staging (Demo)</option>
                    <option value="STEP_9" className="bg-panel-bg">9. UAT</option>
                    <option value="STEP_10" className="bg-panel-bg">10. Producción</option>
                    <option value="DELIVERED" className="bg-panel-bg">Proyecto Entregado</option>
                    <option value="LOST" className="bg-panel-bg">Cerrado Perdido</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección Financiera */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-brand-purple border-b border-panel-border pb-2 uppercase tracking-widest">/ PROYECCIÓN_FINANCIERA</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-brand-purple mb-2 uppercase tracking-widest">Tipo de Proyecto</label>
                  <select name="projectType" value={projectType} onChange={e => setProjectType(e.target.value)} className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all appearance-none">
                    <option value="" className="bg-panel-bg">Por Definir</option>
                    <option value="ONE_TIME" className="bg-panel-bg">Venta Única de Código</option>
                    <option value="SAAS" className="bg-panel-bg">Software as a Service (SaaS)</option>
                  </select>
                </div>
                {projectType === 'SAAS' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-brand-purple mb-2 uppercase tracking-widest">Costo Licencia SaaS</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-brand-purple/50">$</span>
                        <input name="recurringRevenue" type="number" step="0.01" className="w-full p-3 pl-8 bg-black/50 border border-panel-border rounded text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-700" placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-purple mb-2 uppercase tracking-widest">Frecuencia Licencia</label>
                      <select name="recurringFrequency" className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all appearance-none">
                        <option value="MONTHLY" className="bg-panel-bg">Mensual</option>
                        <option value="ANNUAL" className="bg-panel-bg">Anual</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-purple mb-2 uppercase tracking-widest">Cotizado</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-brand-purple/50">$</span>
                    <input name="quotedPrice" type="number" step="0.01" className="w-full p-3 pl-8 bg-black/50 border border-panel-border rounded text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-700" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-purple mb-2 uppercase tracking-widest">Contraoferta (Descuento)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-brand-purple/50">$</span>
                    <input name="counterOfferPrice" type="number" step="0.01" className="w-full p-3 pl-8 bg-black/50 border border-panel-border rounded text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-700" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-purple mb-2 uppercase tracking-widest">Ingresos Generados</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-brand-purple/50">$</span>
                    <input name="generatedRevenue" type="number" step="0.01" className="w-full p-3 pl-8 bg-black/50 border border-panel-border rounded text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-700" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-red-500 mb-2 uppercase tracking-widest">Costos Operativos</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-red-500/50">$</span>
                    <input name="operationalCosts" type="number" step="0.01" className="w-full p-3 pl-8 bg-black/50 border border-panel-border rounded text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder-gray-700" placeholder="0.00" />
                  </div>
                </div>

              </div>
            </div>

            {/* Sección Notas */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-brand-orange border-b border-panel-border pb-2 uppercase tracking-widest">/ NOTAS_INICIALES</h3>
              <div>
                <textarea name="projectNotes" rows={4} className="w-full p-4 bg-black/50 border border-panel-border rounded text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none resize-none transition-all placeholder-gray-600" placeholder=">_ Ingresar requerimientos..."></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-panel-border sticky bottom-0 bg-panel-bg/95 backdrop-blur pb-2">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-panel-border rounded text-gray-400 hover:text-white hover:bg-black transition-colors font-bold tracking-widest uppercase text-sm">
              [ CANCELAR ]
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 border border-brand-primary bg-brand-primary/10 text-brand-primary rounded hover:bg-brand-primary hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 font-bold tracking-widest uppercase text-sm">
              {isSubmitting ? 'PROCESANDO...' : '> CREAR_LEAD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
