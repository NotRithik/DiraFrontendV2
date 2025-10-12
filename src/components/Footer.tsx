// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
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
            <li>
              <a
                href="https://docs.dira.foundation"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Docs & Developers
              </a>
            </li>
            <li>
              <a
                href="https://github.com/NotRithik/DiraAuditReport"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Audit Report
              </a>
            </li>
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
            <li><a className="underline" href="https://github.com/NotRithik/DiraFrontendV2" target="_blank" rel="noreferrer">Frontend repo</a></li>
            <li><a className="underline" href="https://github.com/NotRithik/StableDira" target="_blank" rel="noreferrer">Contracts repo</a></li>
            <li><a className="underline" href="https://github.com/NotRithik/StableDira/issues" target="_blank" rel="noreferrer">Issues & Roadmap</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-8 md:px-16 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Dira Foundation</p>
          <p>Contact: <span className="select-text">contact@dira.foundation</span></p>
        </div>
      </div>
    </footer>
  );
}