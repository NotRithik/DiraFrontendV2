// src/components/ConnectButton.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/Button';
import { toast } from 'sonner';

// A simple spinner component for the loading state
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// The dropdown menu component
function WalletDropdown({ address, onDisconnect, onClose }: { address: string; onDisconnect: () => void; onClose: () => void; }) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-64 border-4 border-black bg-white shadow-[4px_4px_0_#000] z-20">
      <div className="p-4 space-y-3">
        <p className="font-sans text-sm break-all text-black">{address}</p>
        <Button variant="outline" onClick={handleCopy} className="w-full text-sm py-2">Copy Address</Button>
        <Button variant="secondary" onClick={onDisconnect} className="w-full text-sm py-2">Disconnect</Button>
      </div>
    </div>
  );
}


export function ConnectButton() {
  const { isConnected, isConnecting, address, connectWallet, disconnectWallet } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <Button variant="primary" className="w-full md:w-full" onClick={() => setIsDropdownOpen(prev => !prev)}>
          {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
        </Button>
        {isDropdownOpen && (
          <WalletDropdown 
            address={address} 
            onDisconnect={() => {
              disconnectWallet();
              setIsDropdownOpen(false);
            }} 
            onClose={() => setIsDropdownOpen(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      className="w-full md:w-full flex items-center justify-center gap-2"
      onClick={() => connectWallet()}
      disabled={isConnecting}
    >
      {isConnecting && <Spinner />}
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}