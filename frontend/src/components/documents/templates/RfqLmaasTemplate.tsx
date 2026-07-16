import React from 'react';
import { t } from '@/lib/documentTranslations';
import { DocumentHeader } from './DocumentHeader';
import LMaaSLogo from '../../../../public/LMaaSLogo.svg';

interface RfqLmaasData {
  projectName: string;
  clientName: string;
  date: string;
  objective: string;
  capacity: string;
  retainerAmount: string;
  currency: string;
  onboardingFee: string;
  sla: string;
  exitClause: string;
}

interface Props {
  language: 'ES' | 'EN';
  data: RfqLmaasData;
}

export const RfqLmaasTemplate: React.FC<Props> = ({ language, data }) => {
  const dict = t[language];

  const header = (
    <DocumentHeader 
      title={dict.RFQ_LMAAS_TITLE}
      subtitle={data.projectName}
      rightText1={`Para: ${data.clientName}`}
      rightText2={data.date}
      overrideLogo={LMaaSLogo}
    />
  );

  return (
    <>
      <div className="print:hidden">{header}</div>
      <div className="hidden print:block print:fixed print:top-0 print:left-0 print:w-full z-50">{header}</div>
      <table className="w-full border-collapse border-spacing-0">
        <thead className="hidden print:table-header-group">
          <tr>
            <td className="p-0 border-none align-top">
              <div className="opacity-0 pointer-events-none">{header}</div>
            </td>
          </tr>
        </thead>
        <tbody className="table-row-group">
          <tr>
            <td className="p-0 border-none align-top">
            <div className="font-sans text-sm text-gray-800 px-[20mm] pb-[20mm]">

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_LMAAS_OBJ}</h2>
          <p className="whitespace-pre-line text-gray-700">{data.objective}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_LMAAS_CAPACITY}</h2>
          <div className="bg-blue-50 p-6 border border-blue-200 rounded-lg shadow-sm">
            <h3 className="font-bold text-logika-blue mb-2">Suscripción Mensual Continua</h3>
            <p className="text-3xl font-mono font-black text-gray-900 mb-4">{data.retainerAmount} {data.currency} <span className="text-sm font-sans text-gray-600 font-normal">/ mes</span></p>
            <div className="text-gray-700 border-t border-blue-200 pt-4 mt-2">
              <span className="font-bold block mb-2">Equipo Incluido:</span>
              <p className="whitespace-pre-line">{data.capacity}</p>
            </div>
          </div>
        </section>

        {data.onboardingFee && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_LMAAS_ONBOARDING}</h2>
            <div className="bg-gray-50 p-4 border-l-4 border-gray-400">
              <p className="text-xl font-mono font-bold">{data.onboardingFee} {data.currency}</p>
              <p className="text-xs text-gray-500 mt-1">Configuración inicial, DevOps y auditoría.</p>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_LMAAS_SLA}</h2>
          <p className="whitespace-pre-line text-gray-700">{data.sla}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_LMAAS_EXIT}</h2>
          <div className="bg-gray-50 p-4 text-gray-700 text-xs text-justify">
            {data.exitClause}
          </div>
        </section>
      </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    </>
  );
};
