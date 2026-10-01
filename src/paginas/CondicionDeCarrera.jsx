import { useEffect, useState } from "react";
import Ejemplo from "../componentes/Ejemplo";

const ARCHIVO = "src/paginas/CondicionDeCarrera.jsx";
const API = "https://rickandmortyapi.com/api";

// Espera un tiempo al azar para simular una red irregular.
// Si llega la señal de cancelar, se interrumpe con un AbortError, igual que fetch.
function esperar(ms, signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new DOMException("Petición cancelada", "AbortError"));
    });
  });
}

async function buscarPersonajes(nombre, signal) {
  await esperar(300 + Math.random() * 1700, signal); // entre 0,3 y 2 segundos
  const r = await fetch(`${API}/character?name=${encodeURIComponent(nombre)}`, { signal });
  if (r.status === 404) return [];
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()).results;
}

// ---------------------------------------------------------------
// ✖ Sin cancelar: gana la respuesta que llegue de última, no la más reciente
// ---------------------------------------------------------------
function BuscadorSinCancelar() {
  const [nombre, setNombre] = useState("");
  const [lista, setLista] = useState([]);
  const [mostrando, setMostrando] = useState("");

  useEffect(() => {
    async function buscar() {
      const resultados = await buscarPersonajes(nombre);
      console.log("✖ llegó la respuesta de:", JSON.stringify(nombre));
      setLista(resultados);
      setMostrando(nombre);
    }
    buscar();
  }, [nombre]);

  return <Buscador nombre={nombre} setNombre={setNombre} lista={lista} mostrando={mostrando} />;
}

// ---------------------------------------------------------------
// ✔ Con AbortController: la limpieza cancela la petición anterior
// ---------------------------------------------------------------
function BuscadorConCancelacion() {
  const [nombre, setNombre] = useState("");
  const [lista, setLista] = useState([]);
  const [mostrando, setMostrando] = useState("");

  useEffect(() => {
    const control = new AbortController();

    async function buscar() {
      try {
        const resultados = await buscarPersonajes(nombre, control.signal);
        console.log("✔ llegó la respuesta de:", JSON.stringify(nombre));
        setLista(resultados);
        setMostrando(nombre);
      } catch (e) {
        if (e.name === "AbortError") {
          console.log("✔ cancelada:", JSON.stringify(nombre));
        } else {
          console.error(e);
        }
      }
    }
    buscar();

    return () => control.abort(); // corre antes del siguiente efecto
  }, [nombre]);

  return <Buscador nombre={nombre} setNombre={setNombre} lista={lista} mostrando={mostrando} />;
}

function Buscador({ nombre, setNombre, lista, mostrando }) {
  const desfasado = nombre !== mostrando;
  return (
    <div className="space-y-3">
      <input
        className="w-full border rounded px-2 py-1"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Escribir rápido: rick"
      />
      <p className={"text-sm " + (desfasado ? "text-red-700 font-bold" : "text-slate-500")}>
        Buscador: «{nombre}» · Resultados de: «{mostrando}» {desfasado && "← no coinciden"}
      </p>
      <ul className="text-sm space-y-0.5 max-h-56 overflow-auto">
        {lista.slice(0, 12).map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
        {lista.length === 0 && <li className="text-slate-400">Sin resultados</li>}
      </ul>
    </div>
  );
}

export default function CondicionDeCarrera() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Condición de carrera</h2>
      <p className="text-sm text-slate-600">
        Cada búsqueda tarda un tiempo al azar entre 0,3 y 2 segundos, para que las respuestas
        lleguen en desorden sin tener que simular una red lenta. Escribir «rick» letra por letra
        en los dos buscadores y esperar a que todo termine.
      </p>
      <div className="grid md:grid-cols-2 gap-5">
        <Ejemplo
          malo
          titulo="Sin cancelar"
          archivo={ARCHIVO}
          observar="Con frecuencia el buscador dice «rick» y la lista es de «ri» o «r»: la respuesta vieja llegó de última y pisó a la nueva."
        >
          <BuscadorSinCancelar />
        </Ejemplo>
        <Ejemplo
          titulo="Con AbortController"
          archivo={ARCHIVO}
          observar="La lista siempre corresponde al texto del buscador. En la consola, las búsquedas viejas aparecen como canceladas."
        >
          <BuscadorConCancelacion />
        </Ejemplo>
      </div>
    </div>
  );
}
