import React, { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { Project, ConstantExpense, CreateConstantExpenseDto } from '@/types';
import { createConstantExpense, deleteConstantExpense } from '@/lib/api';

interface FinancialBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'REVENUE_GENERATED' | 'REVENUE_PROJECTED' | 'OPERATIONAL_COSTS' | 'CONSTANT_EXPENSES';
  projects?: Project[];
  constantExpenses?: ConstantExpense[];
  onExpensesChanged?: () => void;
  brandColorClass: string;
  currency?: 'USD' | 'MXN';
  exchangeRate?: number;
}

export default function FinancialBreakdownModal({ 
  isOpen, 
  onClose, 
  title, 
  type, 
  projects = [], 
  constantExpenses = [],
  onExpensesChanged,
  brandColorClass,
  currency = 'USD',
  exchangeRate = 20.00
}: FinancialBreakdownModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newFrequency, setNewFrequency] = useState('mensual');
  const [newExpectedEvents, setNewExpectedEvents] = useState('');
  const [newType, setNewType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    const convertedAmount = currency === 'MXN' ? amount * exchangeRate : amount;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currency }).format(convertedAmount);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConcept || !newAmount) return;

    setIsSubmitting(true);
    try {
      const dto: CreateConstantExpenseDto = {
        concept: newConcept,
        amount: Number(newAmount),
        frequency: newFrequency,
        expectedEvents: newFrequency === 'evento' ? Number(newExpectedEvents) : undefined,
        type: newType
      };
      await createConstantExpense(dto);
      setNewConcept('');
      setNewAmount('');
      setNewFrequency('mensual');
      setNewExpectedEvents('');
      if (onExpensesChanged) onExpensesChanged();
    } catch (error) {
      console.error('Failed to add expense', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await deleteConstantExpense(id);
      if (onExpensesChanged) onExpensesChanged();
    } catch (error) {
      console.error('Failed to delete expense', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono">
      <div className={`bg-panel-bg rounded-lg border border-${brandColorClass}/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[90vh] flex flex-col`}>
        <div className="flex justify-between items-center p-6 border-b border-panel-border bg-panel-bg/95 backdrop-blur z-10">
          <h2 className="text-2xl font-bold tracking-widest uppercase">
            <span className={`text-${brandColorClass}`}>DESGLOSE_</span>
            <span className="text-white">{title}</span>
          </h2>
          <button type="button" onClick={onClose} className={`p-2 hover:bg-black/50 text-${brandColorClass} rounded transition-colors border border-transparent hover:border-${brandColorClass}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {type === 'CONSTANT_EXPENSES' ? (
            <div className="space-y-6">
              <div className="bg-black/40 border border-panel-border rounded p-4">
                <h3 className={`text-sm font-bold text-${brandColorClass} mb-4 uppercase tracking-widest border-b border-panel-border pb-2`}>Agregar Nuevo Concepto</h3>
                <form onSubmit={handleAddExpense} className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs text-gray-400 mb-1">Concepto</label>
                    <input 
                      type="text" 
                      value={newConcept}
                      onChange={e => setNewConcept(e.target.value)}
                      className={`w-full p-2 bg-black/50 border border-panel-border rounded text-white focus:border-${brandColorClass} outline-none`}
                      placeholder="Ej. Servidor DigitalOcean"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-400 mb-1">Frecuencia</label>
                    <select 
                      value={newFrequency}
                      onChange={e => setNewFrequency(e.target.value)}
                      className={`w-full p-2 bg-black/50 border border-panel-border rounded text-white focus:border-${brandColorClass} outline-none appearance-none cursor-pointer`}
                      required
                    >
                      <option value="mensual">Mensual</option>
                      <option value="anual">Anual</option>
                      <option value="evento">Evento</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                    <select 
                      value={newType}
                      onChange={e => setNewType(e.target.value as 'INCOME' | 'EXPENSE')}
                      className={`w-full p-2 bg-black/50 border border-panel-border rounded text-white focus:border-${brandColorClass} outline-none appearance-none cursor-pointer`}
                      required
                    >
                      <option value="EXPENSE">Gasto</option>
                      <option value="INCOME">Ingreso</option>
                    </select>
                  </div>
                  {newFrequency === 'evento' && (
                    <div className="w-24">
                      <label className="block text-xs text-gray-400 mb-1">Eventos</label>
                      <input 
                        type="number" 
                        min="1"
                        value={newExpectedEvents}
                        onChange={e => setNewExpectedEvents(e.target.value)}
                        className={`w-full p-2 bg-black/50 border border-panel-border rounded text-white focus:border-${brandColorClass} outline-none`}
                        placeholder="Ej. 3"
                        required
                      />
                    </div>
                  )}
                  <div className="w-32">
                    <label className="block text-xs text-gray-400 mb-1">Costo (USD)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={newAmount}
                      onChange={e => setNewAmount(e.target.value)}
                      className={`w-full p-2 bg-black/50 border border-panel-border rounded text-white focus:border-${brandColorClass} outline-none`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`p-2 h-10 border border-${brandColorClass} bg-${brandColorClass}/10 text-${brandColorClass} rounded hover:bg-${brandColorClass} hover:text-white transition-colors flex items-center justify-center w-12 disabled:opacity-50`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </form>
              </div>

              <div className="space-y-2">
                {constantExpenses.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No hay gastos constantes registrados.</p>
                ) : (
                  constantExpenses.map(expense => (
                    <div key={expense.id} className="flex justify-between items-center p-3 border border-panel-border rounded bg-black/20 hover:bg-black/40 transition-colors">
                      <div className="flex-1">
                        <p className="text-white font-bold">{expense.concept} <span className={`text-xs ml-2 ${expense.type === 'INCOME' ? 'text-brand-primary' : 'text-red-500'}`}>[{expense.type === 'INCOME' ? 'INGRESO' : 'GASTO'}]</span></p>
                        <p className="text-xs text-gray-500 uppercase">{expense.frequency}{expense.frequency === 'evento' ? ` (${expense.expectedEvents} esperados)` : ''}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <p className={`text-lg font-bold text-${brandColorClass}`}>{formatCurrency(expense.amount)}</p>
                        <button 
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-500/50 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-500/10"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No hay proyectos para desglosar.</p>
              ) : (
                projects.map(project => {
                  let amount = 0;
                  if (type === 'REVENUE_GENERATED') {
                    amount = Number(project.generatedRevenue) || 0;
                  }
                  if (type === 'REVENUE_PROJECTED') {
                    if (project.status === 'DELIVERED' || project.status === 'LOST') return null;
                    amount = Number(project.projectedRevenue) || (Number(project.quotedPrice || 0) - Number(project.counterOfferPrice || 0));
                    amount = Math.max(0, amount);
                  }
                  if (type === 'OPERATIONAL_COSTS') {
                    amount = Number(project.operationalCosts) || 0;
                  }
                  
                  if (amount === 0) return null;

                  return (
                    <div key={project.id} className="flex justify-between items-center p-3 border border-panel-border rounded bg-black/20 hover:bg-black/40 transition-colors">
                      <div>
                        <p className="text-white font-bold">{project.companyName}</p>
                        <p className="text-xs text-gray-500">{project.contactName}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold text-${brandColorClass}`}>{formatCurrency(amount)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
