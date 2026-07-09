"use client";

import { useState } from 'react';
import { Developer, CreateDeveloperDto } from '@/types';
import { createDeveloper, updateDeveloper } from '@/lib/api';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  developer?: Developer; // If provided, it's edit mode
}

export default function DeveloperModal({ isOpen, onClose, onSaved, developer }: DeveloperModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      jobTitle: formData.get('jobTitle') as string,
      hourlyRate: Number(formData.get('hourlyRate')),
      availableHoursPerMonth: Number(formData.get('availableHoursPerMonth')),
      isActive: formData.get('isActive') === 'on',
    };

    try {
      if (developer) {
        await updateDeveloper(developer.id, { ...developer, ...data });
      } else {
        await createDeveloper(data as CreateDeveloperDto);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save developer:', error);
      alert('Error saving developer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-mono">
      <div className="bg-[#111111] border-2 border-white/20 p-8 w-full max-w-lg shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">
            {developer ? 'UPDATE_DEV_PROFILE' : 'NEW_DEVELOPER_REGISTRATION'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Dev_Name // ID</label>
              <input 
                name="name" 
                defaultValue={developer?.name}
                required 
                className="w-full bg-[#1A1A1A] border border-white/10 p-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                placeholder="E.g., John Doe"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <input 
                name="email" 
                type="email"
                defaultValue={developer?.email}
                required 
                className="w-full bg-[#1A1A1A] border border-white/10 p-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                placeholder="dev@logikamobile.com"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">System Role</label>
              <select 
                name="role" 
                defaultValue={developer?.role || 'ENGINEER'}
                required 
                className="w-full bg-[#1A1A1A] border border-white/10 p-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              >
                <option value="ENGINEER">ENGINEER (Restricted)</option>
                <option value="ADMIN">ADMIN (Full Access)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Job Title // Tech Stack</label>
              <input 
                name="jobTitle" 
                defaultValue={developer?.jobTitle}
                required 
                className="w-full bg-[#1A1A1A] border border-white/10 p-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                placeholder="E.g., Senior Frontend Engineer"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Hourly_Rate (USD)</label>
              <input 
                name="hourlyRate" 
                type="number" 
                step="0.01" 
                min="0"
                defaultValue={developer?.hourlyRate}
                required 
                className="w-full bg-[#1A1A1A] border border-white/10 p-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Capacity (Hrs/Mo)</label>
              <input 
                name="availableHoursPerMonth" 
                type="number"
                min="0"
                defaultValue={developer?.availableHoursPerMonth}
                required 
                className="w-full bg-[#1A1A1A] border border-white/10 p-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                placeholder="160"
              />
            </div>
            
            {developer && (
              <div className="col-span-2 flex items-center mt-2">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  id="isActive"
                  defaultChecked={developer.isActive}
                  className="w-5 h-5 bg-[#1A1A1A] border-white/20 text-white focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActive" className="ml-3 text-sm text-gray-300 cursor-pointer uppercase tracking-wider">
                  System_Status: ACTIVE
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/20 text-white hover:bg-white/5 uppercase tracking-wider text-sm transition-all"
            >
              Abort
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-white text-black font-bold hover:bg-gray-200 uppercase tracking-wider text-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'PROCESSING...' : 'EXECUTE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
