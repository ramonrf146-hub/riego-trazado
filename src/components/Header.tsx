"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";

function LogoValvula() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="26" fill="url(#logoBg)" />
      <path
        d="M50 16 C50 16 26 46 26 63 C26 77 37 88 50 88 C63 88 74 77 74 63 C74 46 50 16 50 16 Z"
        fill="#ffffff"
      />
      <path d="M50 16 C46 10 38 8 33 11 C38 14 42 18 44 23 Z" fill="#22c55e" />
      <path d="M50 16 C54 9 63 8 68 12 C62 14 57 19 55 24 Z" fill="#4ade80" />
      <path
        d="M50 50 L40 60 M50 50 L60 60 M40 60 L50 72 M60 60 L50 72"
        stroke="#0891b2"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="4.5" fill="#0891b2" />
      <circle cx="40" cy="60" r="4.5" fill="#0891b2" />
      <circle cx="60" cy="60" r="4.5" fill="#0891b2" />
      <circle cx="50" cy="72" r="4.5" fill="#0891b2" />
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
