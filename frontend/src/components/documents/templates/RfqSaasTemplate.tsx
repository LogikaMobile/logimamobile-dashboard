import React from 'react';
import { t } from '@/lib/documentTranslations';
import { DocumentHeader } from './DocumentHeader';

interface RfqSaasData {
  projectName: string;
  clientName: string;
  date: string;
  objective: string;
  setupFee: string;
  licenseDetails: string;
  licensePrice: string;
  currency: string;
  techConsiderations: string;
  legalDocs: string;
}

interface Props {
  language: 'ES' | 'EN';
  data: RfqSaasData;
}

export const RfqSaasTemplate: React.FC<Props> = ({ language, data }) => {
  const dict = t[language];

  const header = (
    <DocumentHeader 
      title={dict.RFQ_SAAS_TITLE}
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
        <thead className="hidden print:table-header-group">
          <tr>
            <td className="p-0 border-none">
              <div style={{ height: '215px' }}></div>
            </td>
          </tr>
        </thead>
        <tbody className="table-row-group">
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_SAAS_OBJ}</h2>
                  <p className="whitespace-pre-line text-gray-700">{data.objective}</p>
                </section>
              </div>
            </td>
          </tr>

          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_SAAS_SETUP}</h2>
                  <div className="bg-gray-50 p-4 border-l-4 border-gray-400">
                    <p className="text-2xl font-mono font-bold">{data.setupFee} {data.currency}</p>
                    <p className="text-xs text-gray-500 mt-1">Pago único por implementación inicial y configuración.</p>
                  </div>
                </section>
              </div>
            </td>
          </tr>

          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_SAAS_LICENSE}</h2>
                  <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
                    <p className="text-2xl font-mono font-bold text-logika-blue mb-4">{data.licensePrice} {data.currency} <span className="text-sm font-sans text-gray-600 font-normal">/ mes</span></p>
                    <p className="whitespace-pre-line text-gray-700 text-sm">{data.licenseDetails}</p>
                  </div>
                </section>
              </div>
            </td>
          </tr>

          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_SAAS_TECH}</h2>
                  <p className="whitespace-pre-line text-gray-700">{data.techConsiderations}</p>
                </section>
              </div>
            </td>
          </tr>

          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm] pb-[20mm]">
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-200 pb-1">{dict.RFQ_SAAS_LEGAL}</h2>
                  <p className="whitespace-pre-line text-gray-700">{data.legalDocs}</p>
                </section>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
