import React from 'react';
import { t } from '@/lib/documentTranslations';
import { DocumentHeader } from './DocumentHeader';

interface MvpData {
  projectName: string;
  clientName: string;
  date: string;
  overview: string;
  backlog: string[];
  exclusions: string[];
  stack: string;
  sprints: string;
  criteria: string;
}

interface Props {
  language: 'ES' | 'EN';
  data: MvpData;
}

export const MvpTemplate: React.FC<Props> = ({ language, data }) => {
  const dict = t[language];

  const header = (
    <DocumentHeader 
      title={dict.MVP_TITLE}
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
          {/* 1. Overview */}
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-logika-blue mb-3">{dict.MVP_OVERVIEW}</h2>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line text-gray-700 border border-gray-200">
                    {data.overview}
                  </div>
                </section>
              </div>
            </td>
          </tr>

          {/* 2. Backlog */}
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-logika-blue mb-3">{dict.MVP_BACKLOG}</h2>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    {data.backlog?.map((item, idx) => (
                      <li key={idx} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                  
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <h3 className="font-bold text-red-800 mb-2">{dict.MVP_EXCLUSIONS}</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {data.exclusions?.map((item, idx) => (
                        <li key={idx} className="text-red-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            </td>
          </tr>

          {/* 3. Stack */}
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-logika-blue mb-3">{dict.MVP_STACK}</h2>
                  <p className="whitespace-pre-line text-gray-700">{data.stack}</p>
                </section>
              </div>
            </td>
          </tr>

          {/* 4. Sprints */}
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-logika-blue mb-3">{dict.MVP_SPRINTS}</h2>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 whitespace-pre-line text-gray-800">
                    {data.sprints}
                  </div>
                </section>
              </div>
            </td>
          </tr>

          {/* 5. Criteria */}
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm] pb-[20mm]">
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-logika-blue mb-3">{dict.MVP_CRITERIA}</h2>
                  <p className="whitespace-pre-line text-gray-700">{data.criteria}</p>
                </section>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
