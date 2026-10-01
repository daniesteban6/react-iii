import { useEffect, useState } from "react";
import Ejemplo from "../componentes/Ejemplo";
import Boton from "../componentes/Boton";

const ARCHIVO = "src/paginas/DatosRemotos.jsx";
const API = "https://rickandmortyapi.com/api";

// ---------------------------------------------------------------
// ✖ fetch en el cuerpo del componente
// ---------------------------------------------------------------
let peticionesHechas = 0; // fuera del componente, solo para contar en la demo

function FetchEnElCuerpo() {
  const [lista, setLista] = useState([]);

  // Se ejecuta en CADA renderizado. Cada respuesta llama a setLista,
  // que provoca otro renderizado, que lanza otra petición...
  if (peticionesHechas < 10) { // freno de la demo; sin él no pararía
    peticionesHechas++;
    fetch(`${API}/character`)
      .then((r) => r.json())
      .then((d) => setLista(d.results));
  }

  return (
    <p>
      Personajes: <b>{lista.length}</b> · Peticiones lanzadas: <b>{peticionesHechas}</b> (mirar
      la pestaña Network)
    </p>
  );
}

function DemoFetchEnElCuerpo() {
  const [activo, setActivo] = useState(false);
  return (
    <div className="space-y-2">
      <Boton
        onClick={() => {
          peticionesHechas = 0;
          setActivo((x) => !x);
        }}
      >
        {activo ? "Quitar" : "Montar"} el componente
      </Boton>
      {activo && <FetchEnElCuerpo />}
    </div>
  );
}

// ---------------------------------------------------------------
// ✔ fetch en un efecto, con cargando, error y datos
// ---------------------------------------------------------------
const URLS = {
  correcta: `${API}/character`,
  "nombre inexistente (404)": `${API}/character?name=zzzzzz`,
  "dominio que no existe": "https://api-que-no-existe.invalid/character",
};

function Personajes({ url, revisarOk }) {
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // la función del efecto no puede ser async: se declara una adentro y se llama
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const r = await fetch(url);
        console.log("respuesta", r.status, r.ok);
        if (revisarOk && !r.ok) {
          // un 404 no rechaza la promesa: hay que revisarlo a mano
          if (r.status === 404) {
            setLista([]);
            return;
          }
          throw new Error(`HTTP ${r.status}`);
        }
        const datos = await r.json();
        setLista(datos.results); // sin revisar r.ok, en un 404 esto es undefined
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [url, revisarOk]);

  if (cargando) return <p className="text-slate-500">Cargando…</p>;
  if (error) return <p className="text-red-700">Error: {error}</p>;
  if (!lista) return <p className="text-red-700">lista es {String(lista)}: la app se rompería al hacer lista.map</p>;
  if (lista.length === 0) return <p className="text-slate-500">Sin resultados.</p>;

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {lista.slice(0, 8).map((p) => (
        <li key={p.id} className="border rounded overflow-hidden text-sm">
          <img src={p.image} alt={p.name} className="w-full" />
          <p className="p-2 font-bold">{p.name}</p>
        </li>
      ))}
    </ul>
  );
}

function DemoPersonajes() {
  const [opcion, setOpcion] = useState("correcta");
  const [revisarOk, setRevisarOk] = useState(true);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 items-center text-sm">
        <label>
          URL:{" "}
          <select className="border rounded px-2 py-1" value={opcion} onChange={(e) => setOpcion(e.target.value)}>
            {Object.keys(URLS).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={revisarOk} onChange={(e) => setRevisarOk(e.target.checked)} />
          revisar <code>r.ok</code>
        </label>
      </div>
      <code className="block text-xs text-slate-500">{URLS[opcion]}</code>
      <Personajes url={URLS[opcion]} revisarOk={revisarOk} />
    </div>
  );
}

export default function DatosRemotos() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Datos remotos</h2>
      <Ejemplo
        malo
        titulo="fetch en el cuerpo del componente"
        archivo={ARCHIVO}
        observar="Al montarlo, la pestaña Network se llena de peticiones idénticas. Aquí se detiene en 10 por el freno del código."
      >
        <DemoFetchEnElCuerpo />
      </Ejemplo>
      <Ejemplo
        titulo="fetch en un efecto: cargando, error y datos"
        archivo={ARCHIVO}
        observar="Probar las tres URL. Con «nombre inexistente», quitar la casilla de r.ok: fetch no lanza error con un 404, y sin revisarlo la lista queda en undefined. El dominio inexistente sí lanza error, porque no hubo respuesta."
      >
        <DemoPersonajes />
      </Ejemplo>
    </div>
  );
}
