// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { InteractiveProgressBar } from "@/components/InteractiveProgressBar";
import { PositionHealthBar } from "@/components/PositionHealthBar"; // Import the new component

// A brutalist-style hamburger icon component
const HamburgerIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="4" />
        <rect x="2" y="10" width="20" height="4" />
        <rect x="2" y="17" width="20" height="4" />
    </svg>
);

// Health calculation logic extracted into a reusable function
const calculateHealth = (collateral: number, dira: number) => {
    const OM_PRICE_IN_AED = 5;
    const LIQUIDATION_RATIO = 1.5; // 150%
    const SAFE_RATIO = 3.0; // 300%

    const collateralValue = collateral * OM_PRICE_IN_AED;
    const debtValue = dira;

    if (debtValue === 0) {
        return { ratio: Infinity, percentage: 100 };
    }

    const currentRatio = collateralValue / debtValue;
    const percentage = ((currentRatio - LIQUIDATION_RATIO) / (SAFE_RATIO - LIQUIDATION_RATIO)) * 100;
    
    return { ratio: currentRatio, percentage: Math.max(0, Math.min(100, percentage)) };
};


export default function DashboardPage() {
    // --- State Management ---
    const [lockedCollateral, setLockedCollateral] = useState(120);
    const [walletOmBalance, setWalletOmBalance] = useState(80);
    const [mintedDira, setMintedDira] = useState(50);
    const maxMintableDira = 80;

    const [sliderCollateralValue, setSliderCollateralValue] = useState(lockedCollateral);
    const [sliderDiraValue, setSliderDiraValue] = useState(mintedDira);
    
    useEffect(() => { setSliderCollateralValue(lockedCollateral); }, [lockedCollateral]);
    useEffect(() => { setSliderDiraValue(mintedDira); }, [mintedDira]);

    // --- Health Calculation States ---
    const [currentHealthPercentage, setCurrentHealthPercentage] = useState(0);
    const [previewHealthPercentage, setPreviewHealthPercentage] = useState(0);
    const [previewCollateralizationRatio, setPreviewCollateralizationRatio] = useState(0);

    // Effect for CURRENT health (based on locked values)
    useEffect(() => {
        const { percentage } = calculateHealth(lockedCollateral, mintedDira);
        setCurrentHealthPercentage(percentage);
    }, [lockedCollateral, mintedDira]);

    // Effect for PREVIEW health (based on slider values)
    useEffect(() => {
        const { ratio, percentage } = calculateHealth(sliderCollateralValue, sliderDiraValue);
        setPreviewHealthPercentage(percentage);
        setPreviewCollateralizationRatio(ratio);
    }, [sliderCollateralValue, sliderDiraValue]);


    const totalOmBalance = lockedCollateral + walletOmBalance;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleApplyCollateral = () => {
        const difference = lockedCollateral - sliderCollateralValue;
        setWalletOmBalance(walletOmBalance + difference);
        setLockedCollateral(sliderCollateralValue);
    };

    const handleApplyDira = () => {
        setMintedDira(sliderDiraValue);
    };

    return (
        <div className="text-black min-h-screen font-sans bg-[url('/assets/dubai_skyline.png')] bg-cover bg-bottom bg-fixed">
            {/* Navbar */}
            <nav className="bg-[#E94E1B] border-b-8 border-black px-8 md:px-16 py-4 flex items-center justify-between relative">
                <Link href="/" className="text-3xl md:text-4xl font-extrabold uppercase text-white">DIRA</Link>
                <div className="hidden md:grid md:grid-cols-2 gap-4 max-w-xl w-full">
                    <Link href="/" className="block w-full"><Button variant="white" className="w-full md:w-full">Home</Button></Link>
                    <Button variant="primary" className="w-full md:w-full">Connect Wallet</Button>
                </div>
                <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu"><HamburgerIcon /></button>
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-[#E94E1B] border-b-8 border-black px-8 py-4 z-10">
                        <div className="grid grid-cols-1 gap-4">
                            <Link href="/"><Button variant="white" className="w-full">Home</Button></Link>
                            <Button variant="primary" className="w-full">Connect Wallet</Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Top Summary Bar */}
            <section className="hidden md:block border-b-8 border-black bg-yellow-400">
                <div className="max-w-6xl mx-auto px-8 md:px-16 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div><h3 className="text-2xl md:text-3xl font-extrabold uppercase">Locked Collateral</h3><p className="text-3xl md:text-4xl font-sans mt-2">{lockedCollateral} OM</p></div>
                    <div><h3 className="text-2xl md:text-3xl font-extrabold uppercase">Minted Dira</h3><p className="text-3xl md:text-4xl font-sans mt-2">{mintedDira} Dira</p></div>
                    <div><h3 className="text-2xl md:text-3xl font-extrabold uppercase">Mintable Capacity</h3><p className="text-3xl md:text-4xl font-sans mt-2">{maxMintableDira - mintedDira} Dira</p></div>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-8 md:px-16 py-12 flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Collateral Card */}
                    <div className="border-8 border-black bg-yellow-400 p-8 flex flex-col justify-between shadow-[8px_8px_0_#000]">
                        <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Collateral (OM)</h2>
                        <div className="mt-6 space-y-4">
                            <p className="font-sans text-xl">Locked: {lockedCollateral} / {totalOmBalance} OM</p>
                            <p className="font-sans text-xl">Unlockable: {Math.max(0, lockedCollateral - 80)} OM</p>
                        </div>
                        <InteractiveProgressBar currentValue={lockedCollateral} sliderValue={sliderCollateralValue} maxValue={totalOmBalance} onValueChange={setSliderCollateralValue} baseColor="bg-black" previewAddColor="bg-orange-500" previewRemoveColor="bg-gray-400"/>
                        <Button variant="white" className="mt-8" onClick={handleApplyCollateral}>Apply</Button>
                    </div>

                    {/* Dira Card */}
                    <div className="border-8 border-black bg-orange-600 p-8 flex flex-col justify-between shadow-[8px_8px_0_#000] text-white">
                        <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Dira (AED)</h2>
                        <div className="mt-6 space-y-4">
                            <p className="font-sans text-xl">Minted: {mintedDira} / {maxMintableDira} Dira</p>
                            <p className="font-sans text-xl">Mintable: {maxMintableDira - mintedDira} Dira</p>
                        </div>
                        <InteractiveProgressBar currentValue={mintedDira} sliderValue={sliderDiraValue} maxValue={maxMintableDira} onValueChange={setSliderDiraValue} baseColor="bg-black" previewAddColor="bg-yellow-400" previewRemoveColor="bg-gray-400"/>
                        <Button variant="white" className="mt-8" onClick={handleApplyDira}>Apply</Button>
                    </div>
                </div>
                
                {/* Position Health Card */}
                <div className="border-8 border-black bg-white p-8 shadow-[8px_8px_0_#000]">
                    <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Position Health</h2>
                    <p className="mt-2 text-xl font-sans">
                        Collateralization: {isFinite(previewCollateralizationRatio) ? `${(previewCollateralizationRatio * 100).toFixed(0)}%` : 'N/A'}
                    </p>
                    <PositionHealthBar 
                        currentHealth={currentHealthPercentage}
                        previewHealth={previewHealthPercentage}
                    />
                </div>
            </main>
        </div>
    );
}