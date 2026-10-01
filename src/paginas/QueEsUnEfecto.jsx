import { useEffect, useState } from "react";
import Ejemplo from "../componentes/Ejemplo";
import Boton from "../componentes/Boton";

const ARCHIVO = "src/paginas/QueEsUnEfecto.jsx";

// ---------------------------------------------------------------
// ✖ Versión repetida: cada manejador tiene que acordarse de guardar
// ---------------------------------------------------------------
function NotasRepetidas() {
  const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem("notas-a") ?? "[]"));
  const [texto, setTexto] = useState("");

  function agregar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    const nuevas = [...notas, { id: crypto.randomUUID(), texto }];
    setNotas(nuevas);
    localStorage.setItem("notas-a", JSON.stringify(nuevas)); // se repite aquí...
    setTexto("");
  }

  function eliminar(id) {
    const nuevas = notas.filter((n) => n.id !== id);
    setNotas(nuevas);
    // ...y aquí se olvidó: al recargar, la nota borrada vuelve a aparecer
  }

  return <ListaNotas notas={notas} texto={texto} setTexto={setTexto} onAgregar={agregar} onEliminar={eliminar} />;
}

// ---------------------------------------------------------------
// ✔ Con efecto: "cada vez que notas cambie, guárdalas"
// ---------------------------------------------------------------
function NotasConEfecto() {
  // leer: una sola vez, con el inicializador perezoso de useState
  const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem("notas-b") ?? "[]"));
  const [texto, setTexto] = useState("");

  // guardar: después de cada renderizado en que notas haya cambiado
  useEffect(() => {
    console.log("efecto: guardando", notas.length, "notas");
    localStorage.setItem("notas-b", JSON.stringify(notas));
  }, [notas]);

  // otro efecto, otra responsabilidad: el título de la pestaña
  useEffect(() => {
    document.title = `(${notas.length}) Notas`;
  }, [notas.length]);

  function agregar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setNotas((prev) => [...prev, { id: crypto.randomUUID(), texto }]);
    setTexto("");
  }

  function eliminar(id) {
    setNotas((prev) => prev.filter((n) => n.id !== id)); // no hay que acordarse de nada
  }

  return <ListaNotas notas={notas} texto={texto} setTexto={setTexto} onAgregar={agregar} onEliminar={eliminar} />;
}

// Componente de presentación compartido por los dos ejemplos
function ListaNotas({ notas, texto, setTexto, onAgregar, onEliminar }) {
  return (
    <div className="space-y-2">
      <form onSubmit={onAgregar} className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Nueva nota"
        />
        <Boton>Agregar</Boton>
      </form>
      {notas.length === 0 && <p className="text-sm text-slate-500">No hay notas.</p>}
      <ul className="space-y-1">
        {notas.map((n) => (
          <li key={n.id} className="flex justify-between border rounded px-2 py-1 text-sm">
            {n.texto}
            <button className="text-red-700 text-xs" onClick={() => onEliminar(n.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------
// ✖ / ✔ Lo que NO necesita efecto: un valor que se calcula
// ---------------------------------------------------------------
function ContadorConEfectoDeMas() {
  const [n, setN] = useState(0);
  const [doble, setDoble] = useState(0);

  // ✖ estado extra + efecto para mantenerlo: un renderizado de más y una fuente de verdad duplicada
  useEffect(() => {
    setDoble(n * 2);
  }, [n]);

  return <Contador n={n} setN={setN} doble={doble} />;
}

function ContadorDerivado() {
  const [n, setN] = useState(0);
  const doble = n * 2; // ✔ se calcula en el renderizado, sin estado ni efecto
  return <Contador n={n} setN={setN} doble={doble} />;
}

function Contador({ n, setN, doble }) {
  console.log("render Contador", { n, doble });
  return (
    <div className="flex items-center gap-3">
      <Boton onClick={() => setN((x) => x + 1)}>+1</Boton>
      <span>n = <b>{n}</b></span>
      <span>doble = <b>{doble}</b></span>
    </div>
  );
}

export default function QueEsUnEfecto() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Qué es un efecto</h2>
      <div className="grid md:grid-cols-2 gap-5">
        <Ejemplo
          malo
          titulo="Guardar en cada manejador"
          archivo={ARCHIVO}
          observar="Agregar dos notas, eliminar una y recargar la página: la eliminada vuelve, porque eliminar() olvidó guardar."
        >
          <NotasRepetidas />
        </Ejemplo>
        <Ejemplo
          titulo="Guardar con useEffect"
          archivo={ARCHIVO}
          observar="Mismo ejercicio: al recargar todo queda como se dejó. Mirar también el título de la pestaña del navegador."
        >
          <NotasConEfecto />
        </Ejemplo>
        <Ejemplo
          malo
          titulo="Efecto para un valor calculado"
          archivo={ARCHIVO}
          observar="En la consola, cada clic produce dos renderizados: uno con el doble viejo y otro corregido por el efecto."
        >
          <ContadorConEfectoDeMas />
        </Ejemplo>
        <Ejemplo
          titulo="Valor derivado, sin efecto"
          archivo={ARCHIVO}
          observar="Un solo renderizado por clic, y el doble nunca está desfasado."
        >
          <ContadorDerivado />
        </Ejemplo>
      </div>
    </div>
  );
}
