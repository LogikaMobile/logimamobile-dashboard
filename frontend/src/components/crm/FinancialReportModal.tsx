'use client';
import { useState, useEffect } from 'react';
import { MonthlyExpenseRecord, UpdateExpenseRecordDto } from '@/types';
import { getMonthlyReport, updateExpenseRecord } from '@/lib/api';

export default function FinancialReportModal({ 
  isOpen, 
  onClose,
  brandColorClass,
  currency = 'USD',
  exchangeRate = 20.00
}: { 
  isOpen: boolean;
  onClose: () => void;
  brandColorClass: string;
  currency?: 'USD' | 'MXN';
  exchangeRate?: number;
}) {
  const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState<MonthlyExpenseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editNote, setEditNote] = useState<string>('');

  const formatCurrency = (amount: number) => {
    const convertedAmount = currency === 'MXN' ? amount * (exchangeRate || 20) : amount;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currency || 'USD' }).format(convertedAmount);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'monthly') {
      fetchRecords();
    }
  }, [isOpen, activeTab, selectedMonth, selectedYear]);

  const fetchRecords = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getMonthlyReport(selectedYear, selectedMonth);
      setRecords(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al cargar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (id: number) => {
    setErrorMsg(null);
    try {
      const dto: UpdateExpenseRecordDto = {
        actualAmount: editAmount,
        modificationNote: editNote
      };
      await updateExpenseRecord(id, dto);
      setEditingId(null);
      fetchRecords(); // refresh
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'No se puede editar en este periodo (fuera de los 3 días hábiles).');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm font-mono">
      <div className="bg-panel-bg border border-panel-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b border-panel-border flex justify-between items-center bg-gradient-to-r from-${brandColorClass}/10 to-transparent`}>
          <div>
            <h2 className={`text-2xl font-bold text-${brandColorClass} tracking-widest uppercase`}>Reporte Financiero</h2>
            <p className="text-gray-400 text-sm mt-1">Histórico de Gastos e Ingresos Reales</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-light">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-panel-border bg-black/30">
          <button 
            className={`flex-1 py-3 text-sm tracking-widest uppercase font-bold transition-colors ${activeTab === 'monthly' ? `text-${brandColorClass} border-b-2 border-${brandColorClass}` : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('monthly')}
          >
            Mensual Editable
          </button>
          <button 
            className={`flex-1 py-3 text-sm tracking-widest uppercase font-bold transition-colors ${activeTab === 'annual' ? `text-${brandColorClass} border-b-2 border-${brandColorClass}` : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('annual')}
          >
            Anual (Próximamente)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0a0a0a]">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-500 rounded text-sm">
              {errorMsg}
            </div>
          )}

          {activeTab === 'monthly' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex gap-4 items-end bg-black/40 p-4 rounded border border-panel-border">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Mes</label>
                  <select 
                    value={selectedMonth} 
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className={`bg-black/50 border border-panel-border rounded p-2 text-white outline-none focus:border-${brandColorClass}`}
                  >
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('es', { month: 'long' }).toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Año</label>
                  <input 
                    type="number" 
                    value={selectedYear} 
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    className={`bg-black/50 border border-panel-border rounded p-2 text-white outline-none focus:border-${brandColorClass} w-24`}
                  />
                </div>
              </div>

              {/* Records */}
              {loading ? (
                <p className="text-gray-500 text-center py-8">Cargando registros...</p>
              ) : records.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay registros financieros para este mes.</p>
              ) : (
                <div className="space-y-4">
                  <h3 className={`text-sm font-bold text-${brandColorClass} mb-4 uppercase tracking-widest border-b border-panel-border pb-2`}>Gastos Operativos (Infraestructura)</h3>
                  {records.map(r => (
                    <div key={r.id} className="p-4 bg-black/40 border border-panel-border rounded hover:bg-black/60 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-bold text-lg">{r.concept}</p>
                          {r.isModified && <p className="text-xs text-brand-orange mt-1">¡Modificado! Motivo: {r.modificationNote}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 line-through">Proyectado: {formatCurrency(r.originalAmount)}</p>
                          <p className={`text-xl font-bold ${r.isModified ? 'text-brand-orange' : 'text-white'}`}>Real: {formatCurrency(r.actualAmount)}</p>
                        </div>
                      </div>

                      {editingId === r.id ? (
                        <div className="mt-4 p-4 bg-black/50 rounded border border-panel-border flex flex-wrap gap-4 items-end">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Costo Real (USD)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={editAmount}
                              onChange={e => setEditAmount(Number(e.target.value))}
                              className={`w-32 p-2 bg-black/80 border border-panel-border rounded text-white focus:border-${brandColorClass} outline-none`}
                            />
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs text-gray-400 mb-1">Motivo (Ej. Exceso de consumo AWS)</label>
                            <input 
                              type="text" 
                              value={editNote}
                              onChange={e => setEditNote(e.target.value)}
                              className={`w-full p-2 bg-black/80 border border-panel-border rounded text-white focus:border-${brandColorClass} outline-none`}
                            />
                          </div>
                          <button 
                            onClick={() => handleSaveEdit(r.id)}
                            className={`px-4 py-2 bg-${brandColorClass} text-white font-bold rounded hover:opacity-80 transition-opacity`}
                          >
                            Guardar
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 border border-panel-border text-gray-300 font-bold rounded hover:bg-white/5 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4 border-t border-panel-border/50 pt-2 text-right">
                          <button 
                            onClick={() => {
                              setEditingId(r.id);
                              setEditAmount(r.actualAmount);
                              setEditNote(r.modificationNote || '');
                            }}
                            disabled={r.isModified}
                            className={`text-xs uppercase tracking-widest font-bold ${r.isModified ? 'text-gray-600 cursor-not-allowed' : `text-${brandColorClass} hover:text-white`}`}
                          >
                            {r.isModified ? 'Bloqueado (Ya editado)' : 'Modificar Consumo Real'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'annual' && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">El desglose anual gráfico está en desarrollo.</p>
              <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto opacity-50"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
