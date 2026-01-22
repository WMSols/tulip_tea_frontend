import { useState } from "react";
import { ChevronUp, ChevronDown, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions?: (item: T) => React.ReactNode;
  mobileCard?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onSearch,
  actions,
  mobileCard,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-muted/30 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        <Button
          variant="outline"
          className="gap-2 border-border hover:bg-muted/50 hover:border-primary/50 transition-all duration-200"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="relative overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="data-table min-w-[640px]">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "text-xs uppercase tracking-wider whitespace-nowrap",
                    column.sortable &&
                      "cursor-pointer select-none hover:bg-muted/50 transition-colors",
                    column.className,
                  )}
                  onClick={() =>
                    column.sortable && handleSort(String(column.key))
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable &&
                      sortKey === column.key &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-primary" />
                      ))}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="w-32 text-xs uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn("whitespace-nowrap", column.className)}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] ?? "")}
                  </td>
                ))}
                {actions && (
                  <td className="whitespace-nowrap">{actions(item)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      {/* <div className="lg:hidden space-y-3">
        {data.map((item) => (
          <div key={item.id}>
            {mobileCard ? (
              mobileCard(item)
            ) : (
              <div className="mobile-card animate-fade-in-up">
                {columns.map((column) => (
                  <div key={String(column.key)} className="flex justify-between items-start gap-3">
                    <span className="text-sm text-muted-foreground shrink-0">{column.label}</span>
                    <span className="text-sm font-medium text-right">
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "")}
                    </span>
                  </div>
                ))}
                {actions && (
                  <div className="pt-3 border-t border-border flex justify-end gap-2">
                    {actions(item)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div> */}

      {data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
          <p className="text-sm">No data available</p>
        </div>
      )}
    </div>
  );
}
