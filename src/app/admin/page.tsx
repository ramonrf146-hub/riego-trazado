"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIAS } from "@/lib/categorias";

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
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [guardandoNuevo, setGuardandoNuevo] = useState(false);

  function cargarProductos() {
    setCargando(true);
    return fetch("/api/admin/productos")
      .then((r) => r.json())
      .then((datos) => setProductos(datos.productos ?? []))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  async function agregarProducto(nuevo: Record<string, unknown>) {
    setGuardandoNuevo(true);
    setMensaje(null);
    try {
      const respuesta = await fetch("/api/admin/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        setMensaje({ tipo: "error", texto: datos.error ?? "No se pudo agregar." });
        return;
      }
      setMensaje({ tipo: "ok", texto: "Producto agregado. El sitio se va a actualizar solo en 1-2 minutos." });
      setMostrarNuevo(false);
      await cargarProductos();
    } catch {
      setMensaje({ tipo: "error", texto: "No se pudo conectar con el servidor." });
    } finally {
      setGuardandoNuevo(false);
    }
  }

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

      <button
        onClick={() => setMostrarNuevo((v) => !v)}
        className="mt-6 w-full rounded-xl border border-dashed border-line px-4 py-3 text-sm font-semibold text-line hover:bg-line/10"
      >
        {mostrarNuevo ? "✕ Cancelar" : "+ Agregar producto nuevo"}
      </button>

      {mostrarNuevo && (
        <FormNuevoProducto guardando={guardandoNuevo} onGuardar={agregarProducto} />
      )}

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

function FormNuevoProducto({
  guardando,
  onGuardar,
}: {
  guardando: boolean;
  onGuardar: (nuevo: Record<string, unknown>) => void;
}) {
  const [asin, setAsin] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState<string>(CATEGORIAS[0].slug);
  const [precio, setPrecio] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [imagen, setImagen] = useState("");
  const [rating, setRating] = useState("");
  const [numResenas, setNumResenas] = useState("");
  const [notaTecnica, setNotaTecnica] = useState("");
  const [idealPara, setIdealPara] = useState("");
  const [tags, setTags] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  function enviar() {
    if (!asin.trim() || !nombre.trim() || !precio || !imagen.trim() || !rating || !numResenas || !notaTecnica.trim()) {
      setErrorLocal("Completá al menos ASIN, nombre, precio, imagen, rating, reseñas y nota técnica.");
      return;
    }
    setErrorLocal(null);
    onGuardar({
      asin: asin.trim().toUpperCase(),
      nombre: nombre.trim(),
      categoria,
      precio: Number(precio),
      ...(precioMax ? { precioMax: Number(precioMax) } : {}),
      imagen: imagen.trim(),
      rating: Number(rating),
      numResenas: Number(numResenas),
      notaTecnica: notaTecnica.trim(),
      ...(idealPara.trim() ? { idealPara: idealPara.trim() } : {}),
      ...(tags.trim()
        ? { tags: tags.split(",").map((t) => t.trim()).filter(Boolean) }
        : {}),
    });
  }

  return (
    <div className="mt-4 rounded-2xl border border-line bg-ink-2 p-4">
      <p className="text-sm font-bold text-text-light">Cargar producto nuevo</p>
      <p className="mt-1 text-xs text-text-dim">
        Buscá el producto en Amazon, confirmá que esté en stock, y mantené presionada la imagen
        principal para copiar su dirección (&quot;Copiar dirección de la imagen&quot;) — pegala
        abajo. El ranking dentro de la categoría se calcula solo.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="text-xs text-text-dim">
          ASIN *
          <input
            type="text"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            placeholder="B0XXXXXXXX"
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        <label className="text-xs text-text-dim">
          Nombre *
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        <label className="text-xs text-text-dim">
          Categoría *
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-3">
          <label className="flex-1 text-xs text-text-dim">
            Precio (USD) *
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
            />
          </label>
          <label className="flex-1 text-xs text-text-dim">
            Precio máx. (opcional)
            <input
              type="number"
              step="0.01"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
            />
          </label>
        </div>

        <label className="text-xs text-text-dim">
          URL de la imagen *
          <input
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            placeholder="https://m.media-amazon.com/images/..."
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        <div className="flex gap-3">
          <label className="flex-1 text-xs text-text-dim">
            Rating (0-5) *
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
            />
          </label>
          <label className="flex-1 text-xs text-text-dim">
            N° de reseñas *
            <input
              type="number"
              value={numResenas}
              onChange={(e) => setNumResenas(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
            />
          </label>
        </div>

        <label className="text-xs text-text-dim">
          Nota técnica *
          <textarea
            value={notaTecnica}
            onChange={(e) => setNotaTecnica(e.target.value)}
            rows={4}
            placeholder="Qué lo distingue, para quién sirve, qué no hace..."
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        <label className="text-xs text-text-dim">
          Ideal para (opcional)
          <textarea
            value={idealPara}
            onChange={(e) => setIdealPara(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        <label className="text-xs text-text-dim">
          Tags (opcional, separados por coma)
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="WiFi 2.4GHz, 4 zonas, Auto rain skip"
            className="mt-1 w-full rounded-lg border border-line-dim bg-ink px-3 py-2 text-sm text-text-light"
          />
        </label>

        {errorLocal && <p className="text-xs text-red-400">{errorLocal}</p>}

        <button
          disabled={guardando}
          onClick={enviar}
          className="rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-ink disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Agregar al catálogo"}
        </button>
      </div>
    </div>
  );
}
