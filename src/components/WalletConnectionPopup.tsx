// src/components/WalletConnectionPopup.tsx
"use client";

import React from "react";
import { Button } from "@/components/Button";

interface WalletConnectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const WalletConnectionPopup: React.FC<WalletConnectionPopupProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Brutalist Card */}
      <div className="border-8 border-black bg-white p-8 shadow-[8px_8px_0_#000] max-w-md w-full mx-4">
        <h2 className="text-3xl font-extrabold uppercase">Connect Wallet</h2>
        <p className="mt-4 text-lg font-sans">
          You need to connect your Keplr wallet to perform this action.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button variant="white" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button variant="primary" onClick={onConnect} className="w-full">
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
};