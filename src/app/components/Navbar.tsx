"use client";
import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm py-2 px-0 flex items-center justify-between sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
          <span className="font-bold text-sm bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-transparent bg-clip-text tracking-tight">Conduta Unimed</span>
        </div>
        {/* Desktop links */}
        <div className="hidden sm:flex gap-2">
          <Link href="/" className="text-sm font-medium px-2 py-1.5 rounded bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white shadow hover:brightness-110 transition-colors">
            Início
          </Link>
          <Link href="/tabulacao" className="text-sm font-medium px-2 py-1.5 rounded bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white shadow hover:brightness-110 transition-colors">
            Consulta de Rede
          </Link>
        </div>
        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Abrir menu"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-[#313a85] hover:bg-gray-100 hover:text-[#222] transition"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>
      {/* Mobile dropdown */}
      <div id="mobile-menu" className={`sm:hidden overflow-hidden transition-[max-height] duration-300 bg-white shadow-sm ${open ? 'max-h-32' : 'max-h-0'}`}> 
        <div className="px-3 pb-2 flex flex-col gap-1">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm font-medium px-2 py-2 rounded bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white shadow hover:brightness-110 transition-colors">
            Início
          </Link>
          <Link href="/tabulacao" onClick={() => setOpen(false)} className="text-sm font-medium px-2 py-2 rounded bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white shadow hover:brightness-110 transition-colors">
            Consulta de Rede
          </Link>
        </div>
      </div>
    </nav>
  );
}
