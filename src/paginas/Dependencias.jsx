import { useEffect, useState } from "react";
import Ejemplo from "../componentes/Ejemplo";
import Boton from "../componentes/Boton";

const ARCHIVO = "src/paginas/Dependencias.jsx";

// Dos contadores independientes para provocar renderizados y ver qué efectos se repiten
function useDosContadores() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const botones = (
    <div className="flex gap-2 items-center">
      <Boton onClick={() => setA((x) => x + 1)}>a + 1</Boton>
      <Boton onClick={() => setB((x) => x + 1)}>b + 1</Boton>
      <span className="text-sm">a = <b>{a}</b> · b = <b>{b}</b></span>
    </div>
  );
  return { a, b, botones };
}

// ---------------------------------------------------------------
// Las tres formas del array de dependencias
// ---------------------------------------------------------------
function SinArray() {
  const { botones } = useDosContadores();
  useEffect(() => {
    console.log("[sin array] corre después de CADA renderizado");
  });
  return botones;
}

function ArrayVacio() {
  const { botones } = useDosContadores();
  useEffect(() => {
    console.log("[ ] corre UNA vez, al aparecer");
  }, []);
  return botones;
}

function ConDependencia() {
  const { a, botones } = useDosContadores();
  useEffect(() => {
    console.log("[a] corre al aparecer y cuando cambia a. Ahora a =", a);
  }, [a]);
  return botones;
}

// ---------------------------------------------------------------
// ✖ El bucle infinito (con un freno en 50 para no colgar el navegador)
// ---------------------------------------------------------------
function BucleInfinito() {
  const [vueltas, setVueltas] = useState(0);

  useEffect(() => {
    // sin array: cada setVueltas provoca un renderizado, que vuelve a correr el efecto...
    if (vueltas < 50) setVueltas(vueltas + 1); // el "if" es solo el freno de la demo
  });

  return <p>El efecto se ha ejecutado <b>{vueltas}</b> veces sin que nadie hiciera clic.</p>;
}

function DemoBucle() {
  const [activo, setActivo] = useState(false);
  return (
    <div className="space-y-2">
      <Boton onClick={() => setActivo((x) => !x)}>{activo ? "Quitar" : "Montar"} el componente</Boton>
      {activo && <BucleInfinito />}
    </div>
  );
}

// ---------------------------------------------------------------
// ✖ / ✔ Un objeto nuevo en cada renderizado como dependencia
// ---------------------------------------------------------------
function ObjetoComoDependencia() {
  const { a, botones } = useDosContadores();
  const filtros = { pagina: a, limite: 20 }; // objeto NUEVO en cada renderizado

  useEffect(() => {
    console.log("✖ [filtros] corre aunque solo cambie b:", filtros);
  }, [filtros]);

  return botones;
}

function PrimitivoComoDependencia() {
  const { a, botones } = useDosContadores();

  useEffect(() => {
    const filtros = { pagina: a, limite: 20 }; // el objeto se crea DENTRO del efecto
    console.log("✔ [a] corre solo cuando cambia la página:", filtros);
  }, [a]);

  return botones;
}

export default function Dependencias() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Dependencias</h2>
      <p className="text-sm text-slate-600">Todos los ejemplos de esta página escriben en la consola. Hacer clic en «a + 1» y en «b + 1» y comparar.</p>
      <div className="grid md:grid-cols-3 gap-5">
        <Ejemplo titulo="useEffect(fn)" archivo={ARCHIVO} observar="Cualquier clic lo vuelve a ejecutar.">
          <SinArray />
        </Ejemplo>
        <Ejemplo titulo="useEffect(fn, [])" archivo={ARCHIVO} observar="Solo al aparecer (dos veces por StrictMode). Los clics no lo tocan.">
          <ArrayVacio />
        </Ejemplo>
        <Ejemplo titulo="useEffect(fn, [a])" archivo={ARCHIVO} observar="Responde a «a + 1» e ignora «b + 1».">
          <ConDependencia />
        </Ejemplo>
      </div>
      <Ejemplo
        malo
        titulo="El bucle infinito"
        archivo={ARCHIVO}
        observar="Un efecto sin array que cambia el estado se dispara solo, una y otra vez. Aquí se detiene en 50 porque el código tiene un freno; sin él, no pararía."
      >
        <DemoBucle />
      </Ejemplo>
      <div className="grid md:grid-cols-2 gap-5">
        <Ejemplo
          malo
          titulo="Objeto como dependencia"
          archivo={ARCHIVO}
          observar="«b + 1» no cambia la página, pero el efecto corre igual: filtros es un objeto nuevo en cada renderizado."
        >
          <ObjetoComoDependencia />
        </Ejemplo>
        <Ejemplo
          titulo="Objeto dentro del efecto"
          archivo={ARCHIVO}
          observar="Ahora «b + 1» no lo dispara. La dependencia es un número, que sí se compara por valor."
        >
          <PrimitivoComoDependencia />
        </Ejemplo>
      </div>
    </div>
  );
}
