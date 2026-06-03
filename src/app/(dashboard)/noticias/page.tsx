export default function NoticiasAdminPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Gestion de noticias</h1>
      <div className="elc-card mt-6 p-5">
        <p className="text-sm text-slate-600">
          Este modulo queda preparado para crear, editar y publicar noticias con categorias: NOTICIA, EVENTO, COMUNICADO y LOGRO.
        </p>
        <button className="mt-4 rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white">Crear noticia</button>
      </div>
    </main>
  );
}
