// src/components/TransactionInput.tsx
"use client";

import React from 'react';
import { Button } from './Button';
import Decimal from 'decimal.js'; // Import Decimal.js for precise comparisons

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
}: TransactionInputProps) {
  const isAdd = mode === 'add';

  const handleSetMax = () => {
    onAmountChange(String(isAdd ? balance : maxAmount));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 1. Allow only valid numeric characters (numbers and one decimal)
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      return; // Exit if invalid characters are typed
    }

    // 2. Enforce maximum value limit
    try {
      const numericValue = new Decimal(value || 0);
      const limit = new Decimal(isAdd ? balance : maxAmount);

      if (numericValue.greaterThan(limit)) {
        // If user types a number larger than the max, do not update the state.
        // This effectively stops them from typing anything larger.
        // You could also optionally set the value to the max here:
        // onAmountChange(limit.toString());
        return; 
      }
    } catch (error) {
      // Ignore errors from invalid intermediate states like "12."
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
          className={`py-2 text-center uppercase font-bold border-4 ${borderColor} ${isAdd ? (variant === 'yellow' ? 'bg-black text-yellow-400' : 'bg-white text-orange-600') : ''}`}
        >
          {addLabel}
        </button>
        <button
          onClick={() => onModeChange('remove')}
          className={`py-2 text-center uppercase font-bold border-4 ${borderColor} ${!isAdd ? (variant === 'yellow' ? 'bg-black text-yellow-400' : 'bg-white text-orange-600') : ''}`}
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
        <button onClick={handleSetMax} className="absolute right-4 uppercase text-sm font-bold underline">Max</button>
      </div>
    </div>
  );
}