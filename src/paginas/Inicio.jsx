export default function Inicio() {
  return (
    <div className="space-y-4 max-w-3xl">
      <h2 className="text-xl font-bold">Ejemplos de la clase</h2>
      <p>
        Cada pestaña es una página con los ejemplos de un bloque. El código está en{" "}
        <code className="bg-slate-100 px-1 rounded">src/paginas/</code>, un archivo por pestaña.
        Las tarjetas con borde rojo muestran la versión con el error; las de borde verde, la
        corregida.
      </p>
      <p>
        Casi todos los ejemplos escriben en la consola. Conviene tener abierto DevTools (F12) en
        las pestañas <b>Console</b> y <b>Network</b> mientras se prueban.
      </p>
      <ul className="list-disc ml-6 space-y-1 text-sm">
        <li><b>Qué es un efecto:</b> guardar en localStorage y cambiar el título de la pestaña.</li>
        <li><b>Dependencias:</b> sin array, con array vacío, con valores, y el objeto nuevo en cada renderizado.</li>
        <li><b>Limpieza:</b> el reloj que se multiplica y el que se limpia.</li>
        <li><b>Datos remotos:</b> fetch con cargando, error y datos, y el 404 que no es excepción.</li>
        <li><b>Condición de carrera:</b> el buscador que muestra resultados viejos, y AbortController.</li>
      </ul>
      <p className="text-sm text-slate-500">
        En <code>main.jsx</code> está activado <code>StrictMode</code>: en desarrollo cada efecto
        se monta, se limpia y se vuelve a montar. Por eso algunos mensajes salen dos veces.
      </p>
    </div>
  );
}
