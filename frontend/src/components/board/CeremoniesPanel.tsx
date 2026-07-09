"use client";

export default function CeremoniesPanel() {
  return (
    <div className="font-mono text-white p-4 border border-white/20 bg-[#111111]">
      <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">Ceremonies Panel</h2>
      <p className="text-gray-400 text-sm">
        Esta vista filtrará el tablero para mostrar únicamente las columnas de [Sprint Backlog], [Desarrollo] y [QA] por proyecto.
        Aquí se podrán agregar comentarios y cambiar puntuaciones de Historias de Usuario.
      </p>
    </div>
  );
}
