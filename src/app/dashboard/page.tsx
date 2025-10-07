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

const DECIMAL_PRECISION = 6;

const HamburgerIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="4" /><rect x="2" y="10" width="20" height="4" /><rect x="2" y="17" width="20" height="4" /></svg>
);
const calculateHealth = (collateral: number, dira: number, omPrice: number, liquidationRatio: number, safeRatio: number) => { if (liquidationRatio >= safeRatio || omPrice <= 0) return { ratio: Infinity, percentage: 100 }; const collateralValue = new Decimal(collateral).mul(omPrice); const debtValue = new Decimal(dira); if (debtValue.isZero()) return { ratio: Infinity, percentage: 100 }; const currentRatio = collateralValue.div(debtValue); const percentage = currentRatio.sub(liquidationRatio).div(new Decimal(safeRatio).sub(liquidationRatio)).mul(100); return { ratio: currentRatio.toNumber(), percentage: Math.max(0, Math.min(100, percentage.toNumber())) }; };


export default function DashboardPage() {
    const { isConnected } = useWallet();
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

    useEffect(() => {
        setSliderCollateralValue(confirmedLockedCollateral);
        setCollateralAmount('');
    }, [confirmedLockedCollateral]);

    useEffect(() => {
        setSliderDiraValue(confirmedMintedDira);
        setDiraAmount('');
    }, [confirmedMintedDira]);

    const updateCollateralSlider = (amount: string, mode: 'add' | 'remove') => {
        const change = new Decimal(amount || 0);
        const newSliderValue = mode === 'add' ? new Decimal(confirmedLockedCollateral).plus(change) : new Decimal(confirmedLockedCollateral).sub(change);
        setSliderCollateralValue(newSliderValue.toNumber());
    };

    const handleCollateralAmountChange = (amount: string) => {
        setCollateralAmount(amount);
        updateCollateralSlider(amount, collateralMode);
    };

    const handleSliderCollateralChange = (value: number) => {
        const diff = new Decimal(value).sub(confirmedLockedCollateral);
        const newMode = diff.isPositive() ? 'add' : 'remove';
        if (collateralMode !== newMode) {
          setCollateralMode(newMode);
        }
        setCollateralAmount(diff.abs().toDecimalPlaces(DECIMAL_PRECISION).toString());
        setSliderCollateralValue(value);
    };
    
    const handleCollateralModeChange = (newMode: 'add' | 'remove') => {
        setCollateralMode(newMode);
        const currentAmount = new Decimal(collateralAmount || 0);
        if (currentAmount.isZero()) return;
        const limit = newMode === 'add' ? new Decimal(walletOmBalance) : new Decimal(maxUnlockableCollateral);

        if (currentAmount.greaterThan(limit)) {
            const clampedStr = limit.toDecimalPlaces(DECIMAL_PRECISION).toString();
            setCollateralAmount(clampedStr);
            updateCollateralSlider(clampedStr, newMode);
        } else {
            updateCollateralSlider(collateralAmount, newMode);
        }
    };
    
    const updateDiraSlider = (amount: string, mode: 'add' | 'remove') => {
        const change = new Decimal(amount || 0);
        const newSliderValue = mode === 'add' ? new Decimal(confirmedMintedDira).plus(change) : new Decimal(confirmedMintedDira).sub(change);
        setSliderDiraValue(newSliderValue.toNumber());
    };

    const handleDiraAmountChange = (amount: string) => {
        setDiraAmount(amount);
        updateDiraSlider(amount, diraMode);
    };
    
    const handleSliderDiraChange = (value: number) => {
        const diff = new Decimal(value).sub(confirmedMintedDira);
        const newMode = diff.isPositive() ? 'add' : 'remove';
        if (diraMode !== newMode) {
            setDiraMode(newMode);
        }
        setDiraAmount(diff.abs().toDecimalPlaces(DECIMAL_PRECISION).toString());
        setSliderDiraValue(value);
    };
    
    const handleDiraModeChange = (newMode: 'add' | 'remove') => {
        setDiraMode(newMode);
        const currentAmount = new Decimal(diraAmount || 0);
        const limit = newMode === 'add' ? new Decimal(maxMintableDira).sub(confirmedMintedDira) : new Decimal(confirmedMintedDira);

        if (currentAmount.greaterThan(limit)) {
            const clampedStr = limit.toDecimalPlaces(DECIMAL_PRECISION).toString();
            setDiraAmount(clampedStr);
            updateDiraSlider(clampedStr, newMode);
        } else {
            updateDiraSlider(diraAmount, newMode);
        }
    };

    const { percentage: currentHealthPercentage } = calculateHealth(confirmedLockedCollateral, confirmedMintedDira, currentOmPrice, liquidationHealth, safeHealth);
    const { ratio: previewCollateralizationRatio, percentage: previewHealthPercentage } = calculateHealth(sliderCollateralValue, sliderDiraValue, currentOmPrice, liquidationHealth, safeHealth);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleApplyCollateral = () => {
        const amount = new Decimal(collateralAmount || 0);
        if (amount.isZero() || isLoading) return;
        if (collateralMode === 'add') lockCollateral(amount.toNumber());
        else unlockCollateral(amount.toNumber());
    };

    const handleApplyDira = () => {
        const amount = new Decimal(diraAmount || 0);
        if (amount.isZero() || isLoading) return;
        if (diraMode === 'add') mintDira(amount.toNumber());
        else returnDira(amount.toNumber());
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
                {!isConnected && (
                    <div className="border-8 border-black bg-white p-8 shadow-[8px_8px_0_#000] text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Welcome to Dira</h2>
                        <p className="mt-4 text-lg font-sans">Connect your wallet to manage your collateral, mint Dira, and view your position.</p>
                        <div className="mt-6 max-w-xs mx-auto"><ConnectButton/></div>
                    </div>
                )}
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
                            <TransactionInput precision={DECIMAL_PRECISION} mode={collateralMode} onModeChange={handleCollateralModeChange} amount={collateralAmount} onAmountChange={handleCollateralAmountChange} addLabel="Lock" removeLabel="Unlock" unit="OM" maxAmount={maxUnlockableCollateral} balance={walletOmBalance} variant="yellow" />
                            <InteractiveProgressBar currentValue={confirmedLockedCollateral} sliderValue={sliderCollateralValue} maxValue={totalOmBalance} onValueChange={handleSliderCollateralChange} baseColor="bg-black" previewAddColor="bg-orange-500" previewRemoveColor="bg-gray-400" />
                            <Button variant="white" className="w-full md:w-full disabled:cursor-not-allowed" onClick={handleApplyCollateral} disabled={numericCollateralAmount <= 0 || isLoading || !isConnected}>{isLoading ? "Processing..." : numericCollateralAmount > 0 ? `${collateralMode === 'add' ? 'Lock' : 'Unlock'} ${collateralAmount} OM` : 'Apply'}</Button>
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
                            <TransactionInput precision={DECIMAL_PRECISION} mode={diraMode} onModeChange={handleDiraModeChange} amount={diraAmount} onAmountChange={handleDiraAmountChange} addLabel="Mint" removeLabel="Return" unit="Dira" maxAmount={confirmedMintedDira} balance={Math.max(0, maxMintableDira - confirmedMintedDira)} variant="orange" />
                            <InteractiveProgressBar currentValue={confirmedMintedDira} sliderValue={sliderDiraValue} maxValue={maxMintableDira} onValueChange={handleSliderDiraChange} baseColor="bg-black" previewAddColor="bg-yellow-400" previewRemoveColor="bg-gray-400" />
                            <Button variant="white" className="w-full md:w-full disabled:cursor-not-allowed" onClick={handleApplyDira} disabled={numericDiraAmount <= 0 || isLoading || !isConnected}>{isLoading ? "Processing..." : numericDiraAmount > 0 ? `${diraMode === 'add' ? 'Mint' : 'Return'} ${diraAmount} Dira` : 'Apply'}</Button>
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