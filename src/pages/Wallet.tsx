import { useState, useEffect, useCallback } from "react";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  X,
  Eye,
  Banknote,
  Loader2,
  Clock,
  Plus,
  Minus,
  Receipt,
  Users,
  CreditCard,
  TrendingUp,
  CircleDollarSign,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

// --- Config ---
const API_BASE = "https://tea-api.example.com"; // placeholder
const DISTRIBUTOR_ID = 1; // placeholder

// --- Types ---
interface WalletBalance {
  wallet_id: number;
  user_type: string;
  user_id: number;
  current_balance: number;
  is_active: boolean;
}

interface TeamWallet {
  wallet_id: number;
  user_type: string;
  user_id: number;
  user_name: string;
  user_phone: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
}

interface CollectionTrail {
  transaction_id: number;
  collection_id: number;
  shop_id: number;
  shop_name: string;
  shop_owner: string;
  route_id: number;
  route_name: string;
  zone_id: number;
  zone_name: string;
  collection_amount: number;
  collection_date: string;
  status: string;
}

interface Transaction {
  id: number;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  reference_type: string;
  reference_id: number;
  initiated_by_type: string;
  initiated_by_id: number;
  related_wallet_id: number;
  metadata: Record<string, unknown>;
  created_at: string;
  collection_trails: CollectionTrail[];
  trail_count: number;
  shop_name?: string;
  shop_id?: number;
  shop_owner?: string;
  route_id?: number;
  route_name?: string;
  zone_id?: number;
  zone_name?: string;
  initiated_by_name?: string;
  related_user_type?: string;
  related_user_id?: number;
  related_user_name?: string;
}

type WalletRow = TeamWallet & { id: number };

// --- Helpers ---
function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function roleBadge(userType: string) {
  if (userType === "order_booker")
    return <StatusBadge status="info" label="Order Booker" />;
  if (userType === "delivery_man")
    return <StatusBadge status="warning" label="Delivery Man" />;
  if (userType === "distributor")
    return <StatusBadge status="success" label="Distributor" />;
  return <StatusBadge status="neutral" label={userType} />;
}

function txTypeBadge(type: string) {
  switch (type) {
    case "transfer_in":
      return <StatusBadge status="success" label="Transfer In" />;
    case "transfer_out":
      return <StatusBadge status="danger" label="Transfer Out" />;
    case "credit":
      return <StatusBadge status="info" label="Credit" />;
    case "debit":
      return <StatusBadge status="warning" label="Debit" />;
    default:
      return <StatusBadge status="neutral" label={type} />;
  }
}

function isIncoming(type: string) {
  return type === "transfer_in" || type === "credit";
}

// --- Mock data for demo ---
const MOCK_BALANCE: WalletBalance = {
  wallet_id: 1,
  user_type: "distributor",
  user_id: 1,
  current_balance: 700.0,
  is_active: true,
};

