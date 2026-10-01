import { useEffect, useState } from "react";
import Ejemplo from "../componentes/Ejemplo";
import Boton from "../componentes/Boton";

const ARCHIVO = "src/paginas/Limpieza.jsx";

// ---------------------------------------------------------------
// ✖ Reloj sin limpieza: el intervalo sobrevive al componente
// ---------------------------------------------------------------
function RelojSinLimpieza() {
  const [hora, setHora] = useState(() => new Date());

  useEffect(() => {
    setInterval(() => {
      setHora(new Date());
      console.log("✖ tic (sin limpieza)");
    }, 1000);
  }, []);

  return <p className="text-3xl font-mono">{hora.toLocaleTimeString()}</p>;
}

// ---------------------------------------------------------------
// ✔ Reloj con limpieza: cada efecto que arranca algo devuelve cómo detenerlo
// ---------------------------------------------------------------
function RelojConLimpieza() {
  const [hora, setHora] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setHora(new Date());
      console.log("✔ tic (con limpieza)");
    }, 1000);

    return () => {
      console.log("✔ limpieza: clearInterval", id);
      clearInterval(id);
    };
  }, []);

  return <p className="text-3xl font-mono">{hora.toLocaleTimeString()}</p>;
}

// ---------------------------------------------------------------
// ✔ Otro caso típico: un listener en window
// ---------------------------------------------------------------
function AnchoVentana() {
  const [ancho, setAncho] = useState(window.innerWidth);

  useEffect(() => {
    function alCambiar() {
      setAncho(window.innerWidth);
    }
    window.addEventListener("resize", alCambiar);
    return () => window.removeEventListener("resize", alCambiar);
  }, []);

  return <p>La ventana mide <b>{ancho}px</b> de ancho. Cambiar el tamaño del navegador.</p>;
}

// Botón para montar y desmontar un componente
function Alternar({ children }) {
  const [visible, setVisible] = useState(true);
  return (
    <div className="space-y-3">
      <Boton onClick={() => setVisible((v) => !v)}>{visible ? "Ocultar" : "Mostrar"}</Boton>
      {visible ? children : <p className="text-sm text-slate-400">(componente desmontado)</p>}
    </div>
  );
}

export default function Limpieza() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Limpieza</h2>
      <div className="grid md:grid-cols-2 gap-5">
        <Ejemplo
          malo
          titulo="Reloj sin limpieza"
          archivo={ARCHIVO}
          observar="Ocultar y mostrar varias veces mirando la consola: los «tic» siguen aunque el reloj no esté, y se multiplican. Con StrictMode ya arranca con dos."
        >
          <Alternar>
            <RelojSinLimpieza />
          </Alternar>
        </Ejemplo>
        <Ejemplo
          titulo="Reloj con limpieza"
          archivo={ARCHIVO}
          observar="Al ocultar se ve la limpieza en la consola y los «tic» se detienen. Siempre hay un solo intervalo vivo."
        >
          <Alternar>
            <RelojConLimpieza />
          </Alternar>
        </Ejemplo>
      </div>
      <Ejemplo titulo="addEventListener y removeEventListener" archivo={ARCHIVO}>
        <Alternar>
          <AnchoVentana />
        </Alternar>
      </Ejemplo>
      <p className="text-sm text-slate-500">
        Nota: los intervalos del reloj sin limpieza siguen vivos hasta recargar la página, incluso
        si se cambia de pestaña aquí arriba.
      </p>
    </div>
  );
}
