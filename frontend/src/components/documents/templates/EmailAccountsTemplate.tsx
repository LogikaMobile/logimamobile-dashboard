import React from 'react';
import { t } from '@/lib/documentTranslations';
import { DocumentHeader } from './DocumentHeader';

interface Account {
  email: string;
  password?: string;
}

interface EmailAccountsData {
  date: string;
  clientName: string;
  introText: string;
  accounts: Account[];
  mobileSteps: string[];
  webmailUrl: string;
}

interface Props {
  language: 'ES' | 'EN';
  data: EmailAccountsData;
}

export const EmailAccountsTemplate: React.FC<Props> = ({ language, data }) => {
  const dict = t[language];

  const header = (
    <DocumentHeader 
      title={dict.EMAIL_ACC_TITLE}
      subtitle=""
      rightText1={`Para: ${data.clientName || ''}`}
      rightText2={data.date || ''}
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
          {/* Intro */}
          <tr>
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <p className="mb-8 text-gray-700 whitespace-pre-line leading-relaxed">
                  {data.introText}
                </p>
              </div>
            </td>
          </tr>

          {/* Section 1 Header */}
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm]">
                <h2 className="text-xl font-bold text-logika-blue mb-3">{dict.EMAIL_ACC_SEC1}</h2>
                <h3 className="font-bold text-gray-800 mb-4">{dict.EMAIL_ACC_CRED}</h3>
              </div>
            </td>
          </tr>

          {/* Email Accounts */}
          {data.accounts?.map((acc, idx) => (
            <tr key={idx} className="break-inside-avoid">
              <td className="p-0 border-none align-top">
                <div className="font-sans text-sm text-gray-800 px-[20mm] mb-4">
                  <div className="bg-white p-3 rounded border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="mb-2 sm:mb-0">
                      <span className="font-bold text-gray-700">{dict.EMAIL_ACC_EMAIL}: </span>
                      <span className="text-gray-900">{acc.email}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">{dict.EMAIL_ACC_PASS}: </span>
                      <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">{acc.password}</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {(!data.accounts || data.accounts.length === 0) && (
            <tr className="break-inside-avoid">
              <td className="p-0 border-none align-top">
                <div className="font-sans text-sm text-gray-800 px-[20mm] mb-8">
                  <p className="text-gray-500 italic">No hay cuentas configuradas.</p>
                </div>
              </td>
            </tr>
          )}

          {/* Section 2 */}
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm] mt-4 mb-8">
                <h2 className="text-xl font-bold text-logika-blue mb-3">{dict.EMAIL_ACC_SEC2}</h2>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-900 mb-3">{dict.EMAIL_ACC_STEPS}</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-800">
                    {data.mobileSteps?.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </td>
          </tr>

          {/* Section 3 */}
          <tr className="break-inside-avoid">
            <td className="p-0 border-none align-top">
              <div className="font-sans text-sm text-gray-800 px-[20mm] pb-[20mm]">
                <h2 className="text-xl font-bold text-logika-blue mb-3">{dict.EMAIL_ACC_SEC3}</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3">{dict.EMAIL_ACC_WEB}</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-800">
                    <li>
                      <span className="font-bold">{dict.EMAIL_ACC_VISIT}: </span>
                      <a href={data.webmailUrl} className="text-logika-blue hover:underline break-all" target="_blank" rel="noreferrer">
                        {data.webmailUrl}
                      </a>
                    </li>
                    <li>{dict.EMAIL_ACC_LOGIN}</li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
