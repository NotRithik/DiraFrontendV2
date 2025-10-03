// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { InteractiveProgressBar } from "@/components/InteractiveProgressBar";
import { PositionHealthBar } from "@/components/PositionHealthBar";
import { useWallet } from "@/context/WalletContext";
import { useDira } from "@/context/DiraContext";
import Decimal from "decimal.js";

// A brutalist-style hamburger icon component
const HamburgerIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="4" />
        <rect x="2" y="10" width="20" height="4" />
        <rect x="2" y="17" width="20" height="4" />
    </svg>
);

// Health calculation logic extracted into a reusable function
const calculateHealth = (collateral: number, dira: number, omPrice: number, liquidationRatio: number, safeRatio: number) => {
    if (liquidationRatio >= safeRatio) return { ratio: Infinity, percentage: 100 };

    const collateralValue = new Decimal(collateral).mul(omPrice);
    const debtValue = new Decimal(dira);

    if (debtValue.isZero()) {
        return { ratio: Infinity, percentage: 100 };
    }

    const currentRatio = collateralValue.div(debtValue);
    const percentage = currentRatio.sub(liquidationRatio).div(new Decimal(safeRatio).sub(liquidationRatio)).mul(100);
    
    return { 
        ratio: currentRatio.toNumber(), 
        percentage: Math.max(0, Math.min(100, percentage.toNumber())) 
    };
};

