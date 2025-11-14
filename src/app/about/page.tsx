// src/app/about/page.tsx
"use client";

import { useLayoutEffect } from "react";
import { Button } from "@/components/Button";
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image"; // 1. Add import

export default function AboutPage() {
  useLayoutEffect(() => {
    const equalize = () => {
      const isMdUp = window.innerWidth >= 768;
      const boxes = Array.from(document.querySelectorAll<HTMLElement>(".problem-equal"));
      if (!boxes.length) return;
      if (!isMdUp) {
        boxes.forEach((b) => (b.style.minHeight = ""));
        return;
      }
      boxes.forEach((b) => (b.style.minHeight = ""));
      let max = 0;
      boxes.forEach((b) => {
        const h = Math.ceil(b.getBoundingClientRect().height);
        if (h > max) max = h;
      });
      if (max > 0) boxes.forEach((b) => (b.style.minHeight = `${max}px`));
    };
    equalize();
    window.addEventListener("resize", equalize);
    window.addEventListener("load", equalize);
    const id = window.setInterval(equalize, 300);
    return () => {
      window.removeEventListener("resize", equalize);
      window.removeEventListener("load", equalize);
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="bg-[#FDF8F2] text-black h-screen overflow-y-auto snap-y snap-mandatory font-sans antialiased">
      <section id="mission" className="snap-start min-h-screen flex items-center px-6 md:px-12 bg-orange-600 text-white" aria-label="Our mission">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-4 md:mb-6"><div className="inline-block border-2 border-white/30 px-3 py-1 uppercase text-xs tracking-widest">OUR MISSION</div></div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8"><h1 className="text-4xl md:text-7xl font-extrabold uppercase leading-tight">Building the Financial Backbone of a Digital Dubai</h1></div>
            {/* 2. Add 'relative' to the parent div */}
            <div className="hidden md:flex md:col-span-4 items-center justify-center relative">
              {/* 3. Replace <img> with <Image> and use the 'fill' prop */}
              <Image 
                src="/assets/about_illustration.png" 
                alt="Dira abstract graphic" 
                fill
                className="object-contain" 
              />
            </div>
          </div>
          <div className="mt-8 md:mt-12 max-w-3xl">
            <p className="text-lg md:text-2xl font-sans text-white/90">We bridge traditional finance and the decentralized future. A trusted, fully-backed, and transparent on-chain Emirati Dirham (AED) — unlocking new possibilities for commerce, remittances, and widespread adoption.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              <Link href="/" className="block w-full"><Button variant="white" className="w-full md:w-full">Home</Button></Link>
              <Link href="/dashboard" className="block w-full"><Button variant="primary" className="w-full md:w-full">Dashboard</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="snap-start min-h-screen border-t-8 border-black grid grid-cols-1 md:grid-cols-2" aria-label="Problem and solution">
        <div className="p-10 md:p-16 bg-white flex items-center justify-center md:border-r-4 border-black">
          <article className="max-w-xl w-full space-y-6 text-right">
            <div className="flex items-center justify-end gap-4">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">The Digital Disconnect</h2>
              <div className="text-4xl font-extrabold">01</div>
            </div>
            <p className="text-lg text-black/85">The global digital economy runs at internet speed while regional currencies remain stuck in legacy rails. Cross-border friction, settlement lag, and volatility stand between real on-chain adoption and practical utility.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
              <div className="problem-equal bg-white/90 p-4 border-4 border-black max-w-[340px] w-full shadow-[4px_4px_0_#000]"><h5 className="font-bold uppercase text-sm">Slow &amp; Costly</h5><p className="text-sm mt-2">Cross-border flows and remittances.</p></div>
              <div className="problem-equal bg-white/90 p-4 border-4 border-black max-w-[340px] w-full shadow-[4px_4px_0_#000]"><h5 className="font-bold uppercase text-sm">Limited Liquidity</h5><p className="text-sm mt-2">Scarcity of native on-chain AED.</p></div>
              <div className="hidden sm:block" aria-hidden />
              <div className="problem-equal bg-white/90 p-4 border-4 border-black max-w-[340px] w-full sm:col-start-2 shadow-[4px_4px_0_#000]"><h5 className="font-bold uppercase text-sm">Walled Gardens</h5><p className="text-sm mt-2">Closed systems and a lack of trusted, open assets.</p></div>
            </div>
          </article>
        </div>
        <div className="p-10 md:p-16 bg-yellow-400 flex items-center justify-center md:border-l-4 border-black">
          <article className="max-w-xl w-full space-y-6">
            <div className="flex items-center gap-4"><div className="text-4xl font-extrabold">02</div><h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">The Dira Protocol</h2></div>
            <p className="text-lg text-black/85">Dira is the bridge: an over-collateralized, auditable AED stablecoin designed for real-world use. It offers predictable liquidity, on-chain settlement, and a transparent design for broad adoption.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
              <div className="problem-equal bg-white/90 p-4 border-4 border-black max-w-[340px] w-full shadow-[4px_4px_0_#000]"><h5 className="font-bold uppercase text-sm">Verifiable</h5><p className="text-sm mt-2">On-chain reserves and automated reporting.</p></div>
              <div className="problem-equal bg-white/90 p-4 border-4 border-black max-w-[340px] w-full shadow-[4px_4px_0_#000]"><h5 className="font-bold uppercase text-sm">Programmable</h5><p className="text-sm mt-2">Integrate Dira into contracts, markets, and payments.</p></div>
            </div>
          </article>
        </div>
      </section>

      <section id="why" className="snap-start min-h-screen flex items-center justify-center border-t-8 border-black bg-white px-6 md:px-12 text-center" aria-label="Why Dubai">
        <div className="max-w-4xl space-y-8">
          <h2 className="text-5xl md:text-7xl font-extrabold uppercase leading-tight">Built for Dubai&apos;s Vision</h2>
          <p className="text-xl md:text-2xl text-black/85">Dubai is emerging as a global digital finance hub. Dira is crafted to serve that vision — delivering a community-focused, open on-chain AED to power tokenized assets, trade, and programmable liquidity for everyone.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="p-6 border-4 border-black max-w-xs shadow-[4px_4px_0_#000]"><h4 className="font-extrabold uppercase text-sm">Open &amp; Transparent</h4><p className="mt-2 text-sm">Designed for clarity and open participation.</p></div>
            <div className="p-6 border-4 border-black max-w-xs bg-yellow-400 shadow-[4px_4px_0_#000]"><h4 className="font-extrabold uppercase text-sm">Community-Ready</h4><p className="mt-2 text-sm">Scalable and secure primitives for settlement and reporting.</p></div>
          </div>
        </div>
      </section>

      <section id="principles" className="snap-start min-h-screen border-t-8 border-black relative overflow-hidden flex items-center" aria-label="Core principles">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/assets/brutalist_dubai.png')] bg-cover bg-right-bottom bg-no-repeat"> </div>
        <div className="absolute right-0 top-0 h-full w-1/2 transform -skew-x-6 origin-top-right bg-[#fdc800]"></div>
        <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 md:px-12">
          <div className="flex flex-col items-center md:items-end justify-center gap-10">
            <div className="p-10 border-4 border-[#fdc800] bg-black text-[#fdc800] w-full max-w-md shadow-[12px_12px_0_#fdc800]"><h3 className="text-4xl font-extrabold uppercase">Transparency</h3><p className="mt-4 text-lg text-[#fdc800]/90">Every Dira is verifiably backed by on-chain collateral. Reserves and system health are auditable, 24/7.</p></div>
            <div className="p-10 border-4 border-[#fdc800] bg-black text-[#fdc800] w-full max-w-md shadow-[12px_12px_0_#fdc800]"><h3 className="text-4xl font-extrabold uppercase">Security</h3><p className="mt-4 text-lg text-[#fdc800]/90">Battle-tested smart contracts and robust over-collateralization guard against market shocks.</p></div>
          </div>
          <div className="flex items-center justify-center"><div className="p-10 border-4 border-black bg-[#fdc800] text-black max-w-md shadow-[12px_12px_0_#000]"><h3 className="text-4xl font-extrabold uppercase">Openness</h3><p className="mt-4 text-lg font-sans text-black/80">An open-source framework that enables permissionless innovation and community-driven development.</p></div></div>
        </div>
      </section>

      <section id="join" className="snap-start min-h-screen flex flex-col border-t-8 border-black" aria-label="Join the future">
        <div className="bg-yellow-400 text-black flex-grow flex items-center justify-center px-6 py-16 md:py-12">
          <div className="max-w-4xl text-center space-y-8">
            <h2 className="text-5xl md:text-8xl font-extrabold uppercase leading-tight">Join the Future</h2>
            <p className="text-xl md:text-2xl text-black/85">Become part of the new economy — explore the protocol, test the flows, and join our community.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <Link href="/whitepaper" className="block w-full"><Button variant="white" className="w-full md:w-full">Whitepaper</Button></Link>
              <Link href="/" className="block w-full"><Button variant="secondary" className="w-full md:w-full">Home</Button></Link>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
}