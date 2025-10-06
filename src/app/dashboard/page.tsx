// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { InteractiveProgressBar } from "@/components/InteractiveProgressBar";
import { PositionHealthBar } from "@/components/PositionHealthBar";
import { ConnectButton } from "@/components/ConnectButton";
import Decimal from "decimal.js";
import { TransactionInput } from "@/components/TransactionInput";
import { useDira } from "@/context/DiraContext";
import { useWallet } from "@/context/WalletContext";

const HamburgerIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="4" /><rect x="2" y="10" width="20" height="4" /><rect x="2" y="17" width="20" height="4" /></svg>
);
const calculateHealth = (collateral: number, dira: number, omPrice: number, liquidationRatio: number, safeRatio: number) => { if (liquidationRatio >= safeRatio || omPrice <= 0) return { ratio: Infinity, percentage: 100 }; const collateralValue = new Decimal(collateral).mul(omPrice); const debtValue = new Decimal(dira); if (debtValue.isZero()) return { ratio: Infinity, percentage: 100 }; const currentRatio = collateralValue.div(debtValue); const percentage = currentRatio.sub(liquidationRatio).div(new Decimal(safeRatio).sub(liquidationRatio)).mul(100); return { ratio: currentRatio.toNumber(), percentage: Math.max(0, Math.min(100, percentage.toNumber())) }; };


