export default function ConfiguracionPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Configuracion general</h1>
      <form className="elc-card mt-6 grid gap-4 p-5 md:grid-cols-2">
        <label className="text-sm">
          Nombre de la academia
          <input className="mt-1 w-full rounded-md border border-slate-300 p-2" defaultValue="The English Language Center - Las Flores - Masaya" />
        </label>
        <label className="text-sm">
          Telefono
          <input className="mt-1 w-full rounded-md border border-slate-300 p-2" defaultValue="+505 0000-0000" />
        </label>
        <label className="text-sm">
          Tarifa mensual
          <input className="mt-1 w-full rounded-md border border-slate-300 p-2" defaultValue="1200" />
        </label>
        <label className="text-sm">
          Tarifa semanal
          <input className="mt-1 w-full rounded-md border border-slate-300 p-2" defaultValue="350" />
        </label>
      </form>
    </main>
  );
}