const MOCK_WALLETS: TeamWallet[] = [
  {
    wallet_id: 4,
    user_type: "order_booker",
    user_id: 8,
    user_name: "Ahmed Khan",
    user_phone: "0300-1234567",
    current_balance: 1500.0,
    is_active: true,
    created_at: "2026-02-03T16:26:24.122830+00:00",
  },
  {
    wallet_id: 5,
    user_type: "delivery_man",
    user_id: 9,
    user_name: "Bilal Hussain",
    user_phone: "0312-9876543",
    current_balance: 800.0,
    is_active: true,
    created_at: "2026-02-03T16:30:00.000000+00:00",
  },
  {
    wallet_id: 6,
    user_type: "order_booker",
    user_id: 1,
    user_name: "Ob1",
    user_phone: "0321-1111111",
    current_balance: 0.0,
    is_active: true,
    created_at: "2026-01-20T10:00:00.000000+00:00",
  },
  {
    wallet_id: 7,
    user_type: "delivery_man",
    user_id: 10,
    user_name: "Farhan Ali",
    user_phone: "0333-5555555",
    current_balance: 250.0,
    is_active: false,
    created_at: "2026-01-15T08:00:00.000000+00:00",
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 30,
    transaction_type: "transfer_in",
    amount: 100.0,
    balance_before: 600.0,
    balance_after: 700.0,
    description: "Collection by distributor from order_booker",
    reference_type: "transfer",
    reference_id: 29,
    initiated_by_type: "distributor",
    initiated_by_id: 1,
    related_wallet_id: 6,
    metadata: {
      collection_type: "distributor_collection",
      transfer_amount: 100.0,
      collection_timestamp: "2026-02-09T15:09:33.490183",
      collected_by_distributor_id: 1,
      collected_by_distributor_name: "faraz",
    },
    created_at: "2026-02-09T15:09:34.737629+00:00",
    collection_trails: [
      {
        transaction_id: 18,
        collection_id: 17,
        shop_id: 2,
        shop_name: "test2",
        shop_owner: "mr test khan",
        route_id: 1,
        route_name: "Hello",
        zone_id: 1,
        zone_name: "islamabad, Pakistani",
        collection_amount: 1000.0,
        collection_date: "2026-02-05T15:24:20.886297+00:00",
        status: "pending",
      },
    ],
    trail_count: 1,
    shop_name: "test2",
    shop_id: 2,
    shop_owner: "mr test khan",
    route_id: 1,
    route_name: "Hello",
    zone_id: 1,
    zone_name: "islamabad, Pakistani",
    initiated_by_name: "faraz",
    related_user_type: "order_booker",
    related_user_id: 1,
    related_user_name: "Ob1",
  },
  {
    id: 28,
    transaction_type: "transfer_in",
    amount: 500.0,
    balance_before: 100.0,
    balance_after: 600.0,
    description: "Collection from delivery_man",
    reference_type: "transfer",
    reference_id: 27,
    initiated_by_type: "distributor",
    initiated_by_id: 1,
    related_wallet_id: 5,
    metadata: {},
    created_at: "2026-02-08T10:30:00.000000+00:00",
    collection_trails: [],
    trail_count: 0,
    initiated_by_name: "faraz",
    related_user_type: "delivery_man",
    related_user_id: 9,
    related_user_name: "Bilal Hussain",
  },
  {
    id: 25,
    transaction_type: "transfer_out",
    amount: 200.0,
    balance_before: 300.0,
    balance_after: 100.0,
    description: "Payment to supplier",
    reference_type: "payment",
    reference_id: 24,
    initiated_by_type: "distributor",
    initiated_by_id: 1,
    related_wallet_id: 0,
    metadata: {},
    created_at: "2026-02-07T08:00:00.000000+00:00",
    collection_trails: [],
    trail_count: 0,
    initiated_by_name: "faraz",
  },
];

