// src/components/TransactionInput.tsx
"use client";

import React from 'react';
import Decimal from 'decimal.js';

interface TransactionInputProps {
  mode: 'add' | 'remove';
  onModeChange: (mode: 'add' | 'remove') => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  addLabel: string;
  removeLabel: string;
  unit: string;
  maxAmount: number;
  balance: number;
  variant: 'yellow' | 'orange';
  precision: number; 
}

export function TransactionInput({
  mode,
  onModeChange,
  amount,
  onAmountChange,
  addLabel,
  removeLabel,
  maxAmount,
  balance,
  variant,
  precision,
}: TransactionInputProps) {
  const isAdd = mode === 'add';

  const handleSetMax = () => {
    const max = isAdd ? balance : maxAmount;
    onAmountChange(new Decimal(max).toFixed(precision));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value && !/^[0-9]*\.?[0-9]*$/.test(value)) {
      return;
    }

    if (value.includes('.')) {
        const decimalPart = value.split('.')[1];
        if (decimalPart && decimalPart.length > precision) {
            return; 
        }
    }

    try {
      if (value) {
        const numericValue = new Decimal(value);
        const limit = new Decimal(isAdd ? balance : maxAmount);

        if (numericValue.greaterThan(limit)) {
          onAmountChange(limit.toFixed(precision));
          return;
        }
      }
    } catch (error) {
        console.error("Error handling input change:", error);
    }

    onAmountChange(value);
  };

  const borderColor = variant === 'yellow' ? 'border-black' : 'border-white';
  const textColor = variant === 'yellow' ? 'text-black' : 'text-white';
  const accentColor = variant === 'yellow' ? 'accent-black' : 'accent-white';
  
  return (
    <div className={`space-y-4 ${textColor}`}>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onModeChange('add')}
          className={`py-2 text-center uppercase font-bold border-4 cursor-pointer ${borderColor} ${isAdd ? (variant === 'yellow' ? 'bg-black text-yellow-400' : 'bg-white text-orange-600') : ''}`}
        >
          {addLabel}
        </button>
        <button
          onClick={() => onModeChange('remove')}
          className={`py-2 text-center uppercase font-bold border-4 cursor-pointer ${borderColor} ${!isAdd ? (variant === 'yellow' ? 'bg-black text-yellow-400' : 'bg-white text-orange-600') : ''}`}
        >
          {removeLabel}
        </button>
      </div>

      <div className={`relative flex items-center border-4 ${borderColor} bg-transparent`}>
        <span className="pl-4 text-3xl font-mono">{isAdd ? '+' : '-'}</span>
        <input
          type="text"
          pattern="[0-9]*\.?[0-9]*"
          placeholder="0"
          value={amount}
          onChange={handleInputChange}
          className={`w-full bg-transparent p-4 text-2xl font-mono placeholder:text-current/50 focus:outline-none ${accentColor}`}
        />
        <button onClick={handleSetMax} className="absolute right-4 uppercase text-sm font-bold underline cursor-pointer">Max</button>
      </div>
    </div>
  );
}