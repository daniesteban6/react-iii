// Marco visual para cada ejemplo: título, archivo donde está el código y lo que hay que observar.
export default function Ejemplo({ titulo, archivo, observar, malo = false, children }) {
  return (
    <section
      className={
        "bg-white border rounded-lg p-5 space-y-3 " +
        (malo ? "border-l-4 border-l-red-600" : "border-l-4 border-l-emerald-600")
      }
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-bold text-lg">
          {malo ? "✖ " : "✔ "}
          {titulo}
        </h3>
        <code className="text-xs bg-slate-100 px-2 py-1 rounded">{archivo}</code>
      </div>
      {observar && <p className="text-sm text-slate-600">{observar}</p>}
      <div>{children}</div>
    </section>
  );
}
