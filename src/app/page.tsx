// src/app/page.tsx
"use client";

import { Button } from "@/components/Button";
import Link from "next/link";
import type React from "react";
import Footer from "@/components/Footer";
import Image from "next/image"; // 1. Add import

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
      <section className="min-h-screen flex flex-col justify-center snap-start bg-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-8 md:px-16 w-full py-16 md:py-0">
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
      <section id="manifesto" className="flex flex-col md:h-screen md:flex-row snap-start border-t-8 border-black">
        {/* 2. Add 'relative' to the parent div */}
        <div className="md:w-1/2 md:border-r-8 border-black relative">
          {/* 3. Replace <img> with <Image> and use the 'fill' prop */}
          <Image
            src="/assets/brutalist_dubai.png"
            alt="Brutalist Dubai Illustration"
            fill
            className="object-cover"
          />
        </div>
        <div className="bg-white text-black flex-grow flex items-center md:w-1/2">
          <div className="w-full px-8 md:px-16 py-16">
            <div className="max-w-xl space-y-12 md:space-y-16">
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
                  Unlocking Dubai&apos;s Digital Economy
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
        <div className="bg-yellow-400 text-black flex-grow flex flex-col justify-center items-center p-8">
          <div className="max-w-4xl w-full text-center py-16 md:py-0">
            <div>
              <h2 className="text-5xl md:text-7xl font-extrabold uppercase leading-tight">
                On-Chain
              </h2>
              <p className="mt-6 text-xl font-sans max-w-2xl mx-auto">
                A transparent and scalable stablecoin infrastructure. Powered by OM and built for widespread adoption. Not just another stablecoin—Dira is the foundation for a global, open economy.
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
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                <Link href="/about" className="block w-full">
                  <Button variant="white" className="w-full md:full min-w-full">About Us</Button>
                </Link>
                <Link href="/dashboard" className="block w-full">
                  <Button variant="secondary" className="w-full md:full min-w-full">Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
}