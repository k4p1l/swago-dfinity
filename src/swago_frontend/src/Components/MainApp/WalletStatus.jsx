import { useConnect } from "@connect2ic/react";

export const WalletStatus = () => {
  const { isConnected, principal, activeProvider } = useConnect();

  if (!isConnected) return null;

  return (
    <div className="bg-[#1e293b] p-4 rounded-lg mb-6">
      <p className="text-sm text-gray-400">Connected Wallet</p>
      <p className="font-mono">{principal}</p>
      <p className="text-sm text-gray-400 mt-2">Provider</p>
      <p>{activeProvider?.meta?.name}</p>
    </div>
  );
};
