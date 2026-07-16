import React, { forwardRef } from 'react';
import Image from 'next/image';
import Logo from '../../../../public/LM_NBG.svg';

interface DocumentPreviewProps {
  children: React.ReactNode;
}

export const DocumentPreview = forwardRef<HTMLDivElement, DocumentPreviewProps>(
  ({ children }, ref) => {
    return (
      <div className="bg-black p-8 flex justify-center w-full min-h-screen overflow-auto">
        <div 
          ref={ref} 
          className="bg-white text-black shadow-xl relative"
          style={{
            // A4 format dimensions in mm
            width: '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box',
          }}
        >
          <style>{`
            @media print {
              @page { margin: 0; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `}</style>
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
            <Image 
              src={Logo} 
              alt="Watermark" 
              className="opacity-10 grayscale"
              width={600} 
              height={600} 
            />
          </div>
          
          {/* Content layer above watermark */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    );
  }
);
DocumentPreview.displayName = 'DocumentPreview';
