"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProductoAdmin {
  asin: string;
  nombre: string;
  categoria: string;
  precio: number;
  precioMax?: number;
  activo?: boolean;
  notaTecnica: string;
  idealPara?: string;
}

type Cambios = Partial<Pick<ProductoAdmin, "precio" | "activo" | "notaTecnica" | "idealPara">>;

export default function AdminPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch("/api/admin/productos")
      .then((r) => r.json())
      .then((datos) => setProductos(datos.productos ?? []))
      .finally(() => setCargando(false));
  }, []);

  async function cerrarSesion() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function guardarCambios(asin: string, cambios: Cambios) {
    setGuardando(true);
    setMensaje(null);
    try {
      const respuesta = await fetch(`/api/admin/productos/${asin}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        setMensaje({ tipo: "error", texto: datos.error ?? "No se pudo guardar." });
        return;
      }
      setProductos((prev) => prev.map((p) => (p.asin === asin ? { ...p, ...cambios } : p)));
      setEditando(null);
      setMensaje({ tipo: "ok", texto: "Guardado. El sitio se va a actualizar solo en 1-2 minutos." });
    } catch {
      setMensaje({ tipo: "error", texto: "No se pudo conectar con el servidor." });
    } finally {
      setGuardando(false);
    }
  }

  const productosFiltrados = productos.filter((p) =>
    `${p.nombre} ${p.asin}`.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-light">Panel de productos</h1>
        <button
          onClick={cerrarSesion}
          className="whitespace-nowrap rounded-full border border-line-dim px-4 py-2 text-xs font-semibold text-text-dim hover:text-text-light"
        >
          Cerrar sesión
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o ASIN..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mt-6 w-full rounded-xl border border-line-dim bg-ink-2 px-4 py-3 text-sm text-text-light placeholder:text-text-dim/60 focus:border-line focus:outline-none"
      />

      {mensaje && (
        <p className={`mt-4 text-sm ${mensaje.tipo === "ok" ? "text-accent" : "text-red-400"}`}>
          {mensaje.texto}
        </p>
      )}

      {cargando ? (
        <p className="mt-8 text-sm text-text-dim">Cargando...</p>
      ) : (
        <div className="mt-6 space-y-3">
          {productosFiltrados.map((producto) => (
            <FilaProducto
              key={producto.asin}
              producto={producto}
              editando={editando === producto.asin}
              guardando={guardando}
              onEditar={() => setEditando(producto.asin)}
              onCancelar={() => setEditando(null)}
              onGuardar={(cambios) => guardarCambios(producto.asin, cambios)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilaProducto({
  producto,
  editando,
  guardando,
  onEditar,
  onCancelar,
  onGuardar,
}: {
  producto: ProductoAdmin;
  editando: boolean;
  guardando: boolean;
  onEditar: () => void;
  onCancelar: () => void;
  onGuardar: (cambios: Cambios) => void;
}) {
  const [precio, setPrecio] = useState(String(producto.precio));
  const [activo, setActivo] = useState(producto.activo !== false);
  const [notaTecnica, setNotaTecnica] = useState(producto.notaTecnica);
  const [idealPara, setIdealPara] = useState(producto.idealPara ?? "");

  if (!editando) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-line-dim bg-ink-2 p-4">
        <div>
          <p className="text-sm font-bold text-text-light">{producto.nombre}</p>
          <p className="text-xs text-text-dim">
            {producto.asin} · {producto.categoria} · ${producto.precio}
            {producto.activo === false && <span className="ml-2 font-semibold text-red-400">PAUSADO</span>}
          </p>
        </div>
        <button
          onClick={onEditar}
          className="whitespace-nowrap rounded-full bg-line-dim px-3 py-1.5 text-xs font-semibold text-text-light hover:bg-line-dim/70"
        >
          Editar
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-ink-2 p-4">
      <p className="text-sm font-bold text-text-light">{producto.nombre}</p>
      <p className="text-xs text-text-dim">{producto.asin}</p>

      <div className="mt-3 flex flex-col gap-3">
        <label className="text-xs text-text-dim">
          Precio
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        <label className="flex items-center gap-2 text-xs text-text-dim">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="h-4 w-4"
          />
          Activo (visible en el sitio)
        </label>

        <label className="text-xs text-text-dim">
          Ideal para
          <textarea
            value={idealPara}
            onChange={(e) => setIdealPara(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        <label className="text-xs text-text-dim">
          Nota técnica
          <textarea
            value={notaTecnica}
            onChange={(e) => setNotaTecnica(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        <div className="flex gap-2">
          <button
            disabled={guardando}
            onClick={() =>
              onGuardar({
                precio: Number(precio),
                activo,
                notaTecnica,
                idealPara,
              })
            }
            className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-ink disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={onCancelar}
            className="rounded-full border border-line-dim px-4 py-2 text-xs font-semibold text-text-dim hover:text-text-light"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
