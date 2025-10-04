// src/app/page.tsx
"use client";

import { Button } from "@/components/Button";
import Link from "next/link";
import type React from "react";

// Footer component is defined directly inside page.tsx
function Footer() {
  return (
    <footer className="border-t-8 border-black bg-[#111] text-white">
      <div className="max-w-6xl mx-auto px-8 md:px-16 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-extrabold uppercase mb-2">Dira Foundation</h4>
          <p className="text-sm text-white/80">Building the on-chain AED for Dubai and beyond.</p>
        </div>
        <div>
          <h5 className="font-bold uppercase mb-2">Resources</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/whitepaper" className="underline">Whitepaper (PDF)</Link></li>
            <li><Link href="/docs" className="underline">Docs & Developers</Link></li>
            <li><Link href="/audit" className="underline">Audit Report</Link></li>
            <li><Link href="/about" className="underline">About</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold uppercase mb-2">Community</h5>
          <ul className="space-y-2 text-sm">
            <li><a className="underline" href="https://x.com/dira_stablecoin" target="_blank" rel="noreferrer">Twitter / X</a></li>
            <li><a className="underline" href="https://discord.gg/H9uwM6S2Gk" target="_blank" rel="noreferrer">Discord</a></li>
            <li><a className="underline" href="https://t.me/+juE8D3CuyyE3ZjE1" target="_blank" rel="noreferrer">Telegram</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold uppercase mb-2">Code</h5>
          <ul className="space-y-2 text-sm">
            <li><a className="underline" href="https://github.com/NotRithik/dira-frontend" target="_blank" rel="noreferrer">Frontend repo</a></li>
            <li><a className="underline" href="https://github.com/NotRithik/StableDira" target="_blank" rel="noreferrer">Contracts repo</a></li>
            <li><a className="underline" href="https://github.com/NotRithik/StableDira/issues" target="_blank" rel="noreferrer">Issues & Roadmap</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-8 md:px-16 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Dira Foundation</p>
          <p>Contact: contact@dira.foundation</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  // Smooth scroll handler
  const handleScroll: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FDF8F2] text-black h-screen overflow-y-scroll snap-y snap-mandatory font-sans">

      {/* Hero Section - Slide 1 */}
      <section className="bg-orange-600 text-white h-screen flex flex-col justify-center snap-start">
        <div className="max-w-6xl mx-auto px-8 md:px-16 w-full">
          <h1 className="text-[4rem] md:text-[7rem] font-extrabold uppercase leading-none">
            Dira
          </h1>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase mt-2">
            The AED Stablecoin
          </h2>
          <p className="mt-4 text-lg font-sans text-white/90">
            Backed by OM. Built as the financial backbone of Dubai’s digital future.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-xl">
            <Link href="/dashboard" className="block w-full">
              <Button variant="white" className="w-full md:w-full">Dashboard</Button>
            </Link>
            <a href="#manifesto" onClick={handleScroll} className="block w-full">
              <Button variant="primary" className="w-full md:w-full">Learn More</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Manifesto Part 1 - Slide 2 */}
      <section id="manifesto" className="h-screen flex flex-col md:flex-row snap-start border-t-8 border-black">
        <div className="bg-black flex-shrink-0 flex items-center justify-center md:border-r-8 border-black h-1/2 md:h-full w-full md:w-auto">
          <img
            src="/assets/brutalist_dubai.png"
            alt="Brutalist Dubai Illustration"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="bg-white text-black flex-grow flex items-center">
          <div className="w-full px-8 md:px-16 py-16">
            <div className="max-w-xl space-y-16">
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">
                  Stability in a Volatile World
                </h3>
                <p className="mt-6 text-xl font-sans">
                  A trusted, AED-pegged digital currency engineered for resilience. Dira provides
                  certainty where others fluctuate — enabling reliable settlement, predictable
                  liquidity, and real adoption.
                </p>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">
                  Unlocking Dubai's Digital Economy
                </h3>
                <p className="mt-6 text-xl font-sans">
                  Dira bridges traditional finance and DeFi. By bringing AED on-chain, we create
                  programmable liquidity for trade, remittances, and capital markets — positioning
                  Dubai as the hub of a new financial era.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Combined Final Section - Slide 3 */}
      <section className="min-h-screen flex flex-col snap-start border-t-8 border-black">
        <div className="bg-yellow-400 text-black flex-grow flex flex-col justify-center items-center p-8 md:p-16">
          <div className="max-w-3xl w-full text-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-extrabold uppercase leading-tight">
                On-Chain
              </h2>
              <p className="mt-6 text-xl font-sans max-w-2xl mx-auto">
                A transparent, scalable, and regulator-friendly stablecoin infrastructure. Powered by OM and built for institutional adoption. Not just another stablecoin — Dira is the foundation for Dubai’s global digital economy.
              </p>
            </div>
            <div className="w-24 h-1.5 bg-black my-12 md:my-16 mx-auto" />
            <div>
              <h2 className="text-4xl md:text-6xl font-extrabold uppercase text-black leading-tight">
                Mint. Lock. Transact.
              </h2>
              <p className="mt-4 text-xl font-sans max-w-2xl mx-auto">
                Be part of the first stablecoin designed for Dubai’s future — built to scale, trusted to last.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-full max-w-xs">
                  <Link href="/dashboard">
                    <Button variant="secondary" className="w-full">Start Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
}