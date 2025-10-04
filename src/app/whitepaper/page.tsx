// src/app/whitepaper/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";

// A brutalist-style hamburger icon component
const HamburgerIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="4" />
        <rect x="2" y="10" width="20" height="4" />
        <rect x="2" y="17" width="20" height="4" />
    </svg>
);

export default function WhitepaperPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-[#FDF8F2] text-black h-screen font-sans flex flex-col">
      {/* Dashboard-style Navbar */}
      <nav className="bg-[#E94E1B] border-b-8 border-black px-8 md:px-16 py-4 flex items-center justify-between relative z-20">
        <Link href="/" className="text-3xl md:text-4xl font-extrabold uppercase text-white">
            DIRA
        </Link>
        
        {/* Desktop Buttons */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 max-w-xl w-full">
            <Link href="/" className="block w-full">
                <Button variant="white" className="w-full md:w-full">Home</Button>
            </Link>
            <Link href="/dashboard" className="block w-full">
                <Button variant="primary" className="w-full md:w-full">Dashboard</Button>
            </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
        >
            <HamburgerIcon />
        </button>
        
        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#E94E1B] border-b-8 border-black px-8 py-4 z-10">
                <div className="grid grid-cols-1 gap-4">
                    <Link href="/"><Button variant="white" className="w-full">Home</Button></Link>
                    <Link href="/dashboard"><Button variant="primary" className="w-full">Dashboard</Button></Link>
                </div>
            </div>
        )}
      </nav>

      {/* Main content area for the PDF */}
      <main className="flex-grow flex flex-col">
        <iframe
          src="/assets/whitepaper.pdf"
          className="w-full h-full flex-grow border-none"
          title="Dira Whitepaper"
        />
      </main>
    </div>
  );
}