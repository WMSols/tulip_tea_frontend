import { Wallet as WalletIcon } from "lucide-react";

export default function WalletHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-primary/10">
        <WalletIcon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Wallet Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage balances and collect from your team
        </p>
      </div>
    </div>
  );
}
