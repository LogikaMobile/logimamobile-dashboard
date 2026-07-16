import React from 'react';
import { t } from '@/lib/documentTranslations';
import { DocumentHeader } from './DocumentHeader';

interface InvoiceData {
  title: string;
  folio: string;
  dateIssued: string;
  dateDue: string;
  fromName: string;
  fromRfc: string;
  fromAddress: string;
  toName: string;
  toRfc: string;
  attentionTo: string;
  items: Array<{
    qty: string;
    unit: string;
    description: string;
    price: string;
    total: string;
  }>;
  subtotal: string;
  taxes: string;
  grandTotal: string;
  currency: string;
  bank: string;
  accountName: string;
  accountNumber: string;
  swift: string;
  legalNotes: string;
}

interface Props {
  language: 'ES' | 'EN';
  data: InvoiceData;
}

export const InvoiceTemplate: React.FC<Props> = ({ language, data }) => {
  const dict = t[language];

  return (
    <table className="w-full border-collapse border-spacing-0">
      <thead className="table-header-group">
        <tr>
          <td className="p-0 border-none align-top">
            <DocumentHeader 
              title={data.title || dict.INVOICE_TITLE}
              subtitle={`${dict.FOLIO}: ${data.folio || 'N/A'}`}
              rightText1={`${dict.DATE_ISSUED}: ${data.dateIssued || ''}`}
              rightText2={`${dict.DATE_DUE}: ${data.dateDue || ''}`}
            />
          </td>
        </tr>
      </thead>
      <tbody className="table-row-group">
        <tr>
          <td className="p-0 border-none align-top">
            <div className="font-sans text-sm px-[20mm] pb-[20mm]">

      {/* Entities */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-2 uppercase text-xs">{dict.FROM}</h3>
          <p className="font-bold">{data.fromName}</p>
          <p>RFC: {data.fromRfc}</p>
          <p className="whitespace-pre-line text-gray-600">{data.fromAddress}</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-2 uppercase text-xs">{dict.TO}</h3>
          <p className="font-bold">{data.toName}</p>
          <p>RFC: {data.toRfc}</p>
          {data.attentionTo && <p className="text-gray-600">{dict.ATTENTION}: {data.attentionTo}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12 text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-800 text-xs uppercase">
            <th className="py-2 px-3">{dict.QTY}</th>
            <th className="py-2 px-3">{dict.UNIT}</th>
            <th className="py-2 px-3 w-1/2">{dict.DESCRIPTION}</th>
            <th className="py-2 px-3 text-right">{dict.UNIT_PRICE}</th>
            <th className="py-2 px-3 text-right">{dict.TOTAL}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.items?.map((item, idx) => (
            <tr key={idx}>
              <td className="py-3 px-3">{item.qty}</td>
              <td className="py-3 px-3">{item.unit}</td>
              <td className="py-3 px-3 whitespace-pre-line">{item.description}</td>
              <td className="py-3 px-3 text-right font-mono">{item.price}</td>
              <td className="py-3 px-3 text-right font-mono">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64">
          <div className="flex justify-between py-1 text-gray-600">
            <span>{dict.SUBTOTAL}:</span>
            <span className="font-mono">{data.subtotal} {data.currency}</span>
          </div>
          <div className="flex justify-between py-1 text-gray-600 border-b border-gray-300">
            <span>{dict.TAXES}:</span>
            <span className="font-mono">{data.taxes} {data.currency}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold text-gray-900">
            <span>{dict.GRAND_TOTAL}:</span>
            <span className="font-mono">{data.grandTotal} {data.currency}</span>
          </div>
        </div>
      </div>

      {/* Payment instructions removed for contract signing */}

      {/* Footer Notes */}
      <div className="mt-auto text-xs text-gray-500 whitespace-pre-line text-center border-t border-gray-200 pt-4">
        {data.legalNotes}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
