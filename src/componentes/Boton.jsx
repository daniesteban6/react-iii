export default function Boton({ children, ...props }) {
  return (
    <button
      className="px-3 py-1.5 rounded bg-slate-800 text-white text-sm hover:bg-slate-700 disabled:opacity-40"
      {...props}
    >
      {children}
    </button>
  );
}
