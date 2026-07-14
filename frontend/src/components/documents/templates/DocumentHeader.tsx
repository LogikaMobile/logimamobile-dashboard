import React from 'react';
import Image from 'next/image';
import Logo from '../../../../public/LM_NBG.svg';

interface Props {
  title: string;
  subtitle?: string;
  rightText1?: string;
  rightText2?: string;
  overrideLogo?: any;
}

export const DocumentHeader: React.FC<Props> = ({ title, subtitle, rightText1, rightText2, overrideLogo }) => {
  return (
    <div className="flex justify-between items-center mb-8 bg-[#111111] text-white pt-8 px-[10mm] pb-6 -mx-[20mm] -mt-[20mm] border-b-4 border-brand-orange">
      {/* Left Side: Logo */}
      <div className="flex-1 flex justify-start">
        <Image src={overrideLogo || Logo} alt="LogikaMobile Logo" width={overrideLogo ? 100 : 80} height={80} style={{ objectFit: 'contain' }} />
      </div>
      
      {/* Center: Title & Subtitle */}
      <div className="flex-[2] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-1">{title}</h1>
        {subtitle && <p className="text-gray-400 font-mono text-sm">{subtitle}</p>}
      </div>

      {/* Right Side: LogikaMobile & Dates */}
      <div className="flex-1 flex flex-col items-end text-right">
        <p className="font-bold text-2xl tracking-widest mb-2">
          <span className="text-brand-purple">Logika</span>
          <span className="text-brand-orange">Mobile</span>
          <span className="text-cyan-400">.</span>
        </p>
        {rightText1 && <p className="text-gray-400 font-mono text-sm whitespace-nowrap">{rightText1}</p>}
        {rightText2 && <p className="text-gray-400 font-mono text-sm whitespace-nowrap">{rightText2}</p>}
      </div>
    </div>
  );
};
