// src/app/page.tsx
import { Button } from "@/components/Button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-[#FDF8F2] text-black min-h-screen font-sans">

      {/* Hero Section */}
      <section className="bg-orange-600 text-white border-b-8 border-black">
        <div className="max-w-6xl mx-auto px-8 py-16 md:px-16">
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
            <Button variant="primary" className="w-full md:w-full">Connect Wallet</Button>
          </div>
        </div>
      </section>

      {/* On-Chain Manifesto Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b-8 border-black">
        {/* Illustration */}
        <div className="bg-orange-600 flex items-center justify-center border-b-8 md:border-b-0 md:border-r-8 border-black">
          <img
            src="/assets/brutalist_dubai.png"
            alt="Brutalist Dubai Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Combined Text Content */}
        <div className="flex flex-col">
            {/* Yellow Top Section */}
            <div className="bg-yellow-400 text-black flex-grow flex items-center border-b-8 border-black">
                <div className="w-full px-8 md:px-16 py-16">
                    <div className="max-w-xl space-y-12">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight relative">
                                Stability in a Volatile World
                            </h3>
                            <p className="mt-6 text-xl font-sans">
                                A trusted, AED-pegged digital currency engineered for resilience. Dira provides
                                certainty where others fluctuate — enabling reliable settlement, predictable
                                liquidity, and real adoption.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight relative">
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
            
            {/* White Bottom Section */}
            <div className="bg-white text-black flex-grow flex items-center">
                 <div className="w-full px-8 md:px-16 py-16">
                    <div className="max-w-xl">
                        <h2 className="text-5xl md:text-7xl font-extrabold uppercase leading-tight">
                            On-Chain
                        </h2>
                        <p className="mt-6 text-xl font-sans">
                            A transparent, scalable, and regulator-friendly stablecoin infrastructure. Powered
                            by OM and built for institutional adoption. Not
                            just another stablecoin — Dira is the foundation for Dubai’s global digital economy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-yellow-400 border-black">
        <div className="max-w-6xl mx-auto p-8 md:p-16">
          <h2 className="text-5xl md:text-7xl font-extrabold uppercase text-black leading-tight">
            Mint. Lock. Transact.
          </h2>
          <p className="mt-4 text-xl font-sans">
            Be part of the first stablecoin designed for Dubai’s future — built to scale, trusted to last.
          </p>
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <Link href="/dashboard">
              <Button variant="primary">Start Now</Button>
            </Link>
            <Button variant="secondary">Learn More</Button>
          </div>
        </div>
      </section>
    </div>
  );
}