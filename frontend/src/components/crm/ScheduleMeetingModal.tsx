import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { Project } from '@/types';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function ScheduleMeetingModal({ isOpen, onClose, project }: ScheduleMeetingModalProps) {
  const [meetingName, setMeetingName] = useState(`Reunión LogikaMobile - ${project?.companyName || ''}`);
  const [agenda, setAgenda] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      alert("Por favor selecciona fecha y hora para la reunión.");
      return;
    }

    try {
      const startDate = new Date(`${date}T${time}:00`);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora de duración
      
      const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const url = new URL('https://calendar.google.com/calendar/render');
      url.searchParams.append('action', 'TEMPLATE');
      url.searchParams.append('text', meetingName);
      url.searchParams.append('details', `Agenda:\n${agenda}\n\nMensaje:\n${message}`);
      url.searchParams.append('dates', `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`);
      
      if (project.contactEmail) {
        url.searchParams.append('add', project.contactEmail);
      }

      window.open(url.toString(), '_blank');
      onClose();
    } catch (err) {
      alert("Error al formatear la fecha. Verifica que la fecha y hora sean válidas.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono">
      <div className="bg-panel-bg rounded-lg border border-brand-primary/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-panel-border">
          <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-brand-primary" />
            <span className="text-white">AGENDAR_</span>
            <span className="text-brand-primary">REUNIÓN</span>
          </h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-black/50 text-brand-primary rounded transition-colors border border-transparent hover:border-brand-primary">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {!project.contactEmail && (
            <div className="bg-brand-orange/20 border border-brand-orange text-brand-orange p-3 text-xs uppercase tracking-widest rounded mb-4">
              [AVISO] Este proyecto no tiene un correo de contacto registrado. La invitación no se enviará automáticamente a menos que lo agregues manualmente en Google Calendar o edites el proyecto primero.
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Nombre de la Reunión</label>
            <input 
              required 
              value={meetingName} 
              onChange={e => setMeetingName(e.target.value)} 
              className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-gray-600" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Fecha</label>
              <input 
                required 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Hora</label>
              <input 
                required 
                type="time" 
                value={time} 
                onChange={e => setTime(e.target.value)} 
                className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Agenda de la Reunión</label>
            <textarea 
              rows={3}
              value={agenda} 
              onChange={e => setAgenda(e.target.value)} 
              className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-gray-600 resize-none" 
              placeholder="- Punto 1&#10;- Punto 2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Mensaje / Detalles Adicionales</label>
            <textarea 
              rows={3}
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              className="w-full p-3 bg-black/50 border border-panel-border rounded text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-gray-600 resize-none" 
              placeholder="Escribe un mensaje para el cliente..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-panel-border">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-panel-border rounded text-gray-400 hover:text-white hover:bg-black transition-colors font-bold tracking-widest uppercase text-sm">
              [ CANCELAR ]
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 border border-brand-primary bg-brand-primary/10 text-brand-primary rounded hover:bg-brand-primary hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all font-bold tracking-widest uppercase text-sm">
              <ExternalLink className="w-4 h-4" />
              <span>CREAR_MEET_EN_GWS &gt;</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
