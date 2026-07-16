"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Save } from 'lucide-react';
import { fetchProjects, fetchLmaasLeads, createDocument } from '@/lib/api';
import { DocumentPreview } from './templates/DocumentPreview';
import { InvoiceTemplate } from './templates/InvoiceTemplate';
import { MvpTemplate } from './templates/MvpTemplate';
import { RfqCustomTemplate } from './templates/RfqCustomTemplate';
import { RfqSaasTemplate } from './templates/RfqSaasTemplate';
import { RfqLmaasTemplate } from './templates/RfqLmaasTemplate';
import { EmailAccountsTemplate } from './templates/EmailAccountsTemplate';

type DocumentType = 'INVOICE' | 'MVP' | 'RFQ_CUSTOM' | 'RFQ_SAAS' | 'RFQ_LMAAS' | 'EMAIL_ACCOUNTS';
type Language = 'ES' | 'EN';

const DEFAULT_SCHEMAS: Record<DocumentType, any> = {
  INVOICE: {
    title: "Factura de Servicios",
    folio: "INV-001",
    dateIssued: "2026-07-13",
    dateDue: "2026-07-30",
    fromName: "LogikaMobile",
    fromRfc: "LOGM000000XXX",
    fromAddress: "Av. Principal 123",
    toName: "Nombre del Cliente",
    toRfc: "CLI000000XXX",
    attentionTo: "Contacto",
    items: [
      { qty: "1", unit: "Servicio", description: "Desarrollo de Software", price: "10,000", total: "10,000" }
    ],
    subtotal: "10,000",
    taxes: "1,600",
    grandTotal: "11,600",
    currency: "MXN",
    bank: "BBVA",
    accountName: "LogikaMobile",
    accountNumber: "0123456789",
    swift: "BBVAMXMM",
    legalNotes: "Pago a 30 días"
  },
  MVP: {
    projectName: "Nuevo Proyecto",
    clientName: "Empresa X",
    date: "2026-07-13",
    overview: "Visión general del producto y su impacto esperado...",
    backlog: ["Autenticación de Usuarios", "Panel de Control"],
    exclusions: ["Soporte 24/7 post-lanzamiento"],
    stack: "React, Node.js, PostgreSQL",
    sprints: "Sprint 1: Funcionalidad Base\nSprint 2: Refinamiento UI",
    criteria: "El sistema debe responder en menos de 200ms y ser 100% responsivo."
  },
  RFQ_CUSTOM: {
    projectName: "Desarrollo a la Medida",
    clientName: "Empresa X",
    date: "2026-07-13",
    context: "El cliente necesita modernizar su infraestructura actual...",
    solution: "Se propone el desarrollo de un sistema web integral...",
    timeline: "Desarrollo estimado en 4 meses (16 semanas).",
    deliverables: "1. Código fuente\n2. Manual de usuario",
    investment: "150,000",
    currency: "MXN"
  },
  RFQ_SAAS: {
    projectName: "Implementación SaaS CRM",
    clientName: "Empresa X",
    date: "2026-07-13",
    objective: "Centralizar la gestión de clientes usando nuestra plataforma SaaS.",
    setupFee: "15,000",
    licenseDetails: "Licencia básica para hasta 10 usuarios. Incluye actualizaciones.",
    licensePrice: "3,500",
    currency: "MXN",
    techConsiderations: "Hospedado en AWS con respaldos diarios.",
    legalDocs: "Sujeto a términos y condiciones del contrato de servicio SaaS."
  },
  RFQ_LMAAS: {
    projectName: "Equipo Extendida LMaaS",
    clientName: "Empresa X",
    date: "2026-07-13",
    objective: "Proveer capacidad de desarrollo continuo al equipo del cliente.",
    capacity: "1x Desarrollador Senior Full Stack\n0.5x Project Manager",
    retainerAmount: "60,000",
    currency: "MXN",
    onboardingFee: "0",
    sla: "Tiempo de respuesta para bugs críticos: 4 horas.",
    exitClause: "El cliente puede cancelar con 30 días de anticipación sin penalización."
  },
  EMAIL_ACCOUNTS: {
    date: "2026-07-16",
    clientName: "Clinvelt",
    introText: "Esta guía proporciona la información necesaria para configurar su cuenta de correo profesional impulsada por la infraestructura de LogikaMobile.",
    accounts: [
      {
        email: "contacto@clinvelt.com.mx",
        password: "Mexico40"
      }
    ],
    mobileSteps: [
      "Abra su aplicación de correo y seleccione Agregar Cuenta.",
      "Elija Otra.",
      "Ingrese su correo electrónico.",
      "Seleccione Personal (IMAP)",
      "Ingrese su contraseña.",
      "Cambie lo que esté en el campo Servidor por chocobo.mxrouting.net",
      "Cambie lo que esté en el campo SMTP por chocobo.mxrouting.net"
    ],
    webmailUrl: "https://chocobo.mxrouting.net/webmail/"
  }
};

