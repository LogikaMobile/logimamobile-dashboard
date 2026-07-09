"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import SearchableSelect, { Option } from "../ui/SearchableSelect";

type Epic = {
  id: string;
  title: string;
};

type Issue = {
  id: string;
  type: string;
  parentId?: string;
  epicId?: string;
  title: string;
  technicalDescription?: string;
  fibonacciScore?: number;
  estimatedHours?: number;
};

type Project = {
  id: string;
  companyName: string;
  projectName?: string;
};

interface CreateIssueModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Issue;
}

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21];

export default function CreateIssueModal({ onClose, onSuccess, initialData }: CreateIssueModalProps) {
  const [type, setType] = useState<"EPIC" | "USER_STORY" | "TASK" | "SUBTASK">((initialData?.type as any) || "EPIC");
  
  // Data
  const [epics, setEpics] = useState<Epic[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Form Fields
  const [parentId, setParentId] = useState(initialData?.parentId || "");
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.technicalDescription || "");
  const [fibonacciScore, setFibonacciScore] = useState<number | "">(initialData?.fibonacciScore || "");
  const [estimatedHours, setEstimatedHours] = useState<number | "">(initialData?.estimatedHours || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const [epicsRes, issuesRes, projectsRes] = await Promise.all([
          fetch(`${apiUrl}/api/board/epics`),
          fetch(`${apiUrl}/api/board/issues`),
          fetch(`${apiUrl}/projects`)
        ]);
        if (epicsRes.ok) setEpics(await epicsRes.json());
        if (issuesRes.ok) setIssues(await issuesRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());
      } catch (e) {
        console.error("Error fetching dependencies", e);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!title.trim()) {
      setError("El título es obligatorio.");
      setIsSubmitting(false);
      return;
    }
    if (type !== "EPIC" && !parentId) {
      setError("Debes seleccionar un ticket padre.");
      setIsSubmitting(false);
      return;
    }
    if (type === "EPIC" && !projectId) {
      setError("Debes asignar la Épica a un proyecto.");
      setIsSubmitting(false);
      return;
    }
    if (type === "TASK" || type === "SUBTASK") {
      if (estimatedHours === "" || Number(estimatedHours) <= 0) {
        setError("Las horas estimadas son obligatorias para tareas y subtareas.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      const session = await getSession();
      const userId = session?.user?.id;

      if (type === "EPIC") {
        const res = await fetch(`${apiUrl}/api/board/epics`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(userId ? { 'X-User-Id': userId } : {})
          },
          body: JSON.stringify({
            title,
            description,
            legacyProjectId: projectId
          })
        });
        if (!res.ok) throw new Error("Error creando Épica");
      } else {
        const payload = {
          type,
          title,
          technicalDescription: description,
          epicId: type === "USER_STORY" ? parentId : undefined,
          parentId: type === "TASK" || type === "SUBTASK" ? parentId : undefined,
          fibonacciScore: type === "USER_STORY" && fibonacciScore !== "" ? Number(fibonacciScore) : undefined,
          estimatedHours: (type === "TASK" || type === "SUBTASK") && estimatedHours !== "" ? Number(estimatedHours) : 0
        };

        const method = initialData ? 'PUT' : 'POST';
        const url = initialData ? `${apiUrl}/api/board/issues/${initialData.id}` : `${apiUrl}/api/board/issues`;

        const res = await fetch(url, {
          method,
          headers: { 
            'Content-Type': 'application/json',
            ...(userId ? { 'X-User-Id': userId } : {})
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(initialData ? "Error editando Ticket" : "Error creando Ticket");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  let parentOptions: Option[] = [];
  if (type === "USER_STORY") {
    parentOptions = epics.map(e => ({ value: e.id, label: e.title }));
  } else if (type === "TASK") {
    parentOptions = issues.filter(i => i.type === "USER_STORY").map(i => ({ value: i.id, label: `[HU] ${i.title}` }));
  } else if (type === "SUBTASK") {
    parentOptions = issues.filter(i => i.type === "TASK").map(i => ({ value: i.id, label: `[TASK] ${i.title}` }));
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-[#111111] border border-white/20 w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-white/20 flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">{initialData ? "EDITAR TICKET" : "NUEVO TICKET"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-6 text-sm">{error}</div>}

          <form id="issue-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex gap-2 p-1 bg-black border border-white/20 rounded">
              {[
                { value: "EPIC", label: "ÉPICA" },
                { value: "USER_STORY", label: "HISTORIA DE USUARIO" },
                { value: "TASK", label: "TAREA" },
                { value: "SUBTASK", label: "SUBTAREA" }
              ].map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    if (!initialData) {
                      setType(t.value as any);
                      setParentId("");
                      setProjectId("");
                    }
                  }}
                  className={`flex-1 py-2 text-xs font-bold tracking-widest transition-colors ${
                    type === t.value ? "bg-white text-black" : "text-gray-500 hover:text-white"
                  } ${initialData && type !== t ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!!initialData}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {type === "EPIC" && (
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Proyecto Padre *</label>
                <SearchableSelect 
                  options={projects.map(p => ({ value: p.id, label: p.projectName ? `${p.companyName} - ${p.projectName}` : p.companyName }))} 
                  value={projectId} 
                  onChange={setProjectId} 
                  placeholder="Buscar y seleccionar proyecto..."
                />
              </div>
            )}

            {/* PARENT SELECTOR */}
            {type !== "EPIC" && (
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
                  {type === "USER_STORY" ? "Épica Padre *" : type === "TASK" ? "HU Padre *" : "Tarea Padre *"}
                </label>
                <SearchableSelect 
                  options={parentOptions} 
                  value={parentId} 
                  onChange={setParentId} 
                  placeholder="Buscar y seleccionar..."
                />
              </div>
            )}

            {/* TITLE */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Título *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white"
                placeholder="Ej. Integrar pasarela de pagos"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
                {type === "EPIC" ? "Descripción General" : type === "USER_STORY" ? "Criterios de Aceptación (Valor de Negocio)" : "Descripción Técnica"}
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white min-h-[120px]"
                placeholder="Detalles..."
              />
            </div>

            {/* FIBONACCI ONLY FOR HU */}
            {type === "USER_STORY" && (
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Puntuación de Esfuerzo</label>
                <div className="flex gap-2">
                  {FIBONACCI.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFibonacciScore(val)}
                      className={`w-10 h-10 border transition-colors flex items-center justify-center font-bold ${
                        fibonacciScore === val ? "bg-white text-black border-white" : "border-white/20 text-gray-400 hover:border-white hover:text-white"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFibonacciScore("")}
                    className="ml-4 text-xs text-gray-500 hover:text-white underline"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}

            {/* HOURS FOR TASK/SUBTASK */}
            {(type === "TASK" || type === "SUBTASK") && (
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Horas Estimadas *</label>
                <input
                  type="number"
                  min="1"
                  value={estimatedHours}
                  onChange={e => setEstimatedHours(e.target.value ? Number(e.target.value) : "")}
                  className="w-32 bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white text-center"
                  placeholder="0"
                />
              </div>
            )}
            
          </form>
        </div>

        <div className="p-4 border-t border-white/20 bg-black flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white uppercase tracking-widest text-sm font-bold"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="issue-form"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-white text-black uppercase tracking-widest text-sm font-bold transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
            }`}
          >
            {isSubmitting ? "Guardando..." : "Crear Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
