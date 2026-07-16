import React from 'react';
import { t } from '@/lib/documentTranslations';
import { DocumentHeader } from './DocumentHeader';

interface RfqCustomData {
  projectName: string;
  clientName: string;
  date: string;
  objective: string;
  milestones: Array<{
    name: string;
    description: string;
    percentage: string;
    amount: string;
  }>;
  totalInvestment: string;
  currency: string;
  ipClause: string;
  warranty: string;
  billingTerms: string;
}

interface Props {
  language: 'ES' | 'EN';
  data: RfqCustomData;
}

export const RfqCustomTemplate: React.FC<Props> = ({ language, data }) => {
  const dict = t[language];

  const header = (
    <DocumentHeader 
      title={dict.RFQ_CUSTOM_TITLE}
      subtitle={data.projectName}
      rightText1={`Para: ${data.clientName}`}
      rightText2={data.date}
    />
  );

  return (
    <>
      <div className="print:hidden">{header}</div>
      <div className="hidden print:block print:fixed print:top-0 print:left-0 print:w-full z-50">{header}</div>
      <table className="w-full border-collapse border-spacing-0">
        <thead className="hidden print:table-header-group bg-transparent shadow-none">
          <tr className="bg-transparent shadow-none">
            <td className="p-0 border-none bg-transparent shadow-none">
              <div style={{ height: '215px' }} className="bg-transparent shadow-none"></div>
            </td>
          </tr>
        </thead>
        <tbody className="table-row-group">
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_CUSTOM_OBJ}</h2>
                  <p className="whitespace-pre-line text-gray-700">{data.objective}</p>
                </section>
              </div>
            </td>
          </tr>

          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b border-gray-200 pb-1">{dict.RFQ_CUSTOM_MILESTONES}</h2>
                  <table className="w-full text-left border-collapse mb-4">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 text-xs uppercase">
                        <th className="py-3 px-4 border border-gray-200">Hito / Fase</th>
                        <th className="py-3 px-4 border border-gray-200">Porcentaje</th>
                        <th className="py-3 px-4 border border-gray-200 text-right">Inversión</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.milestones?.map((m, idx) => (
                        <tr key={idx}>
                          <td className="py-4 px-4 border border-gray-200">
                            <p className="font-bold">{m.name}</p>
                            <p className="text-gray-600 text-xs mt-1 whitespace-pre-line">{m.description}</p>
                          </td>
                          <td className="py-4 px-4 border border-gray-200 font-mono text-center">{m.percentage}</td>
                          <td className="py-4 px-4 border border-gray-200 text-right font-mono font-bold">{m.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-logika-blue text-white">
                        <td colSpan={2} className="py-3 px-4 font-bold text-right">Inversión Total Estimada:</td>
                        <td className="py-3 px-4 text-right font-mono font-bold">{data.totalInvestment} {data.currency}</td>
                      </tr>
                    </tfoot>
                  </table>
                </section>
              </div>
            </td>
          </tr>

          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_CUSTOM_IP}</h2>
                  <div className="bg-gray-50 p-4 text-gray-700 text-xs text-justify">
                    {data.ipClause}
                  </div>
                </section>
              </div>
            </td>
          </tr>

          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_CUSTOM_WARRANTY}</h2>
                  <p className="whitespace-pre-line text-gray-700">{data.warranty}</p>
                </section>
              </div>
            </td>
          </tr>

          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm] pb-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_CUSTOM_TERMS}</h2>
                  <p className="whitespace-pre-line text-gray-700">{data.billingTerms}</p>
                </section>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