// --- Component ---
export default function Wallet() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Data state
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [wallets, setWallets] = useState<TeamWallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState({
    balance: true,
    wallets: true,
    transactions: true,
  });

  // Team wallet filters
  const [roleFilter, setRoleFilter] = useState("all");

  // Collect modal
  const [collectTarget, setCollectTarget] = useState<TeamWallet | null>(null);
  const [collectAmount, setCollectAmount] = useState("");
  const [collectDesc, setCollectDesc] = useState("");
  const [collecting, setCollecting] = useState(false);

  // Transaction detail modal
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Transaction filters
  const [txTypeFilter, setTxTypeFilter] = useState("all");
  const [txUserFilter, setTxUserFilter] = useState("all");
  const [txDateFrom, setTxDateFrom] = useState("");
  const [txDateTo, setTxDateTo] = useState("");

  // Simulate data fetching
  const fetchData = useCallback(() => {
    setLoading({ balance: true, wallets: true, transactions: true });
    setTimeout(() => {
      setBalance(MOCK_BALANCE);
      setLoading((p) => ({ ...p, balance: false }));
    }, 600);
    setTimeout(() => {
      setWallets(MOCK_WALLETS);
      setLoading((p) => ({ ...p, wallets: false }));
    }, 900);
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading((p) => ({ ...p, transactions: false }));
    }, 1100);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered & sorted wallets
  const filteredWallets = wallets
    .filter((w) => roleFilter === "all" || w.user_type === roleFilter)
    .sort((a, b) => b.current_balance - a.current_balance);

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (txTypeFilter !== "all" && tx.transaction_type !== txTypeFilter)
      return false;
    if (txUserFilter !== "all") {
      const key = `${tx.related_user_id}-${tx.related_user_type}`;
      if (key !== txUserFilter) return false;
    }
    if (txDateFrom && new Date(tx.created_at) < new Date(txDateFrom))
      return false;
    if (txDateTo) {
      const to = new Date(txDateTo);
      to.setHours(23, 59, 59);
      if (new Date(tx.created_at) > to) return false;
    }
    return true;
  });

  // Collect handler
  const handleCollect = async () => {
    if (!collectTarget) return;
    const amount = parseFloat(collectAmount);
    if (!amount || amount <= 0 || amount > collectTarget.current_balance) {
      toast({
        title: "Invalid amount",
        description: `Enter between 1 and ${formatCurrency(collectTarget.current_balance)}`,
        variant: "destructive",
      });
      return;
    }
    setCollecting(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast({
      title: "Collection Successful",
      description: `Successfully collected ${formatCurrency(amount)} from ${collectTarget.user_name}`,
    });
    setWallets((prev) =>
      prev.map((w) =>
        w.wallet_id === collectTarget.wallet_id
          ? { ...w, current_balance: w.current_balance - amount }
          : w,
      ),
    );
    setBalance((prev) =>
      prev ? { ...prev, current_balance: prev.current_balance + amount } : prev,
    );
    setCollecting(false);
    setCollectTarget(null);
    setCollectAmount("");
    setCollectDesc("");
  };

  const clearTxFilters = () => {
    setTxTypeFilter("all");
    setTxUserFilter("all");
    setTxDateFrom("");
    setTxDateTo("");
  };

  const recentActivity = transactions.slice(0, 3);

  // --- DataTable data: wallets need an `id` field ---
  const walletTableData: WalletRow[] = filteredWallets.map((w) => ({
    ...w,
    id: w.wallet_id,
  }));

  // --- DataTable column definitions ---
  const walletColumns = [
    {
      key: "user_name",
      label: "User",
      render: (w: WalletRow) => (
        <div>
          <p className="font-medium text-foreground">{w.user_name}</p>
          <p className="text-xs text-muted-foreground">{w.user_phone}</p>
        </div>
      ),
    },
    {
      key: "user_type",
      label: "Role",
      render: (w: WalletRow) => roleBadge(w.user_type),
    },
    {
      key: "current_balance",
      label: "Balance",
      sortable: true,
      render: (w: WalletRow) => (
        <span
          className={cn(
            "font-semibold",
            w.current_balance > 0 ? "text-success" : "text-muted-foreground",
          )}
        >
          {formatCurrency(w.current_balance)}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (w: WalletRow) => (
        <StatusBadge
          status={w.is_active ? "success" : "danger"}
          label={w.is_active ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "action",
      label: "Action",
      className: "w-32",
      render: (w: WalletRow) => (
        <Button
          size="sm"
          disabled={w.current_balance <= 0}
          onClick={() => {
            setCollectTarget(w);
            setCollectAmount("");
            setCollectDesc("");
          }}
          className="gap-1.5"
        >
          <Banknote className="w-4 h-4" />
          Collect
        </Button>
      ),
    },
  ];

  const txColumns = [
    {
      key: "created_at",
      label: "Date",
      render: (tx: Transaction) => (
        <span className="text-sm whitespace-nowrap">
          {format(new Date(tx.created_at), "MMM d, yyyy h:mm a")}
        </span>
      ),
    },
    {
      key: "transaction_type",
      label: "Type",
      render: (tx: Transaction) => txTypeBadge(tx.transaction_type),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (tx: Transaction) => (
        <span
          className={cn(
            "font-semibold",
            isIncoming(tx.transaction_type)
              ? "text-success"
              : "text-destructive",
          )}
        >
          {isIncoming(tx.transaction_type) ? "+" : "-"}
          {formatCurrency(tx.amount)}
        </span>
      ),
    },
    {
      key: "balance_change",
      label: "Balance Change",
      render: (tx: Transaction) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatCurrency(tx.balance_before)} &rarr;{" "}
          {formatCurrency(tx.balance_after)}
        </span>
      ),
    },
    {
      key: "related_user_name",
      label: "From / To",
      render: (tx: Transaction) =>
        tx.related_user_name ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{tx.related_user_name}</span>
            {tx.related_user_type && roleBadge(tx.related_user_type)}
          </div>
        ) : (
          <span className="text-muted-foreground">&mdash;</span>
        ),
    },
    {
      key: "shop_name",
      label: "Shop",
      render: (tx: Transaction) =>
        tx.shop_name ? (
          <span className="flex items-center gap-1.5 text-sm">
            <Store className="w-3.5 h-3.5 text-muted-foreground" />
            {tx.shop_name}
          </span>
        ) : (
          <span className="text-muted-foreground">&mdash;</span>
        ),
    },
    {
      key: "details",
      label: "Details",
      className: "w-24",
      render: (tx: Transaction) => (
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 text-xs edit-btn-hover"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTx(tx);
          }}
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
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
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-5 py-2 text-sm gap-2"
          >
            <WalletIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Wallet Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-5 py-2 text-sm gap-2"
          >
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Transaction History</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        {/* ===================== TAB 1: OVERVIEW ===================== */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stat Cards */}
          {loading.balance || loading.wallets ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Current Balance"
                value={formatCurrency(balance?.current_balance ?? 0)}
                icon={CircleDollarSign}
                iconColor="bg-primary/10 text-primary"
                change={balance?.is_active ? "Wallet Active" : "Wallet Inactive"}
                changeType={balance?.is_active ? "positive" : "negative"}
              />
              <StatCard
                title="Team Members"
                value={wallets.length}
                icon={Users}
                iconColor="bg-info/10 text-info"
                change={`${wallets.filter((w) => w.user_type === "order_booker").length} Order Bookers`}
                changeType="neutral"
              />
              <StatCard
                title="Active Wallets"
                value={wallets.filter((w) => w.is_active).length}
                icon={CreditCard}
                iconColor="bg-success/10 text-success"
                change={`${wallets.filter((w) => !w.is_active).length} Inactive`}
                changeType="neutral"
              />
              <StatCard
                title="Team Balance"
                value={formatCurrency(
                  wallets.reduce((sum, w) => sum + w.current_balance, 0),
                )}
                icon={TrendingUp}
                iconColor="bg-warning/10 text-warning"
                change="Total held by team"
                changeType="neutral"
              />
            </div>
          )}

          {/* Team Wallets */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Team Wallets
                </h2>
                <p className="text-sm text-muted-foreground">
                  Collect money from your order bookers and delivery men
                </p>
              </div>
              {/* Role filter */}
              <div className="flex gap-1 bg-muted/40 p-1 rounded-lg">
                {[
                  { value: "all", label: "All" },
                  { value: "order_booker", label: "Order Bookers" },
                  { value: "delivery_man", label: "Delivery Men" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRoleFilter(opt.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      roleFilter === opt.value
                        ? "bg-card shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {loading.wallets ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredWallets.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <WalletIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No wallets found
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table via DataTable */}
                <div className="hidden lg:block">
                  <DataTable data={walletTableData} columns={walletColumns} />
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-3">
                  {filteredWallets.map((w) => (
                    <div key={w.wallet_id} className="mobile-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {w.user_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {w.user_phone}
                          </p>
                        </div>
                        {roleBadge(w.user_type)}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Balance
                          </p>
                          <p
                            className={cn(
                              "font-semibold",
                              w.current_balance > 0
                                ? "text-success"
                                : "text-muted-foreground",
                            )}
                          >
                            {formatCurrency(w.current_balance)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge
                            status={w.is_active ? "success" : "danger"}
                            label={w.is_active ? "Active" : "Inactive"}
                          />
                          <Button
                            size="sm"
                            disabled={w.current_balance <= 0}
                            onClick={() => {
                              setCollectTarget(w);
                              setCollectAmount("");
                              setCollectDesc("");
                            }}
                            className="gap-1.5"
                          >
                            <Banknote className="w-3.5 h-3.5" />
                            Collect
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h2>
            </div>
            {loading.transactions ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border divide-y divide-border">
                {recentActivity.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 p-4">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                        isIncoming(tx.transaction_type)
                          ? "bg-success/10"
                          : "bg-destructive/10",
                      )}
                    >
                      {isIncoming(tx.transaction_type) ? (
                        <Plus className="w-4 h-4 text-success" />
                      ) : (
                        <Minus className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          isIncoming(tx.transaction_type)
                            ? "text-success"
                            : "text-destructive",
                        )}
                      >
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {tx.related_user_name
                          ? `from ${tx.related_user_name}`
                          : tx.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(tx.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                ))}
                <button
                  className="w-full py-3 text-sm font-medium text-primary hover:bg-accent/50 transition-colors rounded-b-xl"
                  onClick={() => setActiveTab("history")}
                >
                  View All Transactions &rarr;
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ===================== TAB 2: TRANSACTION HISTORY ===================== */}
        <TabsContent value="history" className="space-y-6 mt-6">
          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="date"
                  value={txDateFrom}
                  onChange={(e) => setTxDateFrom(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  type="date"
                  value={txDateTo}
                  onChange={(e) => setTxDateTo(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select value={txTypeFilter} onValueChange={setTxTypeFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="transfer_in">Transfer In</SelectItem>
                    <SelectItem value="transfer_out">Transfer Out</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">User</Label>
                <Select value={txUserFilter} onValueChange={setTxUserFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {wallets.map((w) => (
                      <SelectItem
                        key={w.wallet_id}
                        value={`${w.user_id}-${w.user_type}`}
                      >
                        {w.user_name} ({w.user_type.replace("_", " ")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearTxFilters}
                  className="text-xs gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          {loading.transactions ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Receipt className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No transactions found
              </p>
            </div>
          ) : (
            <>
              {/* Desktop - DataTable */}
              <div className="hidden lg:block">
                <DataTable data={filteredTransactions} columns={txColumns} />
              </div>

              {/* Mobile */}
              <div className="lg:hidden space-y-3">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="mobile-card cursor-pointer"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            isIncoming(tx.transaction_type)
                              ? "bg-success/10"
                              : "bg-destructive/10",
                          )}
                        >
                          {isIncoming(tx.transaction_type) ? (
                            <ArrowDownLeft className="w-4 h-4 text-success" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-semibold text-sm",
                              isIncoming(tx.transaction_type)
                                ? "text-success"
                                : "text-destructive",
                            )}
                          >
                            {isIncoming(tx.transaction_type) ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(tx.created_at),
                              "MMM d, yyyy h:mm a",
                            )}
                          </p>
                        </div>
                      </div>
                      {txTypeBadge(tx.transaction_type)}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        {tx.related_user_name
                          ? `${isIncoming(tx.transaction_type) ? "From" : "To"}: ${tx.related_user_name}`
                          : tx.description}
                      </div>
                      {tx.shop_name && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Store className="w-3 h-3" />
                          {tx.shop_name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* ===================== COLLECT MONEY MODAL ===================== */}
      <Dialog
        open={!!collectTarget}
        onOpenChange={(open) => !open && setCollectTarget(null)}
      >
        <DialogContent className="bg-card border-border rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Collect Money from {collectTarget?.user_name}
            </DialogTitle>
            <DialogDescription>
              Transfer funds from team member to your wallet
            </DialogDescription>
          </DialogHeader>
          {collectTarget && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                {roleBadge(collectTarget.user_type)}
                <span className="font-semibold text-success">
                  {formatCurrency(collectTarget.current_balance)}
                </span>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  min={1}
                  max={collectTarget.current_balance}
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum: {formatCurrency(collectTarget.current_balance)}
                </p>
              </div>
              <div className="space-y-2">
                <Label>
                  Description{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  placeholder="Add a note..."
                  value={collectDesc}
                  onChange={(e) => setCollectDesc(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCollectTarget(null)}
              disabled={collecting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCollect}
              disabled={collecting}
              className="gap-2"
            >
              {collecting && <Loader2 className="w-4 h-4 animate-spin" />}
              <Banknote className="w-4 h-4" />
              Collect Money
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== TRANSACTION DETAILS MODAL ===================== */}
      <Dialog
        open={!!selectedTx}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      >
        <DialogContent className="bg-card border-border rounded-xl sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Full details for transaction #{selectedTx?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-5 py-2">
              {/* Section 1: Transaction Info */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Transaction Information
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-medium">#{selectedTx.id}</span>
                  <span className="text-muted-foreground">Type</span>
                  <span>{txTypeBadge(selectedTx.transaction_type)}</span>
                  <span className="text-muted-foreground">Amount</span>
                  <span
                    className={cn(
                      "font-semibold",
                      isIncoming(selectedTx.transaction_type)
                        ? "text-success"
                        : "text-destructive",
                    )}
                  >
                    {formatCurrency(selectedTx.amount)}
                  </span>
                  <span className="text-muted-foreground">Balance Before</span>
                  <span>{formatCurrency(selectedTx.balance_before)}</span>
                  <span className="text-muted-foreground">Balance After</span>
                  <span>{formatCurrency(selectedTx.balance_after)}</span>
                  <span className="text-muted-foreground">Description</span>
                  <span>{selectedTx.description}</span>
                  <span className="text-muted-foreground">Date</span>
                  <span>
                    {format(
                      new Date(selectedTx.created_at),
                      "MMM d, yyyy h:mm a",
                    )}
                  </span>
                  <span className="text-muted-foreground">Reference</span>
                  <span>
                    {selectedTx.reference_type} #{selectedTx.reference_id}
                  </span>
                </div>
              </div>

              {/* Section 2: Transfer Details */}
              {selectedTx.related_user_name && (
                <div className="space-y-1 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Transfer Details
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Direction</span>
                    <span>
                      {isIncoming(selectedTx.transaction_type)
                        ? "Received from"
                        : "Sent to"}
                    </span>
                    <span className="text-muted-foreground">User</span>
                    <span className="flex items-center gap-2">
                      {selectedTx.related_user_name}{" "}
                      {selectedTx.related_user_type &&
                        roleBadge(selectedTx.related_user_type)}
                    </span>
                    {selectedTx.initiated_by_name && (
                      <>
                        <span className="text-muted-foreground">
                          Initiated By
                        </span>
                        <span>
                          {selectedTx.initiated_by_name} (
                          {selectedTx.initiated_by_type})
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Section 3: Collection Trail */}
              {selectedTx.collection_trails &&
                selectedTx.collection_trails.length > 0 && (
                  <div className="space-y-2 border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-foreground">
                      Collection Trail ({selectedTx.trail_count} collection
                      {selectedTx.trail_count !== 1 ? "s" : ""})
                    </h3>
                    {selectedTx.collection_trails.map((trail) => (
                      <div
                        key={trail.transaction_id}
                        className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-muted-foreground" />
                            {trail.shop_name}
                          </span>
                          <StatusBadge
                            status={
                              trail.status === "pending"
                                ? "warning"
                                : trail.status === "completed"
                                  ? "success"
                                  : "neutral"
                            }
                            label={trail.status}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Owner: {trail.shop_owner}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>Route: {trail.route_name}</span>
                          <span>Zone: {trail.zone_name}</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1">
                          <span className="font-semibold text-foreground">
                            {formatCurrency(trail.collection_amount)}
                          </span>
                          <span className="text-muted-foreground">
                            {format(
                              new Date(trail.collection_date),
                              "MMM d, yyyy",
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Section 4: Metadata */}
              {selectedTx.metadata &&
                Object.keys(selectedTx.metadata).length > 0 && (
                  <div className="space-y-2 border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-foreground">
                      Metadata
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-xs">
                      {Object.entries(selectedTx.metadata).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="font-medium text-foreground">
                              {String(value)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTx(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
