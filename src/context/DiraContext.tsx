// src/context/DiraContext.tsx
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useWallet } from "./WalletContext"
import { Decimal } from "decimal.js"
import type { ExecuteMsg } from "@/types/ExecuteMsg"
import { toast } from "sonner"
import { WalletConnectionPopup } from "@/components/WalletConnectionPopup"

type Funds = { amount: string; denom: string; }[];

interface DiraContextType {
  lockedCollateral: number;
  mintedDira: number;
  walletOmBalance: number;
  currentOmPrice: number;
  liquidationHealth: number;
  mintableHealth: number;
  collateralDenom: string;
  isLoading: boolean;
  isConnectionPrompted: boolean;
  lockCollateral: (amount: number) => Promise<void>;
  unlockCollateral: (amount: number) => Promise<void>;
  mintDira: (amount: number) => Promise<void>;
  returnDira: (amount: number) => Promise<void>;
  connectWallet: () => void;
}

const DiraContext = createContext<DiraContextType | undefined>(undefined);

export function DiraProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, address, cosmWasmClient, getSigningClient, connectWallet: connectWalletFromParent } = useWallet();
  const [lockedCollateral, setLockedCollateral] = useState(0);
  const [mintedDira, setMintedDira] = useState(0);
  const [walletOmBalance, setWalletOmBalance] = useState(0);
  const [currentOmPrice, setCurrentOmPrice] = useState(0);
  const [liquidationHealth, setLiquidationHealth] = useState(0);
  const [mintableHealth, setMintableHealth] = useState(0);
  const [collateralDenom, setCollateralDenom] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [isConnectionPrompted, setIsConnectionPrompted] = useState(false);

  const pendingActionRef = useRef<(() => void) | null>(null);

  const contractAddress = process.env.NEXT_PUBLIC_DIRA_CONTRACT_ADDRESS!;
  const cw20ContractAddress = process.env.NEXT_PUBLIC_CW20_DIRA_CONTRACT_ADDRESS!;
  const testnetDenom = process.env.NEXT_PUBLIC_DENOM!;

  const fetchData = useCallback(async () => {
    if (!cosmWasmClient || !address) return;
    try {
      const balance = await cosmWasmClient.getBalance(address, testnetDenom);
      setWalletOmBalance(new Decimal(balance.amount).div(1e6).toNumber());
      const price = await cosmWasmClient.queryContractSmart(contractAddress, { query_collateral_price: {} });
      setCurrentOmPrice(new Decimal(price.collateral_price).toNumber());
      const locked = await cosmWasmClient.queryContractSmart(contractAddress, { query_locked_collateral: { wallet_address_to_query: address } });
      setLockedCollateral(new Decimal(locked.collateral_locked).toNumber());
      const minted = await cosmWasmClient.queryContractSmart(contractAddress, { query_minted_dira: { wallet_address_to_query: address } });
      setMintedDira(new Decimal(minted.dira_minted).toNumber());
      const liqHealth = await cosmWasmClient.queryContractSmart(contractAddress, { query_liquidation_health: {} });
      setLiquidationHealth(new Decimal(liqHealth.liquidation_health).toNumber());
      const mintHealth = await cosmWasmClient.queryContractSmart(contractAddress, { query_mintable_health: {} });
      setMintableHealth(new Decimal(mintHealth.mintable_health).toNumber());
      const denom = await cosmWasmClient.queryContractSmart(contractAddress, { query_collateral_token_denom: {} });
      setCollateralDenom(denom.collateral_token_denom);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [cosmWasmClient, address, contractAddress, testnetDenom]);

  useEffect(() => {
    if (isConnected) {
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    } else {
      setLockedCollateral(0);
      setMintedDira(0);
      setWalletOmBalance(0);
    }
  }, [isConnected, fetchData]);

  const checkWalletConnection = (action: () => void): boolean => {
    if (!isConnected) {
      setIsWalletPopupOpen(true);
      pendingActionRef.current = action;
      setIsConnectionPrompted(true);
      setTimeout(() => setIsConnectionPrompted(false), 2500);
      return false;
    }
    return true;
  };

  const executeContract = async (message: ExecuteMsg, funds?: Funds) => {
    if (!checkWalletConnection(() => executeContract(message, funds))) return;
    setIsLoading(true);
    try {
      const signingClient = await getSigningClient();
      if (!signingClient || !address) throw new Error("Failed to get signing client.");
      const fee = { amount: [{ amount: "5000", denom: testnetDenom }], gas: "500000" };
      await signingClient.execute(address, contractAddress, message, fee, undefined, funds);
      toast.success("Transaction successful!");
      await fetchData();
    } catch (error) {
      console.error("Error during execution:", error);
      toast.error(`Transaction failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWalletPopupConnect = useCallback(() => {
    setIsWalletPopupOpen(false);
    connectWalletFromParent(() => {
      if (pendingActionRef.current) {
        pendingActionRef.current();
        pendingActionRef.current = null;
      }
    });
  }, [connectWalletFromParent]);

  const lockCollateral = async (amount: number) => {
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    const amountInMicroOM = new Decimal(amount).mul(1e6);
    const message: ExecuteMsg = { lock_collateral: {} };
    const funds = [{ denom: collateralDenom, amount: amountInMicroOM.toString() }];
    await executeContract(message, funds);
  };

  const unlockCollateral = async (amount: number) => {
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    const message: ExecuteMsg = { unlock_collateral: { collateral_amount_to_unlock: new Decimal(amount).toString() } };
    await executeContract(message);
  };

  const mintDira = async (amount: number) => {
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    const message: ExecuteMsg = { mint_dira: { dira_to_mint: new Decimal(amount).toString() } };
    await executeContract(message);
  };

  const returnDira = async (amount: number) => {
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    const increaseAllowanceMsg = {
      increase_allowance: { spender: contractAddress, amount: new Decimal(amount).mul(1e6).toFixed(0), expires: { never: {} } }
    };
    const burnDiraMsg: ExecuteMsg = { burn_dira: { dira_to_burn: new Decimal(amount).toString() } };
    
    setIsLoading(true);
    try {
      const signingClient = await getSigningClient();
      if (!signingClient || !address) throw new Error("Failed to get signing client.");
      const allowanceFee = { amount: [{ amount: "5000", denom: testnetDenom }], gas: "300000" };
      await signingClient.execute(address, cw20ContractAddress, increaseAllowanceMsg, allowanceFee);
      const burnFee = { amount: [{ amount: "5000", denom: testnetDenom }], gas: "600000" };
      await signingClient.execute(address, contractAddress, burnDiraMsg, burnFee);
      toast.success("Successfully returned Dira!");
      await fetchData();
    } catch (error) {
      console.error("Error returning Dira:", error);
      toast.error(`Failed to return Dira: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DiraContext.Provider
      value={{
        lockedCollateral, mintedDira, walletOmBalance, currentOmPrice,
        liquidationHealth, mintableHealth, collateralDenom,
        lockCollateral, unlockCollateral, mintDira, returnDira,
        isLoading,
        isConnectionPrompted,
        connectWallet: connectWalletFromParent,
      }}
    >
      <WalletConnectionPopup
        isOpen={isWalletPopupOpen}
        onClose={() => setIsWalletPopupOpen(false)}
        onConnect={handleConnectWalletPopupConnect}
      />
      {children}
    </DiraContext.Provider>
  );
}

export function useDira() {
  const context = useContext(DiraContext);
  if (context === undefined) {
    throw new Error("useDira must be used within a DiraProvider");
  }
  return context;
}