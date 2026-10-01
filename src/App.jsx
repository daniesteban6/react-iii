import { useEffect, useState } from "react";
import Inicio from "./paginas/Inicio";
import QueEsUnEfecto from "./paginas/QueEsUnEfecto";
import Dependencias from "./paginas/Dependencias";
import Limpieza from "./paginas/Limpieza";
import DatosRemotos from "./paginas/DatosRemotos";
import CondicionDeCarrera from "./paginas/CondicionDeCarrera";

// Cada página es un ejemplo de la clase. La clave es la que aparece en la URL (#clave).
const PAGINAS = [
  { clave: "inicio", titulo: "Inicio", Componente: Inicio },
  { clave: "efecto", titulo: "1 · Qué es un efecto", Componente: QueEsUnEfecto },
  { clave: "dependencias", titulo: "2 · Dependencias", Componente: Dependencias },
  { clave: "limpieza", titulo: "3 · Limpieza", Componente: Limpieza },
  { clave: "datos", titulo: "4 · Datos remotos", Componente: DatosRemotos },
  { clave: "carrera", titulo: "5 · Condición de carrera", Componente: CondicionDeCarrera },
];

function leerHash() {
  return window.location.hash.replace("#", "") || "inicio";
}

export default function App() {
  const [actual, setActual] = useState(leerHash);

  // Un efecto de verdad: mantiene la URL sincronizada con la página elegida,
  // así al recargar se vuelve a la misma página.
  useEffect(() => {
    window.location.hash = actual;
  }, [actual]);

  // Y al revés: si cambia la URL (botón atrás, o se escribe a mano), cambia la página.
  // Es un listener en window, así que lleva su limpieza.
  useEffect(() => {
    const alCambiarHash = () => setActual(leerHash());
    window.addEventListener("hashchange", alCambiarHash);
    return () => window.removeEventListener("hashchange", alCambiarHash);
  }, []);

  const pagina = PAGINAS.find((p) => p.clave === actual) ?? PAGINAS[0];
  const { Componente } = pagina;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-red-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <p className="text-sm text-red-200">Programación Web · UFPS</p>
          <h1 className="text-2xl font-bold">React III · Efectos y datos remotos</h1>
        </div>
        <nav className="max-w-5xl mx-auto px-6 flex flex-wrap gap-1">
          {PAGINAS.map((p) => (
            <button
              key={p.clave}
              onClick={() => setActual(p.clave)}
              className={
                "px-3 py-2 text-sm rounded-t " +
                (p.clave === pagina.clave
                  ? "bg-slate-50 text-red-800 font-bold"
                  : "text-red-100 hover:bg-red-700")
              }
            >
              {p.titulo}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Componente />
      </main>
    </div>
  );
}
