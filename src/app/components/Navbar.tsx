import React from 'react';


import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full backdrop-blur-md bg-white/60 border-b border-white/60 shadow-lg mb-1">
      <div className="container mx-auto flex items-center justify-between py-4 px-8">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-md shadow-sm bg-white" />
          <span className="font-bold text-xl drop-shadow-sm tracking-tight bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-transparent bg-clip-text">CondutaPlus</span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="font-medium transition-colors px-3 py-1.5 rounded bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white shadow hover:brightness-110">
            Home
          </Link>
          <Link href="/tabulacao" className="font-medium transition-colors px-3 py-1.5 rounded bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white shadow hover:brightness-110">
            Tabulação
          </Link>
        </div>
      </div>
    </nav>
  );
}