export default function DocumentEditor() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [docType, setDocType] = useState<DocumentType>('INVOICE');
  const [language, setLanguage] = useState<Language>('ES');
  
  const [data, setData] = useState<any>(DEFAULT_SCHEMAS['INVOICE']);
  const [jsonText, setJsonText] = useState(JSON.stringify(DEFAULT_SCHEMAS['INVOICE'], null, 2));

  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects().then(setProjects).catch(console.error);
    fetchLmaasLeads().then(setLeads).catch(console.error);
  }, []);

  const handleDocTypeChange = (newType: DocumentType) => {
    setDocType(newType);
    setData(DEFAULT_SCHEMAS[newType]);
    setJsonText(JSON.stringify(DEFAULT_SCHEMAS[newType], null, 2));
  };

  // Sync jsonText when docType changes if you wanted, but for now just basic text handling

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSaveToDb = async () => {
    if (!selectedEntity) return;
    setIsSaving(true);
    try {
      const isProject = selectedEntity.startsWith('PROJECT_');
      const id = selectedEntity.split('_')[1];
      
      await createDocument({
        type: docType,
        language: language,
        data: data,
        projectId: isProject ? id : null,
        leadId: !isProject ? id : null
      });
      
      alert("¡Documento guardado exitosamente!");
    } catch (error) {
      alert("Error al guardar el documento");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `LogikaMobile_${docType}_${new Date().getTime()}`,
  });

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar / Editor */}
      <div className="w-1/3 bg-[#111111] border-r border-panel-border p-6 overflow-y-auto text-white">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-widest uppercase">EDITOR_DOCS</h2>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-brand-orange mb-1 uppercase tracking-widest">ANCLAR A PROYECTO / LEAD</label>
            <select 
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full rounded bg-black border border-brand-orange text-white p-2 focus:ring-1 focus:ring-brand-orange outline-none"
            >
              <option value="">-- Seleccionar (Requerido) --</option>
              <optgroup label="Proyectos">
                {projects.map(p => <option key={p.id} value={`PROJECT_${p.id}`}>{p.companyName} - {p.projectName || 'Sin nombre'}</option>)}
              </optgroup>
              <optgroup label="Leads LMaaS">
                {leads.map(l => <option key={l.id} value={`LEAD_${l.id}`}>{l.companyName}</option>)}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">TIPO_DOCUMENTO</label>
            <select 
              value={docType}
              onChange={(e) => handleDocTypeChange(e.target.value as DocumentType)}
              className="w-full rounded bg-black border border-panel-border text-white p-2 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
            >
              <option value="INVOICE">Factura / Recibo</option>
              <option value="MVP">Visión MVP</option>
              <option value="RFQ_CUSTOM">Propuesta: Desarrollo a la Medida</option>
              <option value="RFQ_SAAS">Propuesta: SaaS</option>
              <option value="RFQ_LMAAS">Propuesta: LMaaS</option>
              <option value="EMAIL_ACCOUNTS">Guía: Cuentas de Correo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">IDIOMA</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full rounded bg-black border border-panel-border text-white p-2 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
            >
              <option value="ES">Español</option>
              <option value="EN">English</option>
            </select>
          </div>
        </div>

        <hr className="mb-6" />

        {/* Dynamic Form based on Type */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">DATOS DEL DOCUMENTO (JSON)</label>
            <p className="text-xs text-gray-500 mb-2">Edita cualquier campo del documento aquí en formato JSON.</p>
            <textarea 
              rows={20}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                try {
                  const parsed = JSON.parse(e.target.value);
                  setData(parsed);
                } catch (err) {
                  // ignore parse errors while typing
                }
              }}
              className="w-full rounded bg-black border border-panel-border text-brand-cyan p-3 font-mono text-xs focus:border-brand-orange outline-none"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-panel-border flex space-x-4">
          <button 
            onClick={handleSaveToDb}
            disabled={!selectedEntity || isSaving}
            className={`flex-1 bg-black border border-white/20 text-white py-2 px-4 rounded uppercase font-bold tracking-wider text-xs flex justify-center items-center transition-colors ${!selectedEntity || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
          >
            <Save className="w-4 h-4 mr-2" /> {isSaving ? 'GUARDANDO...' : 'GUARDAR'}
          </button>

          <button 
            onClick={() => handlePrint()} 
            disabled={!selectedEntity}
            className={`flex-1 bg-brand-orange text-black py-2 px-4 rounded uppercase font-bold tracking-wider text-xs flex justify-center items-center transition-colors ${!selectedEntity ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'}`}
          >
            <Printer className="w-4 h-4 mr-2" /> PDF
          </button>
        </div>
      </div>

      {/* Preview Area (A4) */}
      <div className="w-2/3 bg-gray-100 overflow-y-auto">
      <DocumentPreview ref={componentRef}>
          {docType === 'INVOICE' && <InvoiceTemplate language={language} data={data} />}
          {docType === 'MVP' && <MvpTemplate language={language} data={data} />}
          {docType === 'RFQ_CUSTOM' && <RfqCustomTemplate language={language} data={data} />}
          {docType === 'RFQ_SAAS' && <RfqSaasTemplate language={language} data={data} />}
          {docType === 'RFQ_LMAAS' && <RfqLmaasTemplate language={language} data={data} />}
          {docType === 'EMAIL_ACCOUNTS' && <EmailAccountsTemplate language={language} data={data} />}
        </DocumentPreview>
      </div>
    </div>
  );
}
