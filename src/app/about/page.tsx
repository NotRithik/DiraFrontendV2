// src/app/about/page.tsx
"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/Button";
import Link from "next/link";

// Footer component
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

export default function AboutPage() {
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const headingRef = useRef<HTMLElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const svgWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.dataset?.scrollTo) {
        e.preventDefault();
        const id = target.dataset.scrollTo;
        const el = sectionsRef.current[id];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useLayoutEffect(() => {
    if (!headingRef.current || !rightColRef.current || !svgWrapperRef.current) return;

    const update = () => {
      const isMdUp = window.innerWidth >= 768;
      const headingRect = headingRef.current!.getBoundingClientRect();
      const rightRect = rightColRef.current!.getBoundingClientRect();
      const svgRect = svgWrapperRef.current!.getBoundingClientRect();

      if (!isMdUp) {
        svgWrapperRef.current!.style.position = "";
        svgWrapperRef.current!.style.top = "";
        svgWrapperRef.current!.style.right = "";
        svgWrapperRef.current!.style.transform = "";
        return;
      }

      const headingCenterRelativeToRight = headingRect.top - rightRect.top + headingRect.height / 2;
      const desiredTop = headingCenterRelativeToRight - svgRect.height / 2;

      svgWrapperRef.current!.style.position = "absolute";
      svgWrapperRef.current!.style.top = `${Math.max(0, desiredTop)}px`;
      svgWrapperRef.current!.style.right = `1.5rem`;
      svgWrapperRef.current!.style.transform = "";
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    const id = window.setInterval(update, 300);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, []);

  return (
    <div className="bg-[#FDF8F2] text-black h-screen overflow-y-auto snap-y snap-mandatory font-sans antialiased">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-black text-white px-3 py-1 font-extrabold tracking-wider">DIRA</div>
          <span className="text-xs text-black/60 uppercase font-semibold">About</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-black/70 uppercase">
          <a href="#mission" data-scroll-to="mission" className="hover:text-black">Mission</a>
          <a href="#problem" data-scroll-to="problem" className="hover:text-black">Problem</a>
          <a href="#why" data-scroll-to="why" className="hover:text-black">Why Dubai?</a>
          <a href="#principles" data-scroll-to="principles" className="hover:text-black">Principles</a>
          <a href="#join" data-scroll-to="join" className="hover:text-black">Join</a>
        </nav>
      </header>

      {/* Slide 1: Our Mission */}
      <section
        id="mission"
        ref={(el) => (sectionsRef.current["mission"] = el)}
        className="snap-start min-h-screen relative flex items-center px-6 md:px-12 border-t-8 border-black bg-orange-600 text-white"
        aria-label="Our mission"
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-block border-4 border-white/30 px-3 py-1 uppercase text-xs tracking-widest">Our Mission</div>
            <h1 ref={(el) => (headingRef.current = el)} className="text-4xl md:text-7xl font-extrabold uppercase leading-tight">
              Building the Financial Backbone of a Digital Dubai
            </h1>
            <p className="mt-4 text-lg md:text-2xl font-sans text-white/90 max-w-3xl">
              We bridge traditional finance and the decentralized future. A trusted, fully-backed,
              and transparent on-chain Emirati Dirham (AED) — unlocking new possibilities for commerce,
              remittances, and institutional adoption.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/whitepaper" className="block"><Button variant="white" className="px-6">Read Whitepaper</Button></Link>
              <Link href="/dashboard" className="block"><Button variant="secondary" className="px-6">Go to Dashboard</Button></Link>
            </div>
          </div>

          <div ref={(el) => (rightColRef.current = el)} className="md:col-span-5 flex items-start justify-center relative" aria-hidden>
            <div ref={(el) => (svgWrapperRef.current = el)} className="w-64 h-64 md:w-80 md:h-80 md:absolute">
              <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
                <rect x="6" y="6" width="188" height="188" fill="none" stroke="currentColor" strokeWidth="6"/>
                <rect x="24" y="36" width="72" height="36" fill="currentColor"/>
                <rect x="24" y="84" width="112" height="18" fill="currentColor"/>
                <rect x="104" y="36" width="56" height="96" fill="currentColor"/>
                <rect x="24" y="112" width="56" height="64" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 2: Problem & Solution - UPDATED BOX SIZING */}
      <section
        id="problem"
        ref={(el) => (sectionsRef.current["problem"] = el)}
        className="snap-start min-h-screen border-t-8 border-black grid grid-cols-1 md:grid-cols-2"
        aria-label="Problem and solution"
      >
        {/* LEFT: 01 */}
        <div className="p-10 md:p-16 bg-white flex items-center justify-center md:border-r-4 border-black">
          <article className="max-w-xl w-full space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-extrabold">01</div>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">The Digital Disconnect</h2>
            </div>

            <p className="text-lg text-black/85">
              The global digital economy runs at internet speed while regional currencies remain stuck in legacy rails. Cross-border friction, settlement lag, and volatility stand between real on-chain adoption and practical utility.
            </p>

            {/* NEW: 2x2 grid for left boxes (bottom-right intentionally empty) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
              {/* match sizing with right side boxes via max-w and w-full */}
              <div className="bg-white/90 p-4 border-4 border-black max-w-[340px] w-full">
                <h5 className="font-bold uppercase text-sm">Slow &amp; Costly</h5>
                <p className="text-sm mt-2">Cross-border flows and remittances.</p>
              </div>

              <div className="bg-white/90 p-4 border-4 border-black max-w-[340px] w-full">
                <h5 className="font-bold uppercase text-sm">Limited Liquidity</h5>
                <p className="text-sm mt-2">Scarcity of native on-chain AED.</p>
              </div>

              <div className="bg-white/90 p-4 border-4 border-black max-w-[340px] w-full">
                <h5 className="font-bold uppercase text-sm">Institutional Barriers</h5>
                <p className="text-sm mt-2">Regulatory complexity and lack of trusted assets.</p>
              </div>

              {/* bottom-right intentionally left empty (keeps 2x2 grid rhythm) */}
              <div className="hidden sm:block" aria-hidden />
            </div>
          </article>
        </div>

        {/* RIGHT: 02 */}
        <div className="p-10 md:p-16 bg-yellow-400 flex items-center justify-center md:border-l-4 border-black">
          <article className="max-w-xl w-full space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-extrabold">02</div>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">The Dira Protocol</h2>
            </div>

            <p className="text-lg text-black/85">
              Dira is the bridge: an over-collateralized, auditable AED stablecoin designed for real-world use. Predictable liquidity, on-chain settlement, and regulatory-first design for institutional adoption.
            </p>

            {/* RIGHT boxes (kept same sizing as left) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
              <div className="bg-white/90 p-4 border-4 border-black max-w-[340px] w-full">
                <h5 className="font-bold uppercase text-sm">Verifiable</h5>
                <p className="text-sm mt-2">On-chain reserves and automated reporting.</p>
              </div>

              <div className="bg-white/90 p-4 border-4 border-black max-w-[340px] w-full">
                <h5 className="font-bold uppercase text-sm">Programmable</h5>
                <p className="text-sm mt-2">Integrate Dira into contracts, markets, and payments.</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Slide 3: Why Dubai? */}
      <section
        id="why"
        ref={(el) => (sectionsRef.current["why"] = el)}
        className="snap-start min-h-screen flex items-center justify-center border-t-8 border-black bg-white px-6 md:px-12 text-center"
        aria-label="Why Dubai"
      >
        <div className="max-w-4xl space-y-8">
          <h2 className="text-5xl md:text-7xl font-extrabold uppercase leading-tight">Built for Dubai's Vision</h2>
          <p className="text-xl md:text-2xl text-black/85">
            Dubai is positioning itself as the world's digital finance hub. Dira is crafted to serve that vision — delivering a regulator-friendly, institution-ready on-chain AED to power tokenized assets, trade, and programmable liquidity.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="p-6 border-4 border-black max-w-xs">
              <h4 className="font-extrabold uppercase text-sm">Regulatory Alignment</h4>
              <p className="mt-2 text-sm">Designed to engage regulators, not bypass them.</p>
            </div>
            <div className="p-6 border-4 border-black max-w-xs bg-yellow-400">
              <h4 className="font-extrabold uppercase text-sm">Institutional Grade</h4>
              <p className="mt-2 text-sm">Scalable custody, settlement, and reporting primitives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 4: Core Principles */}
      <section
        id="principles"
        ref={(el) => (sectionsRef.current["principles"] = el)}
        className="snap-start min-h-screen border-t-8 border-black bg-black text-white px-6 md:px-12 py-12 flex items-center"
        aria-label="Core principles"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="p-8 border-4 border-white">
            <h3 className="text-3xl font-extrabold uppercase text-yellow-400">Transparency</h3>
            <p className="mt-4 text-white/90">Every Dira is verifiably backed by on-chain collateral. Reserves and system health are auditable, 24/7.</p>
          </div>

          <div className="p-8 border-4 border-white">
            <h3 className="text-3xl font-extrabold uppercase text-yellow-400">Security</h3>
            <p className="mt-4 text-white/90">Battle-tested smart contracts and robust over-collateralization guard against market shocks.</p>
          </div>

          <div className="p-8 border-4 border-white">
            <h3 className="text-3xl font-extrabold uppercase text-yellow-400">Compliance</h3>
            <p className="mt-4 text-white/90">A regulator-first framework that enables safe, institutional-scale adoption.</p>
          </div>
        </div>
      </section>

      {/* Slide 5: Final CTA */}
      <section
        id="join"
        ref={(el) => (sectionsRef.current["join"] = el)}
        className="snap-start min-h-screen border-t-8 border-black bg-yellow-400 text-black flex items-center justify-center px-6 md:px-12"
        aria-label="Join the future"
      >
        <div className="max-w-4xl text-center space-y-8">
          <h2 className="text-5xl md:text-8xl font-extrabold uppercase leading-tight">Join the Future</h2>
          <p className="text-xl md:text-2xl text-black/85">Become part of the new economy — explore the protocol, test the flows, and join our community.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard"><Button variant="secondary" className="w-full sm:w-auto">Go to Dashboard</Button></Link>
            <a href="https://discord.gg/H9uwM6S2Gk" target="_blank" rel="noreferrer"><Button variant="white" className="w-full sm:w-auto">Join our Discord</Button></a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="snap-start">
        <Footer />
      </div>
    </div>
  );
}