export default function DashboardPage() {
    const {
        lockedCollateral: confirmedLockedCollateral,
        mintedDira: confirmedMintedDira,
        walletOmBalance,
        currentOmPrice,
        liquidationHealth,
        mintableHealth: safeHealth,
        lockCollateral,
        unlockCollateral,
        mintDira,
        returnDira,
        isLoading,
    } = useDira();

    const [collateralMode, setCollateralMode] = useState<'add' | 'remove'>('add');
    const [collateralAmount, setCollateralAmount] = useState('');
    const [sliderCollateralValue, setSliderCollateralValue] = useState(confirmedLockedCollateral);

    const [diraMode, setDiraMode] = useState<'add' | 'remove'>('add');
    const [diraAmount, setDiraAmount] = useState('');
    const [sliderDiraValue, setSliderDiraValue] = useState(confirmedMintedDira);

    const totalOmBalance = new Decimal(confirmedLockedCollateral).plus(walletOmBalance).toNumber();
    const maxMintableDira = safeHealth > 0 && currentOmPrice > 0 ? new Decimal(confirmedLockedCollateral).mul(currentOmPrice).div(safeHealth).toNumber() : 0;
    const maxUnlockableCollateral = (safeHealth > 0 && currentOmPrice > 0 && confirmedMintedDira > 0) ? Math.max(0, new Decimal(confirmedLockedCollateral).sub(new Decimal(confirmedMintedDira).mul(safeHealth).div(currentOmPrice)).toNumber()) : confirmedLockedCollateral;

    // Sync Input -> Slider
    useEffect(() => {
        const change = new Decimal(collateralAmount || 0);
        if (collateralMode === 'add') {
            const finalChange = Decimal.min(change, new Decimal(walletOmBalance));
            setSliderCollateralValue(new Decimal(confirmedLockedCollateral).plus(finalChange).toNumber());
        } else {
            const finalChange = Decimal.min(change, new Decimal(maxUnlockableCollateral));
            setSliderCollateralValue(new Decimal(confirmedLockedCollateral).sub(finalChange).toNumber());
        }
    }, [collateralAmount, collateralMode]);

    useEffect(() => {
        const change = new Decimal(diraAmount || 0);
        if (diraMode === 'add') {
            const maxMintChange = new Decimal(maxMintableDira).sub(confirmedMintedDira);
            const finalChange = Decimal.min(change, maxMintChange);
            setSliderDiraValue(new Decimal(confirmedMintedDira).plus(finalChange).toNumber());
        } else {
            const maxReturnChange = new Decimal(confirmedMintedDira);
            const finalChange = Decimal.min(change, maxReturnChange);
            setSliderDiraValue(new Decimal(confirmedMintedDira).sub(finalChange).toNumber());
        }
    }, [diraAmount, diraMode]);

    // Sync Slider -> Input
    useEffect(() => {
        const diff = new Decimal(sliderCollateralValue).sub(confirmedLockedCollateral);
        if (diff.abs().lessThan(0.01)) { setCollateralAmount(''); return; }
        setCollateralMode(diff.isPositive() ? 'add' : 'remove');
        setCollateralAmount(diff.abs().toDecimalPlaces(2).toString());
    }, [sliderCollateralValue]);

    useEffect(() => {
        const diff = new Decimal(sliderDiraValue).sub(confirmedMintedDira);
        if (diff.abs().lessThan(0.01)) { setDiraAmount(''); return; }
        setDiraMode(diff.isPositive() ? 'add' : 'remove');
        setDiraAmount(diff.abs().toDecimalPlaces(2).toString());
    }, [sliderDiraValue]);

    // Reset sliders when confirmed values change
    useEffect(() => { setSliderCollateralValue(confirmedLockedCollateral); }, [confirmedLockedCollateral]);
    useEffect(() => { setSliderDiraValue(confirmedMintedDira); }, [confirmedMintedDira]);

    const { percentage: currentHealthPercentage } = calculateHealth(confirmedLockedCollateral, confirmedMintedDira, currentOmPrice, liquidationHealth, safeHealth);
    const { ratio: previewCollateralizationRatio, percentage: previewHealthPercentage } = calculateHealth(sliderCollateralValue, sliderDiraValue, currentOmPrice, liquidationHealth, safeHealth);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleApplyCollateral = () => {
        const amount = new Decimal(collateralAmount || 0);
        if (amount.isZero() || isLoading) return;
        if (collateralMode === 'add') lockCollateral(amount.toNumber());
        else unlockCollateral(amount.toNumber());
        setCollateralAmount('');
    };

    const handleApplyDira = () => {
        const amount = new Decimal(diraAmount || 0);
        if (amount.isZero() || isLoading) return;
        if (diraMode === 'add') mintDira(amount.toNumber());
        else returnDira(amount.toNumber());
        setDiraAmount('');
    };

    const numericCollateralAmount = parseFloat(collateralAmount) || 0;
    const numericDiraAmount = parseFloat(diraAmount) || 0;

    return (
        <div className="text-black min-h-screen font-sans bg-[url('/assets/dubai_skyline.png')] bg-cover bg-bottom bg-fixed">
            <nav className="bg-[#E94E1B] border-b-8 border-black px-8 md:px-16 py-4 flex items-center justify-between relative">
                <Link href="/" className="text-3xl md:text-4xl font-extrabold uppercase text-white">DIRA</Link>
                <div className="hidden md:grid md:grid-cols-2 gap-4 max-w-xl w-full">
                    <Link href="/" className="block w-full"><Button variant="white" className="w-full md:w-full">Home</Button></Link>
                    <ConnectButton />
                </div>
                <button className="md:hidden text-white cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu"><HamburgerIcon /></button>
                {isMenuOpen && (<div className="md:hidden absolute top-full left-0 right-0 bg-[#E94E1B] border-b-8 border-black px-8 py-4 z-10"><div className="grid grid-cols-1 gap-4"><Link href="/"><Button variant="white" className="w-full">Home</Button></Link><ConnectButton /></div></div>)}
            </nav>

            <main className="max-w-6xl mx-auto px-8 md:px-16 py-12 flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="border-8 border-black bg-yellow-400 p-8 flex flex-col justify-between shadow-[8px_8px_0_#000]">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Collateral (OM)</h2>
                            <div className="mt-6 space-y-4">
                                <p className="font-sans text-xl">Locked: {confirmedLockedCollateral.toFixed(2)} OM</p>
                                <p className="font-sans text-xl">Wallet Balance: {walletOmBalance.toFixed(2)} OM</p>
                            </div>
                        </div>
                        <div className="mt-auto pt-6 space-y-4">
                            <TransactionInput mode={collateralMode} onModeChange={setCollateralMode} amount={collateralAmount} onAmountChange={setCollateralAmount} addLabel="Lock" removeLabel="Unlock" unit="OM" maxAmount={maxUnlockableCollateral} balance={walletOmBalance} variant="yellow" />
                            <InteractiveProgressBar currentValue={confirmedLockedCollateral} sliderValue={sliderCollateralValue} maxValue={totalOmBalance} onValueChange={setSliderCollateralValue} baseColor="bg-black" previewAddColor="bg-orange-500" previewRemoveColor="bg-gray-400" />
                            <Button variant="white" className="w-full md:w-full" onClick={handleApplyCollateral} disabled={numericCollateralAmount <= 0 || isLoading}>{isLoading ? "Processing..." : numericCollateralAmount > 0 ? `${collateralMode === 'add' ? 'Lock' : 'Unlock'} ${collateralAmount} OM` : 'Apply'}</Button>
                        </div>
                    </div>

                    <div className="border-8 border-black bg-orange-600 p-8 flex flex-col justify-between shadow-[8px_8px_0_#000] text-white">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Dira (AED)</h2>
                            <div className="mt-6 space-y-4">
                                <p className="font-sans text-xl">Minted: {confirmedMintedDira.toFixed(2)} Dira</p>
                                <p className="font-sans text-xl">Mintable: {Math.max(0, maxMintableDira - confirmedMintedDira).toFixed(2)} Dira</p>
                            </div>
                        </div>
                        <div className="mt-auto pt-6 space-y-4">
                            <TransactionInput mode={diraMode} onModeChange={setDiraMode} amount={diraAmount} onAmountChange={setDiraAmount} addLabel="Mint" removeLabel="Return" unit="Dira" maxAmount={confirmedMintedDira} balance={Math.max(0, maxMintableDira - confirmedMintedDira)} variant="orange" />
                            <InteractiveProgressBar currentValue={confirmedMintedDira} sliderValue={sliderDiraValue} maxValue={maxMintableDira} onValueChange={setSliderDiraValue} baseColor="bg-black" previewAddColor="bg-yellow-400" previewRemoveColor="bg-gray-400" />
                            <Button variant="white" className="w-full md:w-full" onClick={handleApplyDira} disabled={numericDiraAmount <= 0 || isLoading}>{isLoading ? "Processing..." : numericDiraAmount > 0 ? `${diraMode === 'add' ? 'Mint' : 'Return'} ${diraAmount} Dira` : 'Apply'}</Button>
                        </div>
                    </div>
                </div>

                <div className="border-8 border-black bg-white p-8 shadow-[8px_8px_0_#000]">
                    <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Position Health</h2>
                    <p className="mt-2 text-xl font-sans">
                        Collateralization: {isFinite(previewCollateralizationRatio) ? `${(previewCollateralizationRatio * 100).toFixed(0)}%` : 'N/A'}
                    </p>
                    <PositionHealthBar currentHealth={currentHealthPercentage} previewHealth={previewHealthPercentage} />
                </div>
            </main>
        </div>
    );
}