'use client';
import { useState } from 'react';
import { Project, ConstantExpense } from '@/types';
import FinancialBreakdownModal from './FinancialBreakdownModal';
import FinancialReportModal from './FinancialReportModal';

export default function FinancialDashboard({ 
  projects, 
  constantExpenses,
  onExpensesChanged
}: { 
  projects: Project[], 
  constantExpenses: ConstantExpense[],
  onExpensesChanged: () => void 
}) {
  const generatedRevenue = projects.reduce((acc, p) => acc + (Number(p.generatedRevenue) || 0), 0);
  const projectedRevenue = projects.reduce((acc, p) => acc + (Number(p.projectedRevenue) || 0), 0);
  const operationalCosts = projects.reduce((acc, p) => acc + (Number(p.operationalCosts) || 0), 0);
  const constantIncomesMonthly = constantExpenses
    .filter(e => e.type === 'INCOME')
    .reduce((acc, e) => {
      if (e.frequency === 'mensual') return acc + e.amount;
      if (e.frequency === 'anual') return acc + (e.amount / 12);
      if (e.frequency === 'evento') return acc + ((e.amount * (e.expectedEvents || 1)) / 12);
      return acc + e.amount;
    }, 0);

  const constantExpensesMonthly = constantExpenses
    .filter(e => e.type !== 'INCOME')
    .reduce((acc, e) => {
      if (e.frequency === 'mensual') return acc + e.amount;
      if (e.frequency === 'anual') return acc + (e.amount / 12);
      if (e.frequency === 'evento') return acc + ((e.amount * (e.expectedEvents || 1)) / 12);
      return acc + e.amount;
    }, 0);

  const constantIncomesAnnual = constantExpenses
    .filter(e => e.type === 'INCOME')
    .reduce((acc, e) => {
      if (e.frequency === 'mensual') return acc + (e.amount * 12);
      if (e.frequency === 'anual') return acc + e.amount;
      if (e.frequency === 'evento') return acc + (e.amount * (e.expectedEvents || 1));
      return acc + e.amount;
    }, 0);

  const constantExpensesAnnual = constantExpenses
    .filter(e => e.type !== 'INCOME')
    .reduce((acc, e) => {
      if (e.frequency === 'mensual') return acc + (e.amount * 12);
      if (e.frequency === 'anual') return acc + e.amount;
      if (e.frequency === 'evento') return acc + (e.amount * (e.expectedEvents || 1));
      return acc + e.amount;
    }, 0);
  
  // Cálculo de ROI
  const totalRevenue = generatedRevenue + projectedRevenue + constantIncomesAnnual;
  
  // ROI Anualizado (Asume que los ingresos y costos operativos son del año)
  const totalCostsAnnual = operationalCosts + constantExpensesAnnual;
  const roiAnnual = totalCostsAnnual > 0 ? ((totalRevenue - totalCostsAnnual) / totalCostsAnnual) * 100 : 0;

  // ROI Mensualizado (Ingresos y costos operativos se dividen entre 12)
  const totalCostsMonthly = (operationalCosts / 12) + constantExpensesMonthly;
  const revenueMonthly = (totalRevenue / 12) + constantIncomesMonthly;
  const roiMonthly = totalCostsMonthly > 0 ? ((revenueMonthly - totalCostsMonthly) / totalCostsMonthly) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    type: 'REVENUE_GENERATED' | 'REVENUE_PROJECTED' | 'OPERATIONAL_COSTS' | 'CONSTANT_EXPENSES';
    brandColorClass: string;
  }>({
    isOpen: false,
    title: '',
    type: 'REVENUE_GENERATED',
    brandColorClass: 'brand-primary'
  });

  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleCardClick = (title: string, type: 'REVENUE_GENERATED' | 'REVENUE_PROJECTED' | 'OPERATIONAL_COSTS' | 'CONSTANT_EXPENSES', colorClass: string) => {
    setModalConfig({
      isOpen: true,
      title,
      type,
      brandColorClass: colorClass
    });
  };

  return (
    <>
      <div className="bg-panel-bg p-8 rounded border border-panel-border mb-8 font-mono relative">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-xl font-bold tracking-widest text-brand-purple uppercase">/ DASHBOARD_FINANCIERO</h2>
          <button 
            onClick={() => setIsReportOpen(true)}
            className="px-4 py-2 border border-brand-primary text-brand-primary font-bold text-sm tracking-widest uppercase hover:bg-brand-primary hover:text-white transition-colors"
          >
            [ Reporte Financiero ]
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div 
            onClick={() => handleCardClick('Ingresos Generados', 'REVENUE_GENERATED', 'brand-primary')}
            className="p-5 border-l-4 border-brand-primary bg-black/40 hover:bg-black/60 cursor-pointer transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <p className="text-xs text-brand-primary uppercase tracking-widest mb-2 relative z-10">Ingresos_Generados</p>
            <p className="text-3xl font-bold text-white relative z-10">{formatCurrency(generatedRevenue)}</p>
          </div>
          
          <div 
            onClick={() => handleCardClick('Ingresos Proyectados', 'REVENUE_PROJECTED', 'brand-purple')}
            className="p-5 border-l-4 border-brand-purple bg-black/40 hover:bg-black/60 cursor-pointer transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-purple/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <p className="text-xs text-brand-purple uppercase tracking-widest mb-2 relative z-10">Ingresos_Proyectados</p>
            <p className="text-3xl font-bold text-white relative z-10">{formatCurrency(projectedRevenue)}</p>
          </div>
          
          <div 
            onClick={() => handleCardClick('Gastos Operativos', 'OPERATIONAL_COSTS', 'red-500')}
            className="p-5 border-l-4 border-red-500 bg-black/40 hover:bg-black/60 cursor-pointer transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <p className="text-xs text-red-500 uppercase tracking-widest mb-2 relative z-10">Gastos_Operativos</p>
            <p className="text-3xl font-bold text-white relative z-10">{formatCurrency(operationalCosts)}</p>
          </div>
          
          <div 
            onClick={() => handleCardClick('Gastos Constantes', 'CONSTANT_EXPENSES', 'red-500')}
            className="p-5 border-l-4 border-red-500 bg-black/40 hover:bg-black/60 cursor-pointer transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <p className="text-xs text-red-500 uppercase tracking-widest mb-2 relative z-10">GC_Anualizados</p>
            <p className="text-3xl font-bold text-white relative z-10">{formatCurrency(constantExpensesAnnual)}</p>
            <p className="text-xs text-gray-400 mt-2 relative z-10">Mensual: {formatCurrency(constantExpensesMonthly)}</p>
          </div>

          <div className="p-5 border-l-4 border-brand-orange bg-black/40">
            <p className="text-xs text-brand-orange uppercase tracking-widest mb-2">ROI_Anual</p>
            <p className="text-3xl font-bold text-white mb-2">{roiAnnual.toFixed(0)}%</p>
            <div className="border-t border-panel-border/50 pt-2 mt-2">
              <p className="text-xs text-brand-orange/70 uppercase tracking-widest">ROI_Mensual</p>
              <p className="text-xl font-bold text-gray-300">{roiMonthly.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      <FinancialBreakdownModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        type={modalConfig.type}
        brandColorClass={modalConfig.brandColorClass}
        projects={projects}
        constantExpenses={constantExpenses}
        onExpensesChanged={onExpensesChanged}
      />

      <FinancialReportModal 
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        brandColorClass="brand-primary"
      />
    </>
  );
}
