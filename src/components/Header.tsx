"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";

function LogoValvula() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="12.5" stroke="var(--line)" strokeWidth="1.5" />
      <path
        d="M14 4 L14 12 M14 16 L14 24 M4 14 L12 14 M16 14 L24 14"
        stroke="var(--line)"
        strokeWidth="1.5"
      />
      <path
        d="M14 9 C11 12, 11 16, 14 19 C17 16, 17 12, 14 9 Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

function IconoMenu({ abierto }: { abierto: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {abierto ? (
        <path
          d="M4 4l12 12M16 4L4 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 5h14M3 10h14M3 15h14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function Header({ locale }: { locale: Locale }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const dict = getDictionary(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-line-dim/60 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href={withLocale("/", locale)}
          className="flex items-center gap-2.5 shrink-0"
          onClick={() => setMenuAbierto(false)}
        >
          <LogoValvula />
          <span className="text-base font-extrabold tracking-tight text-text-light">
            HIDRO<span className="text-accent">_</span>LAB
          </span>
        </Link>

        <nav
          aria-label={dict["nav.categorias"]}
          className="hidden items-center gap-5 overflow-x-auto text-sm font-medium text-text-dim md:flex"
        >
          {CATEGORIAS.map((categoria) => (
            <Link
              key={categoria.slug}
              href={withLocale(`/categorias/${categoria.slug}`, locale)}
              className="whitespace-nowrap transition-colors hover:text-line"
            >
              {t(categoria.nombre, categoria.nombreEn, locale)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            href={withLocale("/articulos", locale)}
            className="hidden text-text-dim transition-colors hover:text-line sm:inline"
          >
            {dict["nav.guias"]}
          </Link>
          <Link
            href={withLocale("/#ranking", locale)}
            className="rounded-full bg-accent px-4 py-2 text-ink transition-opacity hover:opacity-90"
          >
            {dict["nav.verRanking"]}
          </Link>
          <Link
            href={withLocale("/", locale === "es" ? "en" : "es")}
            aria-label={dict["lang.switchAria"]}
            className="flex items-center justify-center rounded-full border border-line-dim px-2.5 py-1.5 text-xs font-semibold text-text-dim transition-colors hover:border-line hover:text-line"
          >
            {locale === "es" ? dict["lang.en"] : dict["lang.es"]}
          </Link>
          <button
            type="button"
            aria-label={menuAbierto ? dict["nav.cerrarMenu"] : dict["nav.abrirMenu"]}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex items-center justify-center rounded-full border border-line-dim p-2 text-text-light transition-colors hover:border-line md:hidden"
          >
            <IconoMenu abierto={menuAbierto} />
          </button>
        </div>
      </div>

      {menuAbierto && (
        <nav
          id="menu-movil"
          aria-label={dict["nav.categorias"]}
          className="border-t border-line-dim/60 bg-ink px-4 py-4 text-sm font-medium text-text-dim md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {CATEGORIAS.map((categoria) => (
              <li key={categoria.slug}>
                <Link
                  href={withLocale(`/categorias/${categoria.slug}`, locale)}
                  onClick={() => setMenuAbierto(false)}
                  className="block rounded-sm px-2 py-2.5 transition-colors hover:bg-ink-2 hover:text-line"
                >
                  {t(categoria.nombre, categoria.nombreEn, locale)}
                </Link>
              </li>
            ))}
            <li className="mt-1 border-t border-line-dim/40 pt-2">
              <Link
                href={withLocale("/articulos", locale)}
                onClick={() => setMenuAbierto(false)}
                className="block rounded-sm px-2 py-2.5 transition-colors hover:bg-ink-2 hover:text-line"
              >
                {dict["nav.guiasYArticulos"]}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
