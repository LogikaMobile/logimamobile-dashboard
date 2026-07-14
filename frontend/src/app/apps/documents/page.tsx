import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DocumentEditor from '@/components/documents/DocumentEditor';
import Logo from '../../../../public/Logo.svg';

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-background p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-center border-b border-panel-border pb-6">
          <div>
            <div className="flex items-center gap-5">
              <Image src={Logo} alt="LogikaMobile Logo" width={120} height={120} />
              <h1 className="text-6xl font-bold tracking-widest">
                <span className="text-brand-purple">Logika</span><span className="text-brand-orange">Mobile</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-brand-primary text-sm uppercase tracking-widest">/ CRM_DOCUMENTOS_</p>
              
              <div className="ml-4 flex gap-2">
                <Link 
                  href="/apps/projects/dashboard"
                  className="px-6 py-3 bg-[#111111] border border-white/20 text-white font-bold tracking-wider hover:bg-white hover:text-black transition-colors uppercase flex items-center justify-center gap-2"
                >
                  &lt; VOLVER_A_DASHBOARD
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <div className="bg-black border border-panel-border rounded-lg overflow-hidden shadow-2xl">
          <DocumentEditor />
        </div>
      </div>
    </main>
  );
}