export default function DashboardPage() {
    // --- Consume Contexts ---
    const { connectWallet, checkWalletConnection } = useDira();
    const { isConnected, address } = useWallet();
    const {
        lockedCollateral: confirmedLockedCollateral,
        mintedDira: confirmedMintedDira,
        walletOmBalance,
        currentOmPrice,
        liquidationHealth,
        mintableHealth: safeHealth, // Assuming mintableHealth is the "safe" ratio
        lockCollateral,
        unlockCollateral,
        mintDira,
        returnDira,
    } = useDira();

    const totalOmBalance = new Decimal(confirmedLockedCollateral).plus(walletOmBalance).toNumber();
    // Max mintable Dira is based on locked collateral, not total balance
    const maxMintableDira = safeHealth > 0 ? new Decimal(confirmedLockedCollateral).mul(currentOmPrice).div(safeHealth).toNumber() : 0;

    // --- UI State for Sliders ---
    const [sliderCollateralValue, setSliderCollateralValue] = useState(confirmedLockedCollateral);
    const [sliderDiraValue, setSliderDiraValue] = useState(confirmedMintedDira);
    
    useEffect(() => { setSliderCollateralValue(confirmedLockedCollateral); }, [confirmedLockedCollateral]);
    useEffect(() => { setSliderDiraValue(confirmedMintedDira); }, [confirmedMintedDira]);

    // --- Health Calculation States ---
    const [currentHealthPercentage, setCurrentHealthPercentage] = useState(0);
    const [previewHealthPercentage, setPreviewHealthPercentage] = useState(0);
    const [previewCollateralizationRatio, setPreviewCollateralizationRatio] = useState(0);

    // Effect for CURRENT health
    useEffect(() => {
        const { percentage } = calculateHealth(confirmedLockedCollateral, confirmedMintedDira, currentOmPrice, liquidationHealth, safeHealth);
        setCurrentHealthPercentage(percentage);
    }, [confirmedLockedCollateral, confirmedMintedDira, currentOmPrice, liquidationHealth, safeHealth]);

    // Effect for PREVIEW health
    useEffect(() => {
        const { ratio, percentage } = calculateHealth(sliderCollateralValue, sliderDiraValue, currentOmPrice, liquidationHealth, safeHealth);
        setPreviewHealthPercentage(percentage);
        setPreviewCollateralizationRatio(ratio);
    }, [sliderCollateralValue, sliderDiraValue, currentOmPrice, liquidationHealth, safeHealth]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- Action Handlers ---
    const handleApplyCollateral = () => {
        const diff = new Decimal(sliderCollateralValue).sub(confirmedLockedCollateral);
        if (diff.isZero()) return;
        
        if (diff.isPositive()) {
            // Lock more collateral
            checkWalletConnection(() => lockCollateral(diff.toNumber()));
        } else {
            // Unlock collateral
            checkWalletConnection(() => unlockCollateral(diff.abs().toNumber()));
        }
    };

    const handleApplyDira = () => {
        const diff = new Decimal(sliderDiraValue).sub(confirmedMintedDira);
        if (diff.isZero()) return;

        if (diff.isPositive()) {
            // Mint more Dira
            checkWalletConnection(() => mintDira(diff.toNumber()));
        } else {
            // Return/Burn Dira
            checkWalletConnection(() => returnDira(diff.abs().toNumber()));
        }
    };

    return (
        <div className="text-black min-h-screen font-sans bg-[url('/assets/dubai_skyline.png')] bg-cover bg-bottom bg-fixed">
            {/* Navbar */}
            <nav className="bg-[#E94E1B] border-b-8 border-black px-8 md:px-16 py-4 flex items-center justify-between relative">
                <Link href="/" className="text-3xl md:text-4xl font-extrabold uppercase text-white">DIRA</Link>
                <div className="hidden md:grid md:grid-cols-2 gap-4 max-w-xl w-full">
                    <Link href="/" className="block w-full"><Button variant="white" className="w-full md:w-full">Home</Button></Link>
                    <Button variant="primary" className="w-full md:w-full" onClick={connectWallet}>
                        {isConnected ? `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}` : "Connect Wallet"}
                    </Button>
                </div>
                <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu"><HamburgerIcon /></button>
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-[#E94E1B] border-b-8 border-black px-8 py-4 z-10">
                        <div className="grid grid-cols-1 gap-4">
                            <Link href="/"><Button variant="white" className="w-full">Home</Button></Link>
                            <Button variant="primary" className="w-full" onClick={connectWallet}>
                                {isConnected ? `${address?.substring(0, 6)}...` : "Connect Wallet"}
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Top Summary Bar */}
            <section className="hidden md:block border-b-8 border-black bg-yellow-400">
                <div className="max-w-6xl mx-auto px-8 md:px-16 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div><h3 className="text-2xl md:text-3xl font-extrabold uppercase">Locked Collateral</h3><p className="text-3xl md:text-4xl font-sans mt-2">{confirmedLockedCollateral.toFixed(2)} OM</p></div>
                    <div><h3 className="text-2xl md:text-3xl font-extrabold uppercase">Minted Dira</h3><p className="text-3xl md:text-4xl font-sans mt-2">{confirmedMintedDira.toFixed(2)} Dira</p></div>
                    <div><h3 className="text-2xl md:text-3xl font-extrabold uppercase">Mintable Capacity</h3><p className="text-3xl md:text-4xl font-sans mt-2">{Math.max(0, maxMintableDira - confirmedMintedDira).toFixed(2)} Dira</p></div>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-8 md:px-16 py-12 flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Collateral Card */}
                    <div className="border-8 border-black bg-yellow-400 p-8 flex flex-col justify-between shadow-[8px_8px_0_#000]">
                        <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Collateral (OM)</h2>
                        <div className="mt-6 space-y-4">
                            <p className="font-sans text-xl">Locked: {confirmedLockedCollateral.toFixed(2)} / {totalOmBalance.toFixed(2)} OM</p>
                            <p className="font-sans text-xl">Wallet Balance: {walletOmBalance.toFixed(2)} OM</p>
                        </div>
                        <InteractiveProgressBar currentValue={confirmedLockedCollateral} sliderValue={sliderCollateralValue} maxValue={totalOmBalance} onValueChange={setSliderCollateralValue} baseColor="bg-black" previewAddColor="bg-orange-500" previewRemoveColor="bg-gray-400"/>
                        <Button variant="white" className="mt-8" onClick={handleApplyCollateral}>Apply</Button>
                    </div>

                    {/* Dira Card */}
                    <div className="border-8 border-black bg-orange-600 p-8 flex flex-col justify-between shadow-[8px_8px_0_#000] text-white">
                        <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Dira (AED)</h2>
                        <div className="mt-6 space-y-4">
                            <p className="font-sans text-xl">Minted: {confirmedMintedDira.toFixed(2)} / {maxMintableDira.toFixed(2)} Dira</p>
                            <p className="font-sans text-xl">Mintable: {Math.max(0, maxMintableDira - confirmedMintedDira).toFixed(2)} Dira</p>
                        </div>
                        <InteractiveProgressBar currentValue={confirmedMintedDira} sliderValue={sliderDiraValue} maxValue={maxMintableDira} onValueChange={setSliderDiraValue} baseColor="bg-black" previewAddColor="bg-yellow-400" previewRemoveColor="bg-gray-400"/>
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