"use client";
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetchDevelopers, fetchProjectAssignments, createAssignment, deleteAssignment, fetchDeveloper } from '@/lib/api';
import { CreateProjectAssignmentDto } from '@/types';

interface ProjectResourceAssignmentProps {
  projectId: string;
}

function AssignmentRow({
  developerId,
  data,
  onChange,
  onRemove
}: {
  developerId: string,
  data: { month: number, year: number, hours: string },
  onChange: (d: { month: number, year: number, hours: string }) => void,
  onRemove: () => void
}) {
  const { data: devData } = useSWR(developerId ? ['developer', developerId, data.month, data.year] : null, 
    () => fetchDeveloper(developerId, data.month, data.year)
  );

  const availableHours = devData?.developer?.availableHoursPerMonth || 160;
  const usedHours = devData?.usedHours || 0;
  const newTotal = usedHours + Number(data.hours || 0);
  const isOverbooked = newTotal > availableHours;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-white/5 bg-[#111] mb-2 rounded">
      <div>
        <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Horas a Consumir</label>
        <input 
          type="number"
          value={data.hours}
          onChange={e => onChange({ ...data, hours: e.target.value })}
          className="w-full p-2 bg-black/50 border border-panel-border rounded text-white focus:border-brand-orange outline-none text-sm font-mono"
          placeholder="Ej. 40"
        />
      </div>
      <div>
        <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Mes</label>
        <select 
          value={data.month}
          onChange={e => onChange({ ...data, month: Number(e.target.value) })}
          className="w-full p-2 bg-black/50 border border-panel-border rounded text-white focus:border-brand-orange outline-none text-sm font-mono"
        >
          {Array.from({length: 12}, (_, i) => i + 1).map(m => (
            <option key={m} value={m} className="bg-[#111]">{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Año</label>
        <select 
          value={data.year}
          onChange={e => onChange({ ...data, year: Number(e.target.value) })}
          className="w-full p-2 bg-black/50 border border-panel-border rounded text-white focus:border-brand-orange outline-none text-sm font-mono"
        >
          {[2024, 2025, 2026, 2027].map(y => (
            <option key={y} value={y} className="bg-[#111]">{y}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col justify-end items-end gap-1">
        {isOverbooked && developerId && (
          <span className="text-yellow-500 text-[10px] uppercase font-bold text-right leading-tight mb-1">
            ⚠️ ADVERTENCIA:
            <br />
            Límite excedido ({newTotal}/{availableHours} hrs).
          </span>
        )}
        <button 
          type="button"
          onClick={onRemove}
          className="w-full sm:w-auto px-4 py-2 bg-red-900/20 text-red-500 border border-red-900 rounded hover:bg-red-500 hover:text-black font-bold text-xs uppercase tracking-widest transition-all"
        >
          - FILA
        </button>
      </div>
    </div>
  );
}

export default function ProjectResourceAssignment({ projectId }: ProjectResourceAssignmentProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: developers } = useSWR(['developers', currentMonth, currentYear], () => fetchDevelopers(currentMonth, currentYear), {
    fallbackData: [],
    revalidateOnFocus: false
  });

  const { data: assignments, mutate } = useSWR(['assignments', projectId], () => fetchProjectAssignments(projectId), {
    fallbackData: [],
    revalidateOnFocus: false
  });

  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [rows, setRows] = useState([{ month: currentMonth, year: currentYear, hours: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddRow = () => {
    setRows([...rows, { month: currentMonth, year: currentYear, hours: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChangeRow = (index: number, data: any) => {
    const newRows = [...rows];
    newRows[index] = data;
    setRows(newRows);
  };

  const handleSaveAssignments = async () => {
    if (!selectedDeveloper) return;
    const validRows = rows.filter(r => r.hours && Number(r.hours) > 0);
    if (validRows.length === 0) return;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const dtos: CreateProjectAssignmentDto[] = validRows.map(r => ({
        developerId: selectedDeveloper,
        legacyProjectId: projectId,
        assignmentType: 'FIXED_COST',
        assignedMonth: r.month,
        assignedYear: r.year,
        allocatedHours: Number(r.hours)
      }));

      await createAssignment(dtos);
      mutate();
      setSelectedDeveloper('');
      setRows([{ month: currentMonth, year: currentYear, hours: '' }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta asignación?')) return;
    try {
      await deleteAssignment(id);
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 md:col-span-2 border border-panel-border p-4 bg-black/30 rounded mt-4">
      <h3 className="text-lg font-bold text-brand-orange border-b border-panel-border pb-2 uppercase tracking-widest">/ ASIGNACIÓN_DE_RECURSOS (COGS)</h3>
      
      <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded mb-4">
        <label className="block text-xs font-bold text-brand-orange mb-2 uppercase tracking-widest">Seleccionar Desarrollador</label>
        <select 
          value={selectedDeveloper}
          onChange={e => setSelectedDeveloper(e.target.value)}
          className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-orange outline-none font-mono text-sm"
        >
          <option value="" className="bg-[#111]">-- DESARROLLADOR --</option>
          {developers?.map((d: any) => (
            <option key={d.developer.id} value={d.developer.id} className="bg-[#111]">
              {d.developer.name} - ${d.developer.hourlyRate}/h (Base: {d.developer.availableHoursPerMonth} hrs)
            </option>
          ))}
        </select>
      </div>

      {selectedDeveloper && (
        <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded mb-4 font-mono">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Distribución Mensual</h4>
            <button 
              type="button" 
              onClick={handleAddRow}
              className="text-xs bg-white text-black px-3 py-1 font-bold uppercase hover:bg-gray-200 transition-colors"
            >
              + Agregar Mes
            </button>
          </div>
          
          {rows.map((row, i) => (
            <AssignmentRow 
              key={i} 
              developerId={selectedDeveloper} 
              data={row} 
              onChange={(d) => handleChangeRow(i, d)} 
              onRemove={() => handleRemoveRow(i)} 
            />
          ))}

          {errorMsg && (
            <div className="bg-red-900/50 text-red-400 border border-red-900 p-3 mt-4 text-xs font-bold uppercase">
              {errorMsg}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button 
              type="button"
              onClick={handleSaveAssignments}
              disabled={isSubmitting || rows.length === 0}
              className="px-6 py-3 bg-brand-orange text-black rounded hover:bg-white font-bold disabled:opacity-50 transition-all uppercase tracking-widest text-sm"
            >
              {isSubmitting ? 'GUARDANDO...' : 'CONFIRMAR ASIGNACIÓN BATCH'}
            </button>
          </div>
        </div>
      )}

      {assignments && assignments.length > 0 && (
        <div className="mt-4 overflow-x-auto border border-panel-border rounded">
          <table className="w-full text-left text-sm text-gray-400 font-mono">
            <thead className="bg-black/50 uppercase text-[10px] tracking-widest border-b border-panel-border text-brand-primary">
              <tr>
                <th className="p-3">Desarrollador</th>
                <th className="p-3">Periodo</th>
                <th className="p-3">Horas</th>
                <th className="p-3">Costo / H</th>
                <th className="p-3">Total COGS</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a: any) => {
                const totalCost = (a.assignment?.allocatedHours || 0) * (a.developer?.hourlyRate || 0);
                return (
                  <tr key={a.assignment.id} className="border-b border-panel-border/50 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-white font-bold">{a.developer?.name || 'Desconocido'}</td>
                    <td className="p-3">{a.assignment.assignedMonth}/{a.assignment.assignedYear}</td>
                    <td className="p-3 text-brand-orange">{a.assignment.allocatedHours} hrs</td>
                    <td className="p-3">${a.developer?.hourlyRate || 0}</td>
                    <td className="p-3 text-brand-purple font-bold">${totalCost.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <button 
                        type="button"
                        onClick={() => handleDeleteAssignment(a.assignment.id)}
                        className="text-red-500 hover:text-red-400 font-bold uppercase text-[10px] tracking-widest border border-red-500/50 hover:border-red-400 px-2 py-1 rounded"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
