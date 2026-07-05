'use client';
import { LmaasTicket } from '@/types';
import { updateLmaasTicket } from '@/lib/api';
import { mutate } from 'swr';
import { useState } from 'react';

const TICKET_COLUMNS = [
  { id: 'BACKLOG', title: 'Backlog' },
  { id: 'DEVELOPMENT', title: 'Development' },
  { id: 'QA', title: 'QA / Testing' },
  { id: 'COOLDOWN', title: 'Cooldown' },
  { id: 'DELIVERED', title: 'Delivered' }
];

export default function LmaasTicketKanban({ 
  tickets, 
  subscriptionId 
}: { 
  tickets: LmaasTicket[], 
  subscriptionId: string 
}) {
  const [isDragging, setIsDragging] = useState(false);

  // Filter tickets for this subscription
  const subTickets = tickets.filter(t => t.subscriptionId === subscriptionId);

  const handleDragStart = (e: React.DragEvent, ticket: LmaasTicket) => {
    e.dataTransfer.setData('ticket', JSON.stringify(ticket));
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setIsDragging(false);
    
    try {
      const ticketData = e.dataTransfer.getData('ticket');
      if (!ticketData) return;
      
      const ticket: LmaasTicket = JSON.parse(ticketData);
      if (ticket.status === newStatus) return;
      
      // Optimistic update
      const updatedTickets = tickets.map(t => 
        t.id === ticket.id ? { ...t, status: newStatus as any } : t
      );
      mutate('lmaasTickets', updatedTickets, false);
      
      // API call
      const updatedTicket = { ...ticket, status: newStatus };
      await updateLmaasTicket(ticket.id, updatedTicket);
      
      mutate('lmaasTickets');
    } catch (error) {
      console.error('Error updating ticket status:', error);
      mutate('lmaasTickets');
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {TICKET_COLUMNS.map((col) => {
        const colTickets = subTickets.filter(t => t.status === col.id);
        
        return (
          <div 
            key={col.id} 
            className={`w-[260px] bg-black/40 rounded border ${isDragging ? 'border-dashed border-panel-border/50' : 'border-panel-border'} flex flex-col font-mono shrink-0 transition-all`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex justify-between items-center mb-3 border-b border-panel-border pb-2 p-3">
              <h3 className="font-bold text-gray-300 uppercase tracking-widest text-xs">{col.title}</h3>
              <span className="bg-brand-orange/20 text-brand-orange text-xs font-bold px-1.5 py-0.5 rounded">
                {colTickets.length}
              </span>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-3 p-3 pt-0 min-h-[80px] max-h-[50vh]">
              {colTickets.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2 uppercase tracking-widest">/ VACÍO</p>
              )}
              
              {colTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, ticket)}
                  onDragEnd={handleDragEnd}
                  className="bg-panel-bg p-3 rounded border border-panel-border hover:border-brand-orange transition-all cursor-grab active:cursor-grabbing"
                >
                  <p className="text-white font-bold text-sm leading-tight mb-2">{ticket.title}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Est: {ticket.estimatedHours} hrs</span>
                    {ticket.status === 'DELIVERED' && <span className="text-brand-orange font-bold">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
